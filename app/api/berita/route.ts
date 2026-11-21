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
  imageUrl?: string; // gambar sampul (untuk slider beranda)
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

// Istilah olahraga — artikel olahraga dikecualikan walau mengandung kata
// kunci Islam (mis. nama orang "Imam"/"Muslim", atau hari "Jumat" di tanggal).
const SPORTS_KEYWORDS = [
  "suporter", "laga", "skor", "semifinal", "perempat final", "badminton",
  "sepak bola", "timnas", "pssi", "pertandingan", "liga",
];
// Kata pendek — hanya cocok bila berdiri sendiri ("golongan" bukan "gol").
const SPORTS_WORDS = [/\bgol\b/];

function isIslamic(title: string, description: string): boolean {
  // Hapus "Jumat" yang diikuti tanggal ("Jumat (20/11/2026)",
  // "Jumat, 20 November 2026") — itu nama hari, bukan topik Islam.
  // "Shalat Jumat" / "Jumat Berkah" (tanpa tanggal) tetap dihitung.
  const hay = ` ${title} ${description} `
    .toLowerCase()
    .replace(/\bjum['’]?at\b\s*[,(\[]?\s*\d/g, " ");
  if (SPORTS_KEYWORDS.some((k) => hay.includes(k))) return false;
  if (SPORTS_WORDS.some((re) => re.test(hay))) return false;
  return ISLAM_KEYWORDS.some((k) => hay.includes(k));
}

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

// Isi mentah (masih ada tag HTML) — untuk mencari <img>.
function rawPick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? stripCdata(m[1].trim()) : "";
}

// Gambar dari feed RSS: media:content / media:thumbnail / enclosure, lalu
// <img> pertama di content:encoded / description. (Diuji 20 Nov 2026: ketiga
// feed TIDAK menyediakan gambar di RSS — NU Online & Muslim.or.id tanpa
// media:content/enclosure/img sama sekali — jadi gambar utama diambil dari
// og:image halaman artikel, lihat fetchOgImage di bawah.)
function extractImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractMediaUrl(block: string): string | null {
  const m =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
  return m ? decodeEntities(m[1].trim()) : null;
}

// Gambar sampul dari halaman artikel (og:image, fallback twitter:image).
// Dipakai karena RSS ketiga sumber tidak membawa gambar.
function extractOgImage(html: string): string | null {
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

async function fetchOgImage(link: string): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(link, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return extractOgImage(await res.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseRss(xml: string): { title: string; link: string; publishedAt: string; description: string; imageUrl?: string }[] {
  const out: { title: string; link: string; publishedAt: string; description: string; imageUrl?: string }[] = [];
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
      imageUrl:
        extractMediaUrl(block) ??
        extractImgSrc(rawPick(block, "content:encoded")) ??
        extractImgSrc(rawPick(block, "description")) ??
        undefined,
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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
        ? items.filter((it) => isIslamic(it.title, it.description))
        : items;
      return kept.map((it) => ({
        title: it.title,
        link: it.link,
        source: src.name,
        publishedAt: it.publishedAt ? new Date(it.publishedAt).toISOString() : new Date(0).toISOString(),
        imageUrl: it.imageUrl,
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
  // Lengkapi gambar sampul untuk 10 item teratas (dipakai slider beranda):
  // ambil og:image dari halaman artikel, paralel, gagal = item tanpa gambar.
  await Promise.all(
    items.slice(0, 10).map(async (it) => {
      if (!it.imageUrl) {
        const og = await fetchOgImage(it.link);
        if (og) it.imageUrl = og;
      }
    })
  );
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
