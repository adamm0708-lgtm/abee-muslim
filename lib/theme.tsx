"use client";
// Tema otomatis siang/malam + pilihan manual.
// - Otomatis (default): terang antara Terbit dan Maghrib, gelap antara Maghrib
//   dan Terbit — memakai data matahari dari jadwal resmi Kemenag (MyQuran)
//   yang sama dengan jadwal shalat. Kalau API belum termuat/gagal: fallback
//   jam lokal (terang 05:00–18:00, gelap 18:00–05:00).
// - Pilihan pengguna di Atur (Terang/Gelap) tersimpan dan mengalahkan otomatis.
// Tema gelap: hijau zamrud gelap (#0B2E26) + aksen emas (#D4AF37).
// Tema terang: putih bersih + hijau zamrud + aksen emas (bukan krem/beige).
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useProgress, type ThemeChoice } from "./store";
import { getTimings } from "./api";

export type EffectiveTheme = "light" | "dark";

type ThemeCtx = {
  effective: EffectiveTheme;
  choice: ThemeChoice;
  setChoice: (c: ThemeChoice) => void;
};

const Ctx = createContext<ThemeCtx>({
  effective: "light",
  choice: "auto",
  setChoice: () => {},
});

function fallbackByLocalTime(now = new Date()): EffectiveTheme {
  const h = now.getHours();
  return h >= 5 && h < 18 ? "light" : "dark";
}

async function autoTheme(city: string, now = new Date()): Promise<EffectiveTheme> {
  try {
    const t = await getTimings(city);
    const toMin = (s: string) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m;
    };
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const terbit = toMin(t.Terbit);
    const maghrib = toMin(t.Maghrib);
    return nowMin >= terbit && nowMin < maghrib ? "light" : "dark";
  } catch {
    return fallbackByLocalTime(now);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { progress, setTheme } = useProgress();
  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    fallbackByLocalTime()
  );

  useEffect(() => {
    let alive = true;
    const apply = async () => {
      const theme =
        progress.theme === "auto"
          ? await autoTheme(progress.city)
          : progress.theme;
      if (alive) setEffective(theme);
    };
    void apply();
    const id = setInterval(() => void apply(), 60 * 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [progress.theme, progress.city]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", effective === "dark");
  }, [effective]);

  return (
    <Ctx.Provider
      value={{ effective, choice: progress.theme, setChoice: setTheme }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): ThemeCtx {
  return useContext(Ctx);
}

/**
 * Skrip inline di <head> supaya tema benar sebelum React sempat render
 * (menghindari kedipan tema saat halaman pertama dibuka). Membaca pilihan
 * tema yang tersimpan di localStorage; mode otomatis memakai jam lokal
 * sebagai tebakan awal (data jadwal Kemenag menyusul setelah aplikasi jalan).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('abee-muslim-progress-v1');var t='auto';if(raw){try{t=JSON.parse(raw).theme||'auto';}catch(e){}}var h=new Date().getHours();var dark=t==='dark'||(t==='auto'&&(h<5||h>=18));document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;
