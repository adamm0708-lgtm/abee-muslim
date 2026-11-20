"use client";
// Progres pengguna: poin, streak, level, misi, tasbih, amal harian,
// hafalan, dan kelompok mengaji. Disimpan di localStorage dan — kalau
// Supabase dikonfigurasi — disinkronkan ke tabel user_progress.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { deviceId, getSupabase } from "./supabase";

export type ThemeChoice = "auto" | "light" | "dark";

export type LastRead = {
  surahNo: number;
  surahName: string;
  ayah: number;
  at: string; // ISO date
};

export type Progress = {
  name: string;
  city: string;
  theme: ThemeChoice;
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  missionsDone: Record<string, number>; // "YYYY-MM-DD" -> jumlah misi selesai
  missionProgress: Record<string, Record<string, number>>; // tanggal -> misi -> nilai
  tasbihCounts: Record<string, number>;
  amalDone: Record<string, boolean>; // "YYYY-MM-DD:amal" -> true
  hafalanDone: Record<number, boolean>; // no surah -> hafal
  groups: string[];
  lastRead: LastRead | null;
  /** Pengingat adzan: master toggle + per-shalat + yang sudah di-dismiss hari ini. */
  adhanEnabled: boolean;
  adhanPrayers: Record<string, boolean>; // nama shalat -> aktif
  adhanDismissed: Record<string, string[]>; // "YYYY-MM-DD" -> nama shalat yang di-dismiss
  /** Pengingat amalan: master toggle + per-pengingat + dismiss/selesai per siklus. */
  pengingatEnabled: boolean;
  pengingatToggles: Record<string, boolean>; // id pengingat -> aktif
  pengingatDismissed: Record<string, string[]>; // cycleKey -> id pengingat yang ditutup
  pengingatDone: Record<string, string[]>; // cycleKey -> id pengingat yang ditandai selesai
};

export const DEFAULT_ADHAN_PRAYERS: Record<string, boolean> = {
  Subuh: true,
  Dzuhur: true,
  Ashar: true,
  Maghrib: true,
  Isya: true,
};

/** Semua pengingat amalan aktif secara default. */
export const DEFAULT_PENGINGAT_TOGGLES: Record<string, boolean> = {
  kahfi: true,
  yasin: true,
  mulk: true,
  ngaji: true,
  istighfar: true,
  arrahman: true,
};

const DEFAULT_PROGRESS: Progress = {
  name: "Teman ABEE",
  city: "Bangil",
  theme: "auto",
  points: 0,
  streak: 0,
  lastActiveDate: "",
  missionsDone: {},
  missionProgress: {},
  tasbihCounts: {},
  amalDone: {},
  hafalanDone: {},
  groups: [],
  lastRead: null,
  adhanEnabled: true,
  adhanPrayers: { ...DEFAULT_ADHAN_PRAYERS },
  adhanDismissed: {},
  pengingatEnabled: true,
  pengingatToggles: { ...DEFAULT_PENGINGAT_TOGGLES },
  pengingatDismissed: {},
  pengingatDone: {},
};

const KEY = "abee-muslim-progress-v1";

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function levelFromPoints(points: number): { level: number; title: string; nextAt: number } {
  const levels = [
    { at: 0, title: "Pemula" },
    { at: 100, title: "Pelajar" },
    { at: 300, title: "Penuntut Ilmu" },
    { at: 600, title: "Penghafal" },
    { at: 1000, title: "Teladan" },
    { at: 2000, title: "Istiqamah" },
  ];
  let level = 1;
  let title = levels[0].title;
  let nextAt = levels[1].at;
  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].at) {
      level = i + 1;
      title = levels[i].title;
      nextAt = levels[i + 1]?.at ?? levels[i].at;
    }
  }
  return { level, title, nextAt };
}

type Store = {
  progress: Progress;
  loaded: boolean;
  addPoints: (n: number) => void;
  setName: (name: string) => void;
  setCity: (city: string) => void;
  setTheme: (theme: ThemeChoice) => void;
  setMissionProgress: (missionId: string, value: number) => void;
  completeMission: (missionId: string) => void;
  setTasbih: (id: string, count: number) => void;
  toggleAmal: (id: string) => void;
  toggleHafalan: (no: number) => void;
  addGroup: (name: string) => void;
  removeGroup: (name: string) => void;
  setLastRead: (r: LastRead) => void;
  setAdhanEnabled: (b: boolean) => void;
  setAdhanPrayer: (name: string, b: boolean) => void;
  dismissAdhan: (name: string) => void;
  setPengingatEnabled: (b: boolean) => void;
  setPengingatToggle: (id: string, b: boolean) => void;
  dismissPengingat: (id: string, key: string) => void;
  markPengingatDone: (id: string, key: string) => void;
  resetProgress: () => void;
};

const Ctx = createContext<Store | null>(null);

async function syncToSupabase(p: Progress) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("user_progress").upsert(
      {
        device_id: deviceId(),
        name: p.name,
        city: p.city,
        points: p.points,
        streak: p.streak,
        last_active_date: p.lastActiveDate || null,
        data: p,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id" }
    );
  } catch {
    // Sinkronisasi gagal diam-diam — localStorage tetap sumber utama.
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Progress;
        // Gabung dalam: adhanPrayers dari data lama bisa tidak lengkap.
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          adhanPrayers: { ...DEFAULT_ADHAN_PRAYERS, ...(parsed.adhanPrayers ?? {}) },
          adhanDismissed: parsed.adhanDismissed ?? {},
          pengingatToggles: {
            ...DEFAULT_PENGINGAT_TOGGLES,
            ...(parsed.pengingatToggles ?? {}),
          },
          pengingatDismissed: parsed.pengingatDismissed ?? {},
          pengingatDone: parsed.pengingatDone ?? {},
        });
      }
    } catch {
      // abaikan data rusak
    }
    setLoaded(true);
  }, []);

  // Perbarui streak sekali per hari saat aplikasi dibuka
  useEffect(() => {
    if (!loaded) return;
    const today = todayKey();
    if (progress.lastActiveDate === today) return;
    setProgress((prev) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const cont = prev.lastActiveDate === todayKey(yesterday);
      const next = {
        ...prev,
        lastActiveDate: today,
        streak: cont ? prev.streak + 1 : 1,
      };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const update = (fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // penyimpanan penuh / privat — abaikan
      }
      void syncToSupabase(next);
      return next;
    });
  };

  const store: Store = useMemo(
    () => ({
      progress,
      loaded,
      addPoints: (n) => update((p) => ({ ...p, points: p.points + n })),
      setName: (name) => update((p) => ({ ...p, name })),
      setCity: (city) => update((p) => ({ ...p, city })),
      setTheme: (theme) => update((p) => ({ ...p, theme })),
      setMissionProgress: (missionId, value) =>
        update((p) => {
          const t = todayKey();
          return {
            ...p,
            missionProgress: {
              ...p.missionProgress,
              [t]: { ...(p.missionProgress[t] ?? {}), [missionId]: value },
            },
          };
        }),
      completeMission: (missionId) =>
        update((p) => {
          const t = todayKey();
          const done = p.missionsDone[t] ?? 0;
          const already = (p.missionProgress[t]?.[missionId] ?? 0) >= 1;
          if (already) return p;
          return {
            ...p,
            points: p.points + 20,
            missionsDone: { ...p.missionsDone, [t]: done + 1 },
            missionProgress: {
              ...p.missionProgress,
              [t]: { ...(p.missionProgress[t] ?? {}), [missionId]: 1 },
            },
          };
        }),
      setTasbih: (id, count) =>
        update((p) => ({ ...p, tasbihCounts: { ...p.tasbihCounts, [id]: count } })),
      toggleAmal: (id) =>
        update((p) => {
          const k = `${todayKey()}:${id}`;
          const next = { ...p.amalDone };
          if (next[k]) delete next[k];
          else next[k] = true;
          return { ...p, amalDone: next };
        }),
      toggleHafalan: (no) =>
        update((p) => {
          const next = { ...p.hafalanDone };
          if (next[no]) delete next[no];
          else next[no] = true;
          return { ...p, hafalanDone: next };
        }),
      addGroup: (name) =>
        update((p) =>
          p.groups.includes(name) ? p : { ...p, groups: [...p.groups, name] }
        ),
      removeGroup: (name) =>
        update((p) => ({ ...p, groups: p.groups.filter((g) => g !== name) })),
      setLastRead: (r) => update((p) => ({ ...p, lastRead: r })),
      setAdhanEnabled: (b) => update((p) => ({ ...p, adhanEnabled: b })),
      setAdhanPrayer: (name, b) =>
        update((p) => ({ ...p, adhanPrayers: { ...p.adhanPrayers, [name]: b } })),
      dismissAdhan: (name) =>
        update((p) => {
          const t = todayKey();
          const list = p.adhanDismissed[t] ?? [];
          if (list.includes(name)) return p;
          return { ...p, adhanDismissed: { ...p.adhanDismissed, [t]: [...list, name] } };
        }),
      setPengingatEnabled: (b) => update((p) => ({ ...p, pengingatEnabled: b })),
      setPengingatToggle: (id, b) =>
        update((p) => ({ ...p, pengingatToggles: { ...p.pengingatToggles, [id]: b } })),
      dismissPengingat: (id, key) =>
        update((p) => {
          const list = p.pengingatDismissed[key] ?? [];
          if (list.includes(id)) return p;
          return {
            ...p,
            pengingatDismissed: { ...p.pengingatDismissed, [key]: [...list, id] },
          };
        }),
      markPengingatDone: (id, key) =>
        update((p) => {
          const list = p.pengingatDone[key] ?? [];
          if (list.includes(id)) return p;
          return {
            ...p,
            pengingatDone: { ...p.pengingatDone, [key]: [...list, id] },
          };
        }),
      resetProgress: () => {
        try {
          localStorage.removeItem(KEY);
        } catch {
          // abaikan
        }
        setProgress({ ...DEFAULT_PROGRESS, name: progress.name, city: progress.city });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress, loaded]
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProgress(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return ctx;
}
