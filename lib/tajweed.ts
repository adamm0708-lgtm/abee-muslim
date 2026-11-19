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
    html
      // Normalisasi U+0672 (ٲ) -> U+0670 (ٰ alif khanjariyah / harakat tegak
      // berdiri). Data tajwid API memakai U+0672 di sebagian span madda
      // (mis. ٱلْوَٰلِدَانِ, أَمْوَٰلَهُمْ di An-Nisaa 4:6-4:7), padahal teks
      // Uthmani biasa (Tanzil) memakai U+0670 di kata yang sama — dan font
      // UthmanicHafs menggambar U+0672 sebagai BULATAN, bukan garis tegak.
      // Tanpa normalisasi, tanda mad tampil sebagai "bulatan biru".
      .replace(/ٲ/g, "ٰ")
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

/** Legenda warna untuk pemula: satu warna = satu kelompok hukum tajwid. */
export const TAJWEED_LEGEND: { swatch: string; name: string; desc: string }[] = [
  { swatch: "#537FFF", name: "Mad", desc: "dibaca panjang" },
  { swatch: "#DD0008", name: "Qalqalah", desc: "memantul" },
  { swatch: "#9400A8", name: "Ikhfa", desc: "dibaca samar" },
  { swatch: "#15803d", name: "Idgham", desc: "melebur ke huruf berikut" },
  { swatch: "#0891B2", name: "Iqlab", desc: "nun berubah jadi mim" },
  { swatch: "#EA580C", name: "Ghunnah", desc: "dengung" },
  { swatch: "#8A8A8A", name: "Abu-abu", desc: "hamzah wasal / lam syamsiah / huruf diam" },
];
