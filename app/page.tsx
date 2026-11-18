"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  Icon,
  MenuGrid,
  MenuItem,
  Note,
  PhotoCard,
  PrayerCard,
  ProgressBar,
  QuoteCard,
  SectionTitle,
} from "@/components/ui";
import { useProgress, levelFromPoints, todayKey } from "@/lib/store";
import {
  FITUR_UTAMA,
  IBADAH_MENU,
  QURAN_MENU,
  mutiaraHariIni,
} from "@/lib/data";
import {
  CITIES,
  daysToRamadhan,
  getWeather,
  hijriToday,
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
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [ramadhanDays, setRamadhanDays] = useState<number | null>(null);

  const city = CITIES.find((c) => c.name === progress.city) ?? CITIES[0];
  const { level, title } = levelFromPoints(progress.points);
  const mutiara = mutiaraHariIni();

  useEffect(() => {
    let alive = true;
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

  const t = todayKey();
  const missionsDoneCount = progress.missionsDone[t] ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Sapaan & progres */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Assalamu&apos;alaikum, {greeting()}
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
            {progress.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Level {level} · {title}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
            <Icon name="flame" className="h-3.5 w-3.5 text-[#C9A227]" />
            {progress.streak} hari
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
            <Icon name="star" className="h-3.5 w-3.5 text-[#C9A227]" />
            {progress.points} poin
          </span>
        </div>
      </div>

      {/* Kartu shalat berikutnya (gelap) */}
      <PrayerCard />

      {/* Hijriah + cuaca */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Hijriah hari ini
          </p>
          <p className="mt-1 text-base font-extrabold leading-snug text-neutral-900 dark:text-neutral-100">
            {hijriToday()}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Cuaca · {progress.city}
          </p>
          {weather ? (
            <>
              <p className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                {weather.temp}°
              </p>
              <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{weather.desc}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Kelembapan {weather.humidity}% · Angin {weather.wind} km/j
              </p>
            </>
          ) : weatherError ? (
            <p className="mt-2 text-sm text-neutral-500">Cuaca tidak bisa dimuat.</p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">Memuat cuaca…</p>
          )}
        </Card>
      </div>

      {/* Road to Ramadhan */}
      <Link href="/ibadah/ramadhan">
        <div className="flex items-center justify-between rounded-2xl bg-[#0A0A0A] px-5 py-4 text-white shadow-sm">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/60">
              Road to Ramadhan
            </p>
            <p className="mt-1 text-sm font-bold">
              {ramadhanDays === null ? "…" : `${ramadhanDays} hari lagi`}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
            Lihat <Icon name="chevron-right" className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Fitur Utama */}
      <div>
        <SectionTitle title="Fitur Utama" />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {FITUR_UTAMA.map((f) => (
            <PhotoCard key={f.href} href={f.href} label={f.label} photo={f.photo} />
          ))}
        </div>
      </div>

      {/* Menu Lainnya */}
      <div>
        <SectionTitle title="Menu Lainnya" />
        <MenuGrid>
          {IBADAH_MENU.map((m) => (
            <MenuItem key={`i-${m.slug}`} href={`/ibadah/${m.slug}`} icon={m.icon} label={m.label} />
          ))}
          {QURAN_MENU.map((m) => (
            <MenuItem key={`q-${m.slug}`} href={`/quran/${m.slug}`} icon={m.icon} label={m.label} />
          ))}
        </MenuGrid>
      </div>

      {/* Mutiara hari ini */}
      <div>
        <SectionTitle title="Mutiara Hari Ini" />
        <QuoteCard text={mutiara.text} source={mutiara.source} />
      </div>

      {/* Misi hari ini — tampilan tenang */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-extrabold text-neutral-900 dark:text-neutral-100">Misi hari ini</h2>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {missionsDoneCount}/3 selesai
          </span>
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
              <div
                key={m.id}
                className="rounded-2xl bg-[#F5F5F4] p-3 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={m.href}
                    className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                  >
                    {m.title}
                  </Link>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    {done ? (
                      <>
                        <Icon name="check" className="h-3.5 w-3.5 text-[#0B3D39] dark:text-[#D4AF37]" />
                        Selesai · +20 poin
                      </>
                    ) : (
                      `${val}/${m.target}`
                    )}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <ProgressBar value={done ? m.target : val} max={m.target} />
                  </div>
                  <button
                    disabled={done}
                    onClick={() => completeMission(m.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      done
                        ? "bg-black/5 text-neutral-400 dark:bg-white/5 dark:text-neutral-500"
                        : "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                    }`}
                  >
                    {done ? "Selesai" : "Tandai selesai"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Note>
        Jadwal shalat: Aladhan API (Metode Kemenag) · Cuaca: Open-Meteo · Foto fitur: Wikimedia
        Commons · Data tersimpan di perangkatmu dan disinkronkan ke cloud.
      </Note>
    </div>
  );
}
