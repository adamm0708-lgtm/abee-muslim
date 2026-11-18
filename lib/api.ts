// Data live: jadwal shalat (Aladhan API), cuaca (Open-Meteo), Hijriah (Intl),
// hitung mundur Ramadhan, dan arah kiblat. Tidak ada data yang dikarang.

import { JUZ30_SURAHS } from "./data";

export type City = { name: string; lat: number; lon: number };

export const CITIES: City[] = [
  { name: "Bangil", lat: -7.6, lon: 112.82 },
  { name: "Mojokerto", lat: -7.47, lon: 112.43 },
  { name: "Surabaya", lat: -7.26, lon: 112.75 },
  { name: "Jakarta", lat: -6.21, lon: 106.85 },
  { name: "Bandung", lat: -6.91, lon: 107.61 },
  { name: "Yogyakarta", lat: -7.8, lon: 110.36 },
  { name: "Medan", lat: 3.59, lon: 98.68 },
  { name: "Makassar", lat: -5.15, lon: 119.44 },
];

export type Timings = {
  Subuh: string;
  Terbit: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
  dateGregorian: string;
  dateHijri: string;
};

const timingCache = new Map<string, { at: number; data: Timings }>();

/** Jadwal shalat hari ini dari Aladhan API (method 20 = Kemenag RI). */
export async function getTimings(city: string): Promise<Timings> {
  const key = city.toLowerCase();
  const cached = timingCache.get(key);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return cached.data;
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
    city
  )}&country=Indonesia&method=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan ${res.status}`);
  const json = await res.json();
  const t = json.data.timings as Record<string, string>;
  const strip = (s: string) => s.slice(0, 5);
  const data: Timings = {
    Subuh: strip(t.Fajr),
    Terbit: strip(t.Sunrise),
    Dzuhur: strip(t.Dhuhr),
    Ashar: strip(t.Asr),
    Maghrib: strip(t.Maghrib),
    Isya: strip(t.Isha),
    dateGregorian: json.data.date.gregorian.date,
    dateHijri: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year} H`,
  };
  timingCache.set(key, { at: Date.now(), data });
  return data;
}

export type PrayerName = keyof Omit<Timings, "dateGregorian" | "dateHijri">;
export const PRAYER_ORDER: PrayerName[] = [
  "Subuh",
  "Terbit",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

export function nextPrayer(
  timings: Timings,
  now = new Date()
): { name: PrayerName; at: Date; label: string } {
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
  // Setelah Isya: Subuh besok
  const [ph, pm] = timings.Subuh.split(":").map(Number);
  const at = new Date(now);
  at.setDate(at.getDate() + 1);
  at.setHours(ph, pm, 0, 0);
  return { name: "Subuh", at, label: "Subuh (besok)" };
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/** Tanggal Hijriah hari ini, dihitung dari Intl (kalender islamic). */
export function hijriToday(now = new Date()): string {
  try {
    return new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
  } catch {
    return "";
  }
}

export function hijriParts(d: Date): { day: number; month: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { day: get("day"), month: get("month"), year: get("year") };
}

/** Jumlah hari menuju 1 Ramadhan berikutnya (dihitung dengan kalender Hijriah Intl). */
export function daysToRamadhan(now = new Date()): number {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < 400; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const h = hijriParts(d);
    if (h.month === 9 && h.day === 1) return i;
  }
  return -1;
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

/** Cuaca saat ini dari Open-Meteo (gratis, tanpa API key). */
export async function getWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url);
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

/** Arah kiblat (derajat dari utara) dari posisi pengguna — Ka'bah 21.4225, 39.8262. */
export function qiblaBearing(lat: number, lon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
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
