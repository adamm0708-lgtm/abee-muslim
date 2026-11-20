// Fitur perbesar di semua permukaan baca (Adam 2026-11-20 13:55 WIB):
// satu ukuran teks bersama (A- A A+ A++ = 24/28/32/40px) tersimpan di
// localStorage + layar penuh (Fullscreen API + fallback CSS mode baca penuh).
import { useCallback, useEffect, useRef, useState } from "react";

export type ReaderFontSize = "md" | "lg" | "xl" | "xxl";

/** Normalisasi maddah global (Adam 2026-11-20): U+0672 (ٲ — di font
 *  UthmanicHafs digambar sebagai BULATAN berisi) → U+0670 (ٰ — alif
 *  khanjariyah / harakat tegak berdiri, garis tegak lurus kecil). Dipakai di
 *  SEMUA teks Arab yang dirender — reader Qur'an, Yasin, doa, wirid, tahlil —
 *  bukan hanya tajwid. Font lain (Amiri, Scheherazade, Noto) menggambar
 *  keduanya sebagai garis tegak, tapi normalisasi ini tetap diterapkan supaya
 *  teksnya konsisten apa pun font yang dipakai.
 *  CATATAN (2026-11-21): fungsi ini DULU juga membuang U+06DF (۟ — sifir
 *  mustadir). Pembuangan itu DIHAPUS — sifir mustadir + mustathil kini
 *  DIKEMBALIKAN oleh mapper (lib/tajweed-map.ts) dari teks Uthmani, dan
 *  dirender benar oleh font me_quran (lingkaran kecil di atas huruf diam,
 *  bukan bulatan besar seperti di UthmanicHafs dulu). Teks Simple tidak
 *  mengandung U+06DF, jadi penghapusan ini tidak mengubah teks Simple;
 *  satu-satunya teks yang kini memuat sifir adalah teks hasil mapper +
 *  teks tertanam Juz 30 (109:4) — keduanya memang harus menampilkannya. */
export function normalizeArabicText(s: string): string {
  return s.replace(/\u0672/g, "\u0670");
}

export const READER_FONT_SIZES: ReaderFontSize[] = ["md", "lg", "xl", "xxl"];

export const READER_FONT_SIZE_LABELS: Record<ReaderFontSize, string> = {
  md: "A-",
  lg: "A",
  xl: "A+",
  xxl: "A++",
};

/** Kelas ukuran teks Arab (mushaf/doa/wirid) per pilihan. */
export const ARABIC_SIZE_CLASS: Record<ReaderFontSize, string> = {
  md: "text-[24px]",
  lg: "text-[28px]",
  xl: "text-[32px]",
  xxl: "text-[40px]",
};

/** Kelas ukuran teks Latin/terjemahan per pilihan (skala mengikuti Arab). */
export const BODY_SIZE_CLASS: Record<ReaderFontSize, string> = {
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
  xxl: "text-xl",
};

const FONT_SIZE_KEY = "abee-reader-font-size-v1";

function readSavedSize(): ReaderFontSize {
  if (typeof window === "undefined") return "lg";
  try {
    const s = window.localStorage.getItem(FONT_SIZE_KEY);
    if (s === "md" || s === "lg" || s === "xl" || s === "xxl") return s;
  } catch {
    // penyimpanan tidak tersedia — pakai default
  }
  return "lg";
}

/** Ukuran teks baca bersama — tersimpan, jadi pengguna (termasuk lansia)
 *  tidak perlu mengatur ulang setiap kali buka. Dibaca di useEffect supaya
 *  render pertama sama dengan server (tanpa hydration mismatch). */
export function useReaderFontSize() {
  const [size, setSizeState] = useState<ReaderFontSize>("lg");
  useEffect(() => {
    setSizeState(readSavedSize());
  }, []);
  const setSize = useCallback((s: ReaderFontSize) => {
    setSizeState(s);
    try {
      window.localStorage.setItem(FONT_SIZE_KEY, s);
    } catch {
      // abaikan
    }
  }, []);
  return {
    size,
    setSize,
    arabicClass: ARABIC_SIZE_CLASS[size],
    bodyClass: BODY_SIZE_CLASS[size],
  };
}

/** Layar penuh: Fullscreen API bila tersedia; bila tidak (mis. Safari iOS —
 *  iPhone tidak mendukung Fullscreen API untuk elemen biasa), fallback ke
 *  mode baca penuh berbasis CSS. Satu tombol, dua jalur — pengguna tidak
 *  perlu tahu bedanya. */
export function useFullscreen() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [nativeActive, setNativeActive] = useState(false);
  const [cssActive, setCssActive] = useState(false);
  const active = nativeActive || cssActive;

  useEffect(() => {
    const onChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      const el = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setNativeActive(el != null && el === ref.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Esc keluar dari mode baca penuh CSS (native sudah ditangani browser).
  useEffect(() => {
    if (!cssActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCssActive(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cssActive]);

  const toggle = useCallback(async () => {
    if (cssActive) {
      setCssActive(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // abaikan
      }
      return;
    }
    const el = ref.current;
    if (!el) return;
    const request =
      el.requestFullscreen?.bind(el) ??
      (
        el as unknown as {
          webkitRequestFullscreen?: () => Promise<void>;
        }
      ).webkitRequestFullscreen?.bind(el);
    if (!request) {
      setCssActive(true);
      return;
    }
    try {
      await request();
    } catch {
      setCssActive(true);
    }
  }, [cssActive]);

  return { ref, active, cssActive, toggle };
}

/** Kelas wadah saat mode baca penuh CSS aktif (latar mengikuti tema). */
export const CSS_FULLSCREEN_CLASS =
  "fixed inset-0 z-[100] overflow-y-auto bg-[#f4f5f3] px-4 py-4 dark:bg-[#0a0a0a]";
