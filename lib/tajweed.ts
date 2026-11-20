import { normalizeArabicText } from "./reading";

// Warna tajwid untuk mode baca Al-Qur'an (Ngaji).
//
// Data: Quran.com API v4 — endpoint `quran/verses/uthmani_tajweed`
// (teks Mushaf Uthmani yang sama dengan yang dipakai aplikasi, ditambah
// anotasi tajwid per huruf). Respons berisi tag `<tajweed class=X>` dan
// `<span class=end>N</span>` (penanda akhir ayat). Fungsi di sini mengubah
// tag-tag itu menjadi `<span class="tj tj-X">` yang aman dirender, dan
// MEMBUANG penanda akhir ayat bawaan API — aplikasi memakai penanda
// sendiri (angka Arab-Indik lewat `toArabicIndic`, yang digambar font
// UthmanicHafs sebagai ornamen dengan angka di dalam lingkaran).

/** Kelas tajwid yang dikenali API (allowlist — kelas lain dibuang tag-nya, teksnya tetap). */
export const TAJWEED_CLASSES = [
  "ham_wasl",
  "slnt",
  "laam_shamsiyah",
  "madda_normal",
  "madda_permissible",
  "madda_necessary",
  "madda_obligatory",
  "qalaqah",
  "ikhafa",
  "ikhafa_shafawi",
  "idgham_ghunnah",
  "idgham_wo_ghunnah",
  "idgham_shafawi",
  "idgham_mutajanisayn",
  "idgham_mutaqaribayn",
  "iqlab",
  "ghunnah",
] as const;

/**
 * Ubah satu baris teks tajwid dari API menjadi HTML aman: hanya boleh
 * berisi teks Arab + `<span class="tj tj-X">…</span>` dari allowlist.
 * Tag lain (termasuk penanda akhir ayat `<span class=end>`) dibuang.
 */
export function tajweedToSafeHtml(html: string): string {
  return (
    normalizeArabicText(html)
      // Normalisasi maddah global (helper bersama di lib/reading):
      // U+0672 -> U+0670. Data tajwid API memakai U+0672 di sebagian span
      // madda, padahal teks Uthmani biasa (Tanzil) memakai U+0670 di kata
      // yang sama — dan font UthmanicHafs menggambar U+0672 sebagai
      // BULATAN, bukan garis tegak. Tanpa normalisasi, tanda mad tampil
      // sebagai "bulatan biru".
      // Buang penanda akhir ayat bawaan API (aplikasi memakai penanda sendiri).
      .replace(/<span class=end>.*?<\/span>/g, "")
      // Tag tajwid -> span dengan class warna (hanya kelas yang di-allowlist).
      .replace(/<tajweed class=([a-z_0-9]+)>/g, (_m, c: string) =>
        (TAJWEED_CLASSES as readonly string[]).includes(c)
          ? `<span class="tj tj-${c}">`
          : ""
      )
      .replace(/<\/tajweed>/g, "</span>")
      // Buang tag lain apa pun yang tersisa (kecuali span tajwid hasil transform).
      .replace(/<[^>]*>/g, (m) =>
        m.startsWith('<span class="tj ') || m === "</span>" ? m : ""
      )
  );
}

/**
 * Legenda warna untuk pemula: satu warna = satu kelompok hukum tajwid.
 *
 * "Mad" dipecah jadi 4 entri — karena keempat kelas madda di data
 * Quran.com memang hukum yang BERBEDA (diverifikasi dari datanya, bukan
 * dikarang): madda_normal = mad thabi'i (2 ketukan); madda_obligatory =
 * mad wajib muttasil + mad jaiz munfasil (4–5 ketukan; jaiz boleh 2/4/5);
 * madda_permissible = mad 'arid lissukun (dibaca 2, 4, atau 6 ketukan
 * SAAT WAQF — 4.534 dari 4.543 kemunculannya ada di akhir ayat, sisanya
 * sebelum tanda sajdah, juga titik berhenti — jadi BUKAN "mad jaiz" dan
 * tidak boleh digabung ke "Mad 4 ketukan"); madda_necessary = mad lazim
 * (6 ketukan). Warna swatch = warna teks .tj-madda_* di globals.css
 * (mode terang); keempatnya sudah punya nuansa biru berbeda di CSS,
 * jadi tidak perlu ubah CSS.
 */
export const TAJWEED_LEGEND: { swatch: string; name: string; desc: string }[] = [
  { swatch: "#537FFF", name: "Mad 2 ketukan", desc: "thabi'i" },
  { swatch: "#2144C1", name: "Mad 4 ketukan", desc: "wajib & jaiz (4–5)" },
  { swatch: "#4050B5", name: "Mad 'arid 2/4/6", desc: "saat waqf di akhir ayat" },
  { swatch: "#1E3A8A", name: "Mad 6 ketukan", desc: "lazim" },
  { swatch: "#DD0008", name: "Qalqalah", desc: "memantul" },
  { swatch: "#9400A8", name: "Ikhfa", desc: "dibaca samar" },
  { swatch: "#15803d", name: "Idgham", desc: "melebur ke huruf berikut" },
  { swatch: "#0891B2", name: "Iqlab", desc: "nun berubah jadi mim" },
  { swatch: "#EA580C", name: "Ghunnah", desc: "dengung" },
  { swatch: "#8A8A8A", name: "Abu-abu", desc: "hamzah wasal / lam syamsiah / huruf diam" },
];

/**
 * Legenda tanda waqaf — Mushaf Standar Indonesia (Kemenag RI, Pedoman
 * Pentashihan Mushaf Al-Qur'an, Lajnah Pentashihan Mushaf Al-Qur'an).
 * Enam tanda waqaf MSI + saktah (tanda ketujuh yang ada di data mushaf
 * dan dipakai di mushaf Madinah; di MSI saktah termasuk tanda baca yang
 * dicantumkan dalam pedoman).
 *
 * Tanda-tanda ini adalah BAGIAN TEKS (bukan warna): tampil di reader
 * baik saat Warna Tajwid ON maupun OFF, dan di Yasin. Di HTML tiap tanda
 * dibungkus <span class="wq"> supaya tampil besar dan terbaca
 * (CSS .mushaf .wq). `mark` dirender dengan font mushaf (me_quran)
 * supaya bentuknya benar.
 */
export const WAQAF_LEGEND: { mark: string; name: string; desc: string }[] = [
  { mark: "ۘ", name: "م — Waqaf lazim", desc: "wajib berhenti" },
  { mark: "ۙ", name: "لا — Laa", desc: "tidak boleh berhenti" },
  { mark: "ۗ", name: "قلى — Qaly", desc: "lebih baik berhenti" },
  { mark: "ۖ", name: "صلى — Shaly", desc: "lebih baik terus (tidak berhenti)" },
  { mark: "ۚ", name: "ج — Jaiz", desc: "boleh berhenti atau terus" },
  { mark: "ۛ", name: "∴ — Mu'anaqah", desc: "berhenti di salah satu dari dua tempat" },
  { mark: "ۜ", name: "س — Saktah", desc: "berhenti sejenak tanpa mengambil napas" },
];

/**
 * Legenda tanda sifir (صفر) — pasangan tanda pada huruf diam, juga
 * sesuai Mushaf Standar Indonesia. Bukan tanda waqaf, tapi tanda baca
 * yang menempel pada huruf: mustadir = huruf DIAM (tidak dibaca),
 * mustathil = dibaca saat waqaf, diam saat wasal. Dikembalikan mapper
 * dari teks Uthmani (3.988 mustadir + 66 mustathil di seluruh Qur'an).
 */
export const SIFIR_LEGEND: { mark: string; name: string; desc: string }[] = [
  { mark: "۟", name: "صفر مستدير — Mustadir", desc: "huruf diam, tidak dibaca (mis. waw أُولَٰئِكَ, alif مِائَة)" },
  { mark: "۠", name: "صفر مستطيل — Mustathil", desc: "dibaca saat waqaf, diam saat wasal (mis. alif أَنَا)" },
];
