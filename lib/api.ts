// Data live: jadwal shalat resmi Kemenag (MyQuran API; fallback Aladhan),
// Hijriah Kemenag/MABIMS (Aladhan API, kalender Umm al-Qura), cuaca
// (Open-Meteo), hitung mundur Ramadhan, dan arah kiblat.
// TANGGAL HIJRIAH TIDAK PERNAH dihitung dari Intl di perangkat — selalu
// dari API Aladhan, supaya tidak bisa jatuh ke bulan Masehi. Kalau API
// gagal, UI menampilkan status memuat/error, bukan tanggal tebakan.

import { JUZ30_SURAHS } from "./data";
import { normalizeArabicText } from "./reading";

export type City = { name: string; lat: number; lon: number; myquranId: string };

export const CITIES: City[] = [
  { name: "Bangil", lat: -7.6, lon: 112.82, myquranId: "1620" }, // KAB. PASURUAN
  { name: "Mojokerto", lat: -7.47, lon: 112.43, myquranId: "1635" }, // KOTA MOJOKERTO
  { name: "Surabaya", lat: -7.26, lon: 112.75, myquranId: "1638" }, // KOTA SURABAYA
  { name: "Jakarta", lat: -6.21, lon: 106.85, myquranId: "1301" }, // KOTA JAKARTA
  { name: "Bandung", lat: -6.91, lon: 107.61, myquranId: "1219" }, // KOTA BANDUNG
  { name: "Yogyakarta", lat: -7.8, lon: 110.36, myquranId: "1505" }, // KOTA YOGYAKARTA
  { name: "Medan", lat: 3.59, lon: 98.68, myquranId: "0228" }, // KOTA MEDAN
  { name: "Makassar", lat: -5.15, lon: 119.44, myquranId: "2622" }, // KOTA MAKASSAR
];

export type Timings = {
  Imsak: string;
  Subuh: string;
  Terbit: string;
  Dhuha: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
  dateGregorian: string;
  dateHijri: string;
};

/** Tanggal hari ini di zona Asia/Jakarta (bukan UTC perangkat). */
export function todayJakarta(now = new Date()): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day") };
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const strip = (s: string) => s.slice(0, 5);

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (((h * 60 + m + mins) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

async function fetchJson(url: string, timeoutMs = 12000): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

// ---------- Tanggal Hijriah (API Aladhan, Umm al-Qura / MABIMS) ----------

export const HIJRI_MONTHS_ID = [
  "Muharram",
  "Safar",
  "Rabiulawal",
  "Rabiulakhir",
  "Jumadilawal",
  "Jumadilakhir",
  "Rajab",
  "Syakban",
  "Ramadan",
  "Syawal",
  "Zulkaidah",
  "Zulhijah",
];

export const HIJRI_MONTHS_SHORT_ID = [
  "Muh",
  "Saf",
  "Rab. Awal",
  "Rab. Akhir",
  "Jum. Awal",
  "Jum. Akhir",
  "Raj",
  "Syak",
  "Ram",
  "Syaw",
  "Zulka",
  "Zulhi",
];

export function formatHijri(day: number, month: number, year: number): string {
  const name = HIJRI_MONTHS_ID[month - 1] ?? "";
  return `${day} ${name} ${year} H`;
}

/** Pasaran Jawa (Legi–Pahing–Pon–Wage–Kliwon). Jangkar terverifikasi: 19 Nov 2026 = Kliwon. */
export const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
export function pasaranJawa(d = new Date()): string {
  const anchor = new Date(2026, 10, 19); // 19 Nov 2026 = Kliwon
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day.getTime() - anchor.getTime()) / 86400000);
  return PASARAN[(((4 + diff) % 5) + 5) % 5];
}

const BULAN_SINGKAT_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nop",
  "Des",
];

/** Tanggal Masehi singkat Indonesia, mis. "19 Nop 2026". */
export function gregShortId(d = new Date()): string {
  return `${d.getDate()} ${BULAN_SINGKAT_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export type HijriParts = { day: number; month: number; year: number };

const hijriCache = new Map<string, { at: number; data: HijriParts }>();

async function fetchHijriParts(now = new Date()): Promise<HijriParts> {
  const { y, m, d } = todayJakarta(now);
  const key = `${y}-${m}-${d}`;
  const cached = hijriCache.get(key);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const json = (await fetchJson(
    `https://api.aladhan.com/v1/gToH/${pad2(d)}-${pad2(m)}-${y}`
  )) as {
    data?: { hijri?: { day?: string; month?: { number?: number }; year?: string } };
  };
  const h = json.data?.hijri;
  if (!h?.day || !h.month?.number || !h.year) {
    throw new Error("Format gToH tidak dikenal");
  }
  const data: HijriParts = {
    day: Number(h.day),
    month: Number(h.month.number),
    year: Number(h.year),
  };
  hijriCache.set(key, { at: Date.now(), data });
  return data;
}

/**
 * Tanggal Hijriah hari ini, dari Aladhan (kalender Umm al-Qura / MABIMS).
 * Satu-satunya sumber tanggal Hijriah di aplikasi — TIDAK ADA fallback ke
 * Intl, supaya tidak pernah tampil bulan Masehi. Gagal = throw, UI
 * menampilkan status memuat/error.
 */
export async function getHijriToday(now = new Date()): Promise<string> {
  const h = await fetchHijriParts(now);
  return formatHijri(h.day, h.month, h.year);
}

const timingCache = new Map<string, { at: number; data: Timings }>();

/**
 * Jadwal shalat hari ini — sumber utama jadwal RESMI Kemenag (Bimas Islam)
 * lewat MyQuran API; tanggal Hijriah dari Aladhan gToH. Fallback kalau
 * MyQuran gagal: Aladhan method 20 (Kemenag) + ihtiyat 2 menit untuk 5
 * waktu shalat (Terbit tanpa ihtiyat), Imsak = Subuh − 10 menit,
 * Dhuha = Terbit + 30 menit (perkiraan; hanya di jalur fallback).
 */
export async function getTimings(city: string): Promise<Timings> {
  const { y, m, d } = todayJakarta();
  const key = `${city.toLowerCase()}|${y}-${m}-${d}`;
  const cached = timingCache.get(key);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const c = CITIES.find((x) => x.name === city) ?? CITIES[0];
  const greg = `${y}-${pad2(m)}-${pad2(d)}`;

  // Tanggal Hijriah (Aladhan gToH) dimuat paralel dengan jadwal.
  const hijriP = fetchHijriParts().catch(() => null);

  try {
    const json = (await fetchJson(
      `https://api.myquran.com/v1/sholat/jadwal/${c.myquranId}/${y}/${m}/${d}`
    )) as { data?: { jadwal?: Record<string, string> } };
    const j = json.data?.jadwal;
    if (!j?.subuh || !j?.maghrib) throw new Error("Format MyQuran tidak dikenal");
    const h = await hijriP;
    const data: Timings = {
      Imsak: strip(j.imsak),
      Subuh: strip(j.subuh),
      Terbit: strip(j.terbit),
      Dhuha: strip(j.dhuha),
      Dzuhur: strip(j.dzuhur),
      Ashar: strip(j.ashar),
      Maghrib: strip(j.maghrib),
      Isya: strip(j.isya),
      dateGregorian: greg,
      dateHijri: h ? formatHijri(h.day, h.month, h.year) : "",
    };
    timingCache.set(key, { at: Date.now(), data });
    return data;
  } catch {
    // Fallback: Aladhan method 20 + ihtiyat 2 menit.
    // school=0 = Syafi'i (bayangan 1x panjang benda) — JANGAN ubah ke Hanafi (school=1).
    const json = (await fetchJson(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        city
      )}&country=Indonesia&method=20&school=0`
    )) as {
      data?: {
        timings?: Record<string, string>;
        date?: {
          hijri?: { day?: string; month?: { number?: number }; year?: string };
          gregorian?: { date?: string };
        };
      };
    };
    const t = json.data?.timings;
    const h = json.data?.date?.hijri;
    if (!t?.Fajr || !t?.Maghrib) throw new Error("Aladhan gagal");
    const subuh = addMinutes(strip(t.Fajr), 2);
    const data: Timings = {
      Imsak: addMinutes(subuh, -10),
      Subuh: subuh,
      Terbit: strip(t.Sunrise),
      Dhuha: addMinutes(strip(t.Sunrise), 30),
      Dzuhur: addMinutes(strip(t.Dhuhr), 2),
      Ashar: addMinutes(strip(t.Asr), 2),
      Maghrib: addMinutes(strip(t.Maghrib), 2),
      Isya: addMinutes(strip(t.Isha), 2),
      dateGregorian: json.data?.date?.gregorian?.date ?? greg,
      dateHijri:
        h?.day && h.month?.number && h.year
          ? formatHijri(Number(h.day), Number(h.month.number), Number(h.year))
          : "",
    };
    timingCache.set(key, { at: Date.now(), data });
    return data;
  }
}

export type PrayerName = keyof Omit<Timings, "dateGregorian" | "dateHijri" | "Dhuha">;
/** Urutan target hitung mundur: Imsak → Subuh → Terbit → Dzuhur → Ashar → Maghrib → Isya → Imsak besok. */
export const PRAYER_ORDER: PrayerName[] = [
  "Imsak",
  "Subuh",
  "Terbit",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

/** Urutan lengkap untuk halaman Jadwal Shalat (termasuk Dhuha). */
export const JADWAL_ORDER: (keyof Omit<Timings, "dateGregorian" | "dateHijri">)[] = [
  "Imsak",
  "Subuh",
  "Terbit",
  "Dhuha",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

export function nextPrayer(
  timings: Timings,
  now = new Date()
): { name: PrayerName; at: Date; label: string } {
  // Jam perangkat lokal (bukan UTC): getHours()/getMinutes() sudah lokal.
  const [h, m] = [now.getHours(), now.getMinutes()];
  const nowMin = h * 60 + m;
  for (const name of PRAYER_ORDER) {
    const [ph, pm] = timings[name].split(":").map(Number);
    if (ph * 60 + pm > nowMin) {
      const at = new Date(now);
      at.setHours(ph, pm, 0, 0);
      return { name, at, label: name === "Terbit" ? "Terbit (Syuruq)" : name };
    }
  }
  // Setelah Isya: Imsak besok.
  const [ph, pm] = timings.Imsak.split(":").map(Number);
  const at = new Date(now);
  at.setDate(at.getDate() + 1);
  at.setHours(ph, pm, 0, 0);
  return { name: "Imsak", at, label: "Imsak (besok)" };
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/**
 * Hitung mundur dengan kata-kata ("3 jam 5 menit lagi") — bukan angka
 * HH:MM:SS besar yang bisa dikira jam sekarang.
 */
export function formatCountdownWords(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return m > 0 ? `${h} jam ${m} menit lagi` : `${h} jam lagi`;
  if (m > 0) return `${m} menit lagi`;
  if (sec > 0) return `${sec} detik lagi`;
  return "Sekarang";
}

// ---------- Kalender Hijriah sebulan & hitung mundur Ramadhan (API) ----------

const hijriCalCache = new Map<string, { at: number; data: Map<number, HijriParts> }>();

/**
 * Kalender Hijriah sebulan penuh (bulan Masehi y-m) dari Aladhan
 * gToHCalendar. Mengembalikan peta tanggal Masehi -> tanggal Hijriah.
 */
export async function getHijriMonthCalendar(
  y: number,
  m: number
): Promise<Map<number, HijriParts>> {
  const key = `${y}-${m}`;
  const cached = hijriCalCache.get(key);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const json = (await fetchJson(
    `https://api.aladhan.com/v1/gToHCalendar/${m}/${y}`
  )) as {
    data?: {
      gregorian?: { day?: string };
      hijri?: { day?: string; month?: { number?: number }; year?: string };
    }[];
  };
  if (!Array.isArray(json.data) || json.data.length === 0) {
    throw new Error("Format gToHCalendar tidak dikenal");
  }
  const map = new Map<number, HijriParts>();
  for (const x of json.data) {
    const gd = Number(x.gregorian?.day ?? 0);
    const h = x.hijri;
    if (gd && h?.day && h.month?.number && h.year) {
      map.set(gd, {
        day: Number(h.day),
        month: Number(h.month.number),
        year: Number(h.year),
      });
    }
  }
  hijriCalCache.set(key, { at: Date.now(), data: map });
  return map;
}

export type RamadhanInfo = { days: number; date: Date; dateText: string };

const ramadhanCache = new Map<string, { at: number; data: RamadhanInfo }>();

/**
 * Hitung mundur ke 1 Ramadan berikutnya. Tanggal 1 Ramadan diambil dari
 * Aladhan hToG (Hijri -> Masehi, kalender Umm al-Qura / MABIMS).
 * Terverifikasi: 1 Ramadan 1448 = 8 Feb 2027, jadi dari 19 Nov 2026
 * = 81 hari (dari 20 Nov 2026 = 80 hari).
 */
export async function getRamadhanInfo(now = new Date()): Promise<RamadhanInfo> {
  const { y, m, d } = todayJakarta(now);
  const key = `${y}-${m}-${d}`;
  const cached = ramadhanCache.get(key);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const h = await fetchHijriParts(now);
  let targetYear = h.year;
  if (h.month > 9 || (h.month === 9 && h.day > 1)) targetYear = h.year + 1;
  const json = (await fetchJson(
    `https://api.aladhan.com/v1/hToG/01-09-${targetYear}`
  )) as {
    data?: { gregorian?: { day?: string; month?: { number?: number }; year?: string } };
  };
  const g = json.data?.gregorian;
  if (!g?.day || !g.month?.number || !g.year) {
    throw new Error("Format hToG tidak dikenal");
  }
  const target = new Date(Number(g.year), Number(g.month.number) - 1, Number(g.day));
  const start = new Date(y, m - 1, d);
  const days = Math.round((target.getTime() - start.getTime()) / 86400000);
  const dateText = target.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const data: RamadhanInfo = { days, date: target, dateText };
  ramadhanCache.set(key, { at: Date.now(), data });
  return data;
}

export type Weather = {
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  desc: string;
};

const WMO: Record<number, string> = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan",
  3: "Mendung",
  45: "Berkabut",
  48: "Berkabut",
  51: "Gerimis",
  53: "Gerimis",
  55: "Gerimis",
  61: "Hujan Ringan",
  63: "Hujan",
  65: "Hujan Lebat",
  80: "Hujan Ringan",
  81: "Hujan",
  82: "Hujan Lebat",
  95: "Badai Petir",
};

/** Cuaca saat ini dari Open-Meteo (gratis, tanpa API key). Timeout 10 detik supaya tidak loading selamanya. */
export async function getWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = await res.json();
  const c = json.current;
  const code = Number(c.weather_code);
  return {
    temp: Math.round(Number(c.temperature_2m)),
    humidity: Number(c.relative_humidity_2m),
    wind: Number(c.wind_speed_10m),
    code,
    desc: WMO[code] ?? "Berawan",
  };
}

/**
 * Arah kiblat (derajat dari utara SEJATI) dari posisi pengguna.
 * Rumus great-circle standar (atan2) — Ka'bah 21.422510, 39.826172
 * (presisi emnopal/arah_kiblat).
 * Verifikasi silang dengan rumus emnopal (src/count.py, arctan + 270°):
 * Bangil 294.091°, Jakarta 295.151°, Surabaya 294.036°, Bandung 295.167°,
 * Medan 292.767° — selisih < 0.001° di semua kota Indonesia.
 * Rumus emnopal TIDAK dipakai sebagai pengganti: ia hanya benar untuk
 * belahan selatan di timur Mekkah (Indonesia) dan salah di luar itu
 * (Jeddah 263.6° padahal seharusnya ~96°, London 241° padahal ~119°).
 * Catatan: hasil ini utara sejati; kompas HP membaca utara MAGNET —
 * deklinasi di Bangil ~+0,5–1° (galat kecil yang diketahui, lebih kecil
 * dari goyangan sensor HP).
 */
export function qiblaBearing(lat: number, lon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const kaabaLat = 21.42251;
  const kaabaLon = 39.826172;
  const dLon = toRad(kaabaLon - lon);
  const y = Math.sin(dLon);
  const x =
    Math.cos(toRad(lat)) * Math.tan(toRad(kaabaLat)) -
    Math.sin(toRad(lat)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// ---------- Daftar 114 surah ----------

export type SurahMeta = {
  number: number;
  name: string; // nama Arab
  englishName: string; // nama Latin
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

const surahListCache = new Map<string, { at: number; data: SurahMeta[] }>();

/** Daftar 114 surah dari AlQuran Cloud API (nama Latin/Arab, jumlah ayat, tempat turun). */
export async function getSurahList(): Promise<SurahMeta[]> {
  const cached = surahListCache.get("all");
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  if (!res.ok) throw new Error(`AlQuran Cloud ${res.status}`);
  const json = await res.json();
  if (json.code !== 200 || !Array.isArray(json.data)) throw new Error("Format surah tidak dikenal");
  const data: SurahMeta[] = json.data.map((s: SurahMeta) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
  surahListCache.set("all", { at: Date.now(), data });
  return data;
}

/** Cadangan saat offline: 7 surah Juz 30 yang sudah tertanam di aplikasi. */
export function embeddedSurahMeta(): SurahMeta[] {
  const revelation: Record<number, "Meccan" | "Medinan"> = {
    103: "Meccan",
    108: "Meccan",
    109: "Meccan",
    110: "Medinan",
    112: "Meccan",
    113: "Meccan",
    114: "Meccan",
  };
  return JUZ30_SURAHS.map((s) => ({
    number: s.no,
    name: s.arabicName,
    englishName: s.name,
    englishNameTranslation: "",
    numberOfAyahs: s.ayahs,
    revelationType: revelation[s.no] ?? "Meccan",
  }));
}

// ---------- Teks Al-Qur'an (sumber yang bisa dipertanggungjawabkan) ----------

/** Catatan sumber yang ditampilkan di aplikasi (halaman baca + Atur). */
export const QURAN_SOURCE_NOTE =
  "Teks Arab: Ejaan Simple (Imla'i, Tanzil) · Terjemahan: Kemenag RI (Edisi Penyempurnaan 2019)";

export type SurahText = { arabic: string[]; translation: string[] };

function stripTranslationHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const DIACRITIC_RE = /[\u064B-\u0654\u0670\u0640\u06D6-\u06ED]/; // tanpa flag g: .test() stateless

/** Hapus Basmalah di awal ayat 1 (edisi AlQuran Cloud menempelkannya di ayat 1). */
function stripLeadingBismillah(text: string): string {
  const skeleton = "بسماللهالرحمنالرحيم"; // 19 huruf
  let letters = 0;
  let cut = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (DIACRITIC_RE.test(ch)) continue;
    const base =
      ch === "ٱ" || ch === "أ" || ch === "إ" || ch === "آ" ? "ا" : ch === "ة" ? "ه" : ch;
    if (base !== skeleton[letters]) return text;
    letters++;
    if (letters === skeleton.length) {
      cut = i + 1;
      break;
    }
  }
  if (cut < 0) return text;
  return text.slice(cut).trim();
}

/**
 * Ambil teks satu surah: Arab Simple (Imla'i) + terjemahan Kemenag 2019.
 * Utama: Quran.com API v4 — fields=text_imlaei (ejaan Simple / Imla'i,
 * Tanzil) + translations=33 ("Indonesian Islamic Affairs Ministry" =
 * Kemenag RI Edisi Penyempurnaan 2019). Satu panggilan untuk Arab +
 * terjemahan; per_page=300 menutupi surah terpanjang (286 ayat).
 * Cadangan kalau Quran.com gagal: AlQuran Cloud edisi "quran-simple"
 * (standar, BUKAN edisi default "quran-uthmani-quran-academy") +
 * "id.indonesian" (terjemahan Kemenag edisi lama — tetap valid, hanya cadangan).
 * Ayat 1 dari cadangan dibersihkan dari Basmalah yang menempel, karena
 * Basmalah ditampilkan sebagai baris tersendiri di atas teks (kecuali
 * surah 1 yang Basmalah-nya memang ayat 1, dan surah 9 yang tanpa Basmalah).
 */
/**
 * Teks tajwid satu surah (warna per hukum bacaan) dari Quran.com API v4:
 * `quran/verses/uthmani_tajweed` — teks Mushaf Uthmani yang sama dengan
 * sumber data tajwid, ditambah tag `<tajweed class=X>` per huruf dan
 * `<span class=end>` penanda akhir ayat. per_page=300 menutupi surah
 * terpanjang (286 ayat); tanpa per_page API hanya mengembalikan 10 ayat.
 * Tidak ada cadangan: kalau gagal, pemanggil memakai teks polos.
 * CATATAN: baris-baris ini masih ejaan Uthmani — pemanggil (reader)
 * memetakan warna tajwidnya ke ejaan Simple via lib/tajweed-map
 * (mapTajweedSurah), supaya ejaan TIDAK berubah saat toggle tajwid
 * dimatikan/dinyalakan.
 */
export async function fetchSurahTajweed(surahNo: number): Promise<string[]> {
  const json = (await fetchJson(
    `https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${surahNo}&per_page=300`
  )) as { verses?: { text_uthmani_tajweed?: string }[] };
  const verses = json.verses;
  if (!verses || verses.length === 0) throw new Error("Quran.com tajwid: tidak ada ayat");
  const lines = verses.map((v) => (v.text_uthmani_tajweed ?? "").trim());
  if (lines.some((l) => !l)) throw new Error("Quran.com tajwid: teks ayat kosong");
  return lines;
}

/**
 * Teks Uthmani polos satu surah (Quran.com API v4:
 * `quran/verses/uthmani`, field `text_uthmani`) — SUMBER tanda sifir
 * (mustadir U+06DF + mustathil U+06E0) dan saktah yang hilang di teks
 * Simple. Teks tajwid HTML (`uthmani_tajweed`) TIDAK bisa dipakai untuk
 * ini: ia membuang hampir semua sifir (hanya 66/3.988 mustadir + 1/66
 * mustathil yang tersisa). Dipakai bersama fetchSurahTajweed sebagai
 * masukan mapper (mapTajweedSurah). Tidak ada cadangan: kalau gagal,
 * pemanggil memakai mapper tanpa teks Uthmani (sifir tidak kembali,
 * waqaf + maddah tetap tampil).
 */
export async function fetchSurahUthmani(surahNo: number): Promise<string[]> {
  const json = (await fetchJson(
    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNo}&per_page=300`
  )) as { verses?: { text_uthmani?: string }[] };
  const verses = json.verses;
  if (!verses || verses.length === 0) throw new Error("Quran.com Uthmani: tidak ada ayat");
  const lines = verses.map((v) => (v.text_uthmani ?? "").trim());
  if (lines.some((l) => !l)) throw new Error("Quran.com Uthmani: teks ayat kosong");
  return lines;
}

export async function fetchSurahText(surahNo: number): Promise<SurahText> {
  try {
    const json = (await fetchJson(
      `https://api.quran.com/api/v4/verses/by_chapter/${surahNo}?translations=33&fields=text_imlaei&per_page=300`
    )) as {
      verses?: {
        verse_number?: number;
        text_imlaei?: string;
        translations?: { text?: string }[];
      }[];
    };
    const verses = json.verses;
    if (!verses || verses.length === 0) throw new Error("Quran.com: tidak ada ayat");
    // Normalisasi maddah global (U+0672 -> U+0670): teks polos Quran.com
    // sudah bersih hari ini, tapi normalisasi di sini menutup semua jalur
    // API — reader Qur'an + Yasin — bila suatu saat datanya berubah.
    const arabic = verses.map((v) => normalizeArabicText((v.text_imlaei ?? "").trim()));
    const translation = verses.map((v) =>
      stripTranslationHtml(v.translations?.[0]?.text ?? "")
    );
    if (arabic.some((a) => !a)) throw new Error("Quran.com: teks ayat kosong");
    return { arabic, translation };
  } catch {
    const [ar, id] = (await Promise.all([
      fetchJson(`https://api.alquran.cloud/v1/surah/${surahNo}/quran-simple`),
      fetchJson(`https://api.alquran.cloud/v1/surah/${surahNo}/id.indonesian`),
    ])) as {
      code?: number;
      data?: { ayahs?: { text?: string }[] };
    }[];
    if (ar.code !== 200 || id.code !== 200) throw new Error("Surah tidak ditemukan");
    let arabic = (ar.data?.ayahs ?? []).map((a) =>
      normalizeArabicText((a.text ?? "").trim())
    );
    const translation = (id.data?.ayahs ?? []).map((a) => (a.text ?? "").trim());
    if (arabic.length === 0) throw new Error("Surah tidak ditemukan");
    if (surahNo !== 1 && arabic[0]) arabic = [stripLeadingBismillah(arabic[0]), ...arabic.slice(1)];
    return { arabic, translation };
  }
}
