import { NextResponse } from "next/server";

// Berita & Artikel Islam — diambil langsung dari RSS resmi penerbit,
// TANPA mengarang. Gagal fetch = item kosong + pesan error, bukan berita palsu.
//
// Sumber v1 (terverifikasi 20 Nov 2026, semuanya mengembalikan item segar):
//  - Republika — https://www.republika.co.id/rss (feed Islam khusus /rss/islam
//    ternyata isinya sama dengan feed utama, jadi feed utama difilter kata
//    kunci Islam di bawah)
//  - NU Online — https://www.nu.or.id/rss.xml (NB: /feed dan /rss hanya
//    mengembalikan HTML beranda, bukan RSS — jangan dipakai). CATATAN: dari
//    server Vercel, NU Online GAGAL dua kali (dari VM ini 200) — kemungkinan
//    IP server Vercel diblokir; karena itu dicoba juga host apex + sumber
//    ketiga di bawah.
//  - Muslim.or.id — https://muslim.or.id/feed (50 item, situs Islam)

export const revalidate = 600; // cache 10 menit

export type BeritaItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string; // ISO
};

const SOURCES: { name: string; urls: string[]; islamOnly: boolean }[] = [
  { name: "Republika", urls: ["https://www.republika.co.id/rss"], islamOnly: true },
  {
    name: "NU Online",
    urls: ["https://www.nu.or.id/rss.xml", "https://nu.or.id/rss.xml"],
    islamOnly: false,
  },
  { name: "Muslim.or.id", urls: ["https://muslim.or.id/feed"], islamOnly: false },
];

// Filter Republika (feed umum): hanya judul/deskripsi bertema Islam.
const ISLAM_KEYWORDS = [
  "islam", "syariah", "masjid", "haji", "umrah", "umroh", "qur'an", "quran",
  "al-quran", "ulama", "pesantren", "wakaf", "ramadhan", "ramadan", "shalat",
  "sholat", "zakat", "kyai", "ustaz", "ustadz", "mui", "kemenag", "wamenag",
  "madrasah", "santri", "dakwah", "fiqih", "fikih", "fatwa", "halal", "hijrah",
  "imam", "khatib", "tarawih", "idul", "lebaran", "kurban", "aqiqah", "tauhid",
  "akidah", "sunnah", "hadits", "hadis", "nabi", "rasul", "muslim", "mukmin",
  "ibadah", "dzikir", "zikir", "tasbih", "tahajud", "dhuha", "puasa", "sedekah",
  "infak", "infaq", "yatim", "pondok", "tafsir", "mushaf", "tilawah", "murottal",
  "khutbah", "jumat", "jum'at", "buka puasa", "sahur", "shahih", "shohih",
];

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decodeEntities(stripCdata(m[1].trim())) : "";
}

function parseRss(xml: string): { title: string; link: string; publishedAt: string; description: string }[] {
  const out: { title: string; link: string; publishedAt: string; description: string }[] = [];
  const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  for (const block of blocks) {
    const title = pick(block, "title");
    const link = pick(block, "link");
    if (!title || !link) continue;
    out.push({
      title,
      link,
      publishedAt: pick(block, "pubDate"),
      description: pick(block, "description").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });
  }
  return out;
}

async function fetchOne(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36",
      },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    if (!xml.includes("<rss") && !xml.includes("<feed")) throw new Error("Bukan RSS");
    return xml;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSource(src: (typeof SOURCES)[number]): Promise<BeritaItem[]> {
  // Coba tiap URL bergiliran, lalu ulangi URL pertama sekali (retry).
  const attempts = [...src.urls, src.urls[0]];
  let lastErr: unknown = null;
  for (const url of attempts) {
    try {
      const items = parseRss(await fetchOne(url));
      const kept = src.islamOnly
        ? items.filter((it) => {
            const hay = `${it.title} ${it.description}`.toLowerCase();
            return ISLAM_KEYWORDS.some((k) => hay.includes(k));
          })
        : items;
      return kept.map((it) => ({
        title: it.title,
        link: it.link,
        source: src.name,
        publishedAt: it.publishedAt ? new Date(it.publishedAt).toISOString() : new Date(0).toISOString(),
      }));
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gagal memuat feed");
}

export async function GET() {
  const settled = await Promise.allSettled(SOURCES.map((s) => fetchSource(s)));
  const items: BeritaItem[] = [];
  const failedSources: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") items.push(...r.value);
    else failedSources.push(SOURCES[i].name);
  });
  items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const body = {
    items: items.slice(0, 30),
    sources: SOURCES.filter((s) => !failedSources.includes(s.name)).map((s) => s.name),
    failedSources,
    fetchedAt: new Date().toISOString(),
  };
  if (items.length === 0) {
    return NextResponse.json({ ...body, error: "Berita tidak bisa dimuat" }, { status: 502 });
  }
  return NextResponse.json(body);
}
