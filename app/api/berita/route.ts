import { NextResponse } from "next/server";

// Berita & Artikel Islam — diambil langsung dari RSS resmi penerbit,
// TANPA mengarang. Gagal fetch = item kosong + pesan error, bukan berita palsu.
//
// Sumber v1 (terverifikasi 20 Nov 2026, dua-duanya mengembalikan item segar):
//  - Republika — https://www.republika.co.id/rss (feed Islam khusus /rss/islam
//    ternyata isinya sama dengan feed utama, jadi feed utama difilter kata
//    kunci Islam di bawah)
//  - NU Online — https://www.nu.or.id/rss.xml (NB: /feed dan /rss hanya
//    mengembalikan HTML beranda, bukan RSS — jangan dipakai)
// Cadangan bila salah satu mati: https://muslim.or.id/feed (terverifikasi 50 item).

export const revalidate = 600; // cache 10 menit

export type BeritaItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string; // ISO
};

const SOURCES: { name: string; url: string; islamOnly: boolean }[] = [
  { name: "Republika", url: "https://www.republika.co.id/rss", islamOnly: true },
  { name: "NU Online", url: "https://www.nu.or.id/rss.xml", islamOnly: false },
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

async function fetchSource(src: (typeof SOURCES)[number]): Promise<BeritaItem[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(src.url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "ABEE-Muslim/1.0 (+https://abee-muslim.vercel.app)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    if (!xml.includes("<rss") && !xml.includes("<feed")) throw new Error("Bukan RSS");
    const items = parseRss(xml);
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
  } finally {
    clearTimeout(timer);
  }
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
