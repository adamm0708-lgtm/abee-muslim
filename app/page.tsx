"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, ProgressBar } from "@/components/ui";
import { useProgress, levelFromPoints, todayKey } from "@/lib/store";
import {
  CITIES,
  PRAYER_ORDER,
  daysToRamadhan,
  formatCountdown,
  getTimings,
  getWeather,
  hijriToday,
  nextPrayer,
  type Timings,
  type Weather,
} from "@/lib/api";

const MISSIONS = [
  { id: "hitung", title: "Jawab benar soal hitung", target: 10, href: "/belajar" },
  { id: "hafalan", title: "Latihan hafalan benar", target: 5, href: "/quran/hafalan" },
  { id: "kata", title: "Belajar kata (Inggris/Arab)", target: 10, href: "/belajar" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export default function Home() {
  const { progress, completeMission } = useProgress();
  const [timings, setTimings] = useState<Timings | null>(null);
  const [timingsError, setTimingsError] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [ramadhanDays, setRamadhanDays] = useState<number | null>(null);

  const city = CITIES.find((c) => c.name === progress.city) ?? CITIES[0];
  const { level, title } = levelFromPoints(progress.points);

  useEffect(() => {
    let alive = true;
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setTimingsError(true));
    getWeather(city.lat, city.lon)
      .then((w) => alive && setWeather(w))
      .catch(() => alive && setWeatherError(true));
    setRamadhanDays(daysToRamadhan());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.city]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => (timings ? nextPrayer(timings, now) : null), [timings, now]);
  const countdown = next ? formatCountdown(next.at.getTime() - now.getTime()) : "--:--:--";
  const t = todayKey();
  const missionsDoneCount = progress.missionsDone[t] ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Profil */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-abee-gold text-2xl">
            🐼
          </span>
          <div>
            <p className="text-sm font-extrabold text-abee-ink dark:text-[#F7F2E7]">{progress.name}</p>
            <p className="text-xs text-slate-500 dark:text-[#A8C3B5]">
              Lv {level} · {title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-white dark:bg-[#14382E] px-2.5 py-1 ring-1 ring-black/5 dark:ring-white/10">🔥 {progress.streak}</span>
          <span className="rounded-full bg-white dark:bg-[#14382E] px-2.5 py-1 ring-1 ring-black/5 dark:ring-white/10">⭐ {progress.points}</span>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-[#B9D2C6]">
        Assalamu&apos;alaikum 👋 <span className="font-bold text-abee-ink dark:text-[#F7F2E7]">{greeting()}</span>
      </p>

      {/* Tanggal Hijriah */}
      <Card className="flex items-center justify-between bg-gradient-to-r from-abee-green to-abee-teal !text-white">
        <div>
          <p className="text-xs opacity-80">Tanggal Hijriah hari ini</p>
          <p className="text-lg font-extrabold">{hijriToday()}</p>
          <p className="text-xs opacity-80">
            {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className="text-4xl" aria-hidden>
          🌙
        </span>
      </Card>

      {/* Shalat berikutnya */}
      <Card className="bg-gradient-to-br from-[#1e2a78] to-[#5b2a86] !text-white">
        <p className="text-xs opacity-80">Shalat berikutnya · {progress.city}</p>
        {timings && next ? (
          <>
            <p className="mt-1 text-2xl font-extrabold">
              {next.label} {timings[next.name]}
            </p>
            <p className="font-mono text-4xl font-extrabold tracking-wider">{countdown}</p>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {PRAYER_ORDER.map((name) => (
                <div
                  key={name}
                  className={`rounded-xl px-1 py-2 text-center ${
                    next.name === name ? "bg-abee-gold text-abee-ink dark:text-[#F7F2E7]" : "bg-white/10"
                  }`}
                >
                  <p className="text-[10px] opacity-80">{name}</p>
                  <p className="text-xs font-extrabold">{timings[name]}</p>
                </div>
              ))}
            </div>
          </>
        ) : timingsError ? (
          <p className="mt-2 text-sm">
            Jadwal shalat tidak bisa dimuat (periksa koneksi internet). Coba lagi nanti.
          </p>
        ) : (
          <p className="mt-2 text-sm">Memuat jadwal shalat…</p>
        )}
      </Card>

      {/* Cuaca + Road to Ramadhan */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-sky-400 to-sky-600 !text-white">
          <p className="text-xs opacity-80">Cuaca · {progress.city}</p>
          {weather ? (
            <>
              <p className="mt-1 text-3xl font-extrabold">{weather.temp}°</p>
              <p className="text-sm font-bold">{weather.desc}</p>
              <p className="text-xs opacity-80">
                💧 {weather.humidity}% · 💨 {weather.wind} km/j
              </p>
            </>
          ) : weatherError ? (
            <p className="mt-2 text-sm">Cuaca tidak bisa dimuat.</p>
          ) : (
            <p className="mt-2 text-sm">Memuat cuaca…</p>
          )}
        </Card>
        <Link href="/ibadah/ramadhan">
          <Card className="h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 !text-white">
            <p className="text-xs opacity-80">Road to Ramadhan</p>
            <p className="mt-1 text-4xl font-extrabold">
              {ramadhanDays === null ? "…" : ramadhanDays}
            </p>
            <p className="text-sm font-bold">hari lagi</p>
          </Card>
        </Link>
      </div>

      {/* Misi hari ini */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-extrabold text-abee-ink dark:text-[#F7F2E7]">🎯 Misi hari ini</h2>
          <span className="text-xs font-bold text-slate-500 dark:text-[#A8C3B5]">{missionsDoneCount}/3</span>
        </div>
        <div className="flex flex-col gap-3">
          {MISSIONS.map((m) => {
            const done = (progress.missionProgress[t]?.[m.id] ?? 0) >= 1;
            const val = Math.min(
              m.target,
              m.id === "hafalan"
                ? Object.values(progress.hafalanDone).filter(Boolean).length
                : (progress.missionProgress[t]?.[`${m.id}-count`] ?? 0)
            );
            return (
              <div key={m.id} className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center justify-between gap-2">
                  <Link href={m.href} className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
                    {m.title}
                  </Link>
                  <span className="text-xs font-bold text-slate-500 dark:text-[#A8C3B5]">
                    {done ? "Selesai ✓" : `${val}/${m.target}`}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <ProgressBar value={done ? m.target : val} max={m.target} />
                  </div>
                  <button
                    disabled={done}
                    onClick={() => completeMission(m.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      done ? "bg-emerald-100 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300" : "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26] active:scale-95"
                    }`}
                  >
                    {done ? "+20 poin ✓" : "Selesai +20"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Menu cepat */}
      <div>
        <h2 className="mb-2 font-extrabold text-abee-ink dark:text-[#F7F2E7]">🕌 Ibadah</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: "/ibadah/doa", icon: "🤲", label: "Doa Harian", bg: "bg-amber-500" },
            { href: "/ibadah/tasbih", icon: "📿", label: "Tasbih Digital", bg: "bg-teal-500" },
            { href: "/ibadah/jadwal", icon: "🕋", label: "Jadwal Shalat", bg: "bg-indigo-500" },
            { href: "/ibadah/dzikir", icon: "🌿", label: "Dzikir Harian", bg: "bg-emerald-500" },
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-[#14382E] p-3 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition active:scale-95"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${m.bg}`}>
                {m.icon}
              </span>
              <span className="text-xs font-bold leading-tight text-abee-ink dark:text-[#F7F2E7]">{m.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <Link href="/ibadah" className="flex-1 rounded-2xl bg-abee-green dark:bg-[#D4AF37] py-3 text-center text-sm font-bold text-white dark:text-[#0B2E26]">
            Semua Menu Ibadah →
          </Link>
          <Link href="/quran" className="flex-1 rounded-2xl bg-white dark:bg-[#14382E] py-3 text-center text-sm font-bold text-abee-green dark:text-teal-300 ring-1 ring-black/10 dark:ring-white/15">
            Al-Qur&apos;an →
          </Link>
        </div>
      </div>

      <p className="pb-2 text-center text-[11px] text-slate-400 dark:text-[#7FA294]">
        Jadwal shalat: Aladhan API (Metode Kemenag) · Cuaca: Open-Meteo · Data tersimpan di perangkatmu
      </p>
    </div>
  );
}
