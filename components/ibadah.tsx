"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Icon, Note, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";
import {
  HIJRI_MONTHS_SHORT_ID,
  JADWAL_ORDER,
  QURAN_SOURCE_NOTE,
  fetchSurahText,
  getHijriMonthCalendar,
  getHijriToday,
  getRamadhanInfo,
  getTimings,
  qiblaBearing,
  type HijriParts,
  type Timings,
} from "@/lib/api";
import {
  AMAL_HARIAN,
  ASMAUL_HUSNA,
  DOA_TAHLIL,
  DUAS,
  DZIKIR,
  QARIS,
  SHALAT_STEPS,
  TAHLIL_STEPS,
  TAHLIL_TEXT,
  WUDHU_STEPS,
  surahAudioUrl,
} from "@/lib/data";

// ---------- Doa Harian ----------
export function DoaPage() {
  const [open, setOpen] = useState<string | null>("bangun-tidur");
  return (
    <div>
      <PageHeader title="Doa Harian" subtitle="Doa-doa yang dipakai setiap hari" backHref="/ibadah" />
      <div className="flex flex-col gap-3">
        {DUAS.map((d) => (
          <Card key={d.id}>
            <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === d.id ? null : d.id)}>
              <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{d.title}</span>
              <span className="text-neutral-400 dark:text-neutral-500">{open === d.id ? "▾" : "▸"}</span>
            </button>
            {open === d.id && (
              <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
                <p className="arabic text-right text-2xl text-neutral-900 dark:text-neutral-100">{d.arabic}</p>
                <p className="mt-2 text-sm italic text-neutral-600 dark:text-neutral-400">{d.latin}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{d.translation}</p>
                <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{d.source}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Tasbih Digital ----------
export function TasbihPage() {
  const { progress, setTasbih, addPoints } = useProgress();
  const [target, setTarget] = useState(33);
  // Total ketukan tidak pernah direset saat putaran selesai: hitungan
  // terus berjalan, tiap kelipatan target = satu putaran selesai.
  const total = progress.tasbihCounts["tasbih"] ?? 0;
  const roundsDone = Math.floor(total / target);
  const inRound = total === 0 ? 0 : total % target === 0 ? target : total % target;
  const roundNow = roundsDone + 1;
  const roundJustDone = total > 0 && total % target === 0;
  const tap = () => {
    const next = total + 1;
    setTasbih("tasbih", next);
    if (next % target === 0) addPoints(10);
  };
  return (
    <div>
      <PageHeader title="Tasbih Digital" subtitle="Ketuk lingkaran untuk berdzikir" backHref="/ibadah" />
      <Card className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          {[33, 99, 100, 1000].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${target === t ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
            >
              {t}x
            </button>
          ))}
        </div>
        <button
          onClick={tap}
          className={`flex h-44 w-44 flex-col items-center justify-center rounded-full text-white shadow-lg ring-4 transition active:scale-95 ${
            roundJustDone
              ? "bg-[#0B3D39] ring-[#0B3D39]/20 dark:bg-[#D4AF37] dark:text-[#0A0A0A] dark:ring-[#D4AF37]/30"
              : "bg-[#0A0A0A] ring-[#0A0A0A]/10 dark:bg-[#D4AF37] dark:text-[#0A0A0A] dark:ring-[#D4AF37]/30"
          }`}
          aria-label="Ketuk untuk menghitung tasbih"
        >
          <span className="text-5xl font-extrabold">{inRound}</span>
          <span className="text-sm opacity-80">/ {target}</span>
        </button>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {roundJustDone
            ? `Alhamdulillah, putaran ke-${roundsDone} selesai — +10 poin`
            : "Subhanallah · Alhamdulillah · Allahu Akbar"}
        </p>
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
          Putaran ke-{roundNow} · Total {total}x
        </p>
        <ProgressBar value={inRound} max={target} />
        <button
          onClick={() => setTasbih("tasbih", 0)}
          className="rounded-full bg-[#F5F5F4] px-4 py-2 text-sm font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
        >
          Ulang dari 0
        </button>
      </Card>
      <div className="mt-3">
        <Note>
          Hitungan tersimpan di perangkatmu. Kalau Supabase diaktifkan, hitungan juga tersimpan di
          akunmu dan bisa lanjut di perangkat lain.
        </Note>
      </div>
    </div>
  );
}

// ---------- Jadwal Shalat ----------
export function JadwalPage() {
  const { progress } = useProgress();
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [progress.city]);
  return (
    <div>
      <PageHeader title="Jadwal Shalat" subtitle={`Kota: ${progress.city} · Jadwal resmi Kemenag (Bimas Islam)`} backHref="/ibadah" />
      <Card>
        <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Hijriah:{" "}
          {timings
            ? timings.dateHijri || "Tanggal Hijriah tidak bisa dimuat"
            : "Memuat tanggal Hijriah…"}
        </p>
        {timings ? (
          <div className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
            {JADWAL_ORDER.map((name) => (
              <div key={name} className="flex items-center justify-between py-3">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{name === "Terbit" ? "Terbit (Syuruq)" : name}</span>
                <span className="font-mono text-lg font-extrabold text-[#0B3D39] dark:text-[#D4AF37]">{timings[name]}</span>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Jadwal shalat tidak bisa dimuat. Periksa koneksi internet, lalu buka lagi halaman ini.</p>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Memuat jadwal shalat…</p>
        )}
      </Card>
      <div className="mt-3">
        <Note>
          Waktu shalat dari jadwal resmi Kemenag (Bimas Islam) lewat MyQuran API. Kalau
          MyQuran tidak bisa dijangkau, dipakai Aladhan (metode Kemenag) + ihtiyat 2 menit.
          Waktu shalat mengikuti mazhab Syafi'i (Ashar: bayangan 1x panjang benda).
          Ganti kota di menu Atur.
        </Note>
      </div>
    </div>
  );
}

// ---------- Road to Ramadhan ----------
export function RamadhanPage() {
  const [days, setDays] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    let alive = true;
    getRamadhanInfo()
      .then((info) => {
        if (!alive) return;
        setDays(info.days);
        setDateStr(info.dateText);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div>
      <PageHeader title="Road to Ramadhan" subtitle="Hitung mundur menuju bulan suci" backHref="/ibadah" />
      <div className="rounded-2xl bg-[#0A0A0A] p-6 text-center text-white shadow-md">
        <p className="text-6xl font-extrabold text-[#D4AF37]">{error ? "—" : days === null ? "…" : days}</p>
        <p className="mt-1 text-lg font-bold">hari lagi menuju 1 Ramadhan</p>
        {dateStr && <p className="mt-1 text-sm text-white/70">Diperkirakan: {dateStr}</p>}
        {error && (
          <p className="mt-1 text-sm text-white/70">Hitung mundur tidak bisa dimuat. Periksa koneksi internet.</p>
        )}
      </div>
      <div className="mt-3">
        <Card>
          <h2 className="font-extrabold text-neutral-900 dark:text-neutral-100">Persiapan Ramadhan</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            <li>Perbanyak puasa sunnah Senin–Kamis dan Ayyamul Bidh.</li>
            <li>Mulai khatam Al-Qur&apos;an sedikit demi sedikit (lihat Khatam Planner).</li>
            <li>Latih shalat malam dan dzikir pagi–petang.</li>
            <li>Siapkan target sedekah dan amal harian.</li>
          </ul>
        </Card>
      </div>
      <div className="mt-3">
        <Note>
          Tanggal 1 Ramadhan dihitung dari kalender Hijriah Umm al-Qura (Aladhan, MABIMS)
          dan bisa bergeser mengikuti keputusan pemerintah / rukyatul hilal.
        </Note>
      </div>
    </div>
  );
}

// ---------- Kalender Hijriyah ----------
export function KalenderPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (first.getDay() + 6) % 7; // Senin = 0
  const [hijriMap, setHijriMap] = useState<Map<number, HijriParts> | null>(null);
  const [hijriError, setHijriError] = useState(false);
  const [hijriTodayText, setHijriTodayText] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getHijriMonthCalendar(year, month + 1)
      .then((m) => alive && setHijriMap(m))
      .catch(() => alive && setHijriError(true));
    getHijriToday()
      .then((t) => alive && setHijriTodayText(t))
      .catch(() => alive && setHijriTodayText(""));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const cells: { g: number; h: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const h = hijriMap?.get(d);
    cells.push({
      g: d,
      h: h ? `${h.day} ${HIJRI_MONTHS_SHORT_ID[h.month - 1]}` : hijriError ? "—" : "…",
    });
  }
  const blanks = Array.from({ length: startWeekday }, (_, i) => i);
  return (
    <div>
      <PageHeader
        title="Kalender Hijriyah"
        subtitle={`${now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })} · ${hijriTodayText ?? "Memuat tanggal Hijriah…"}`}
        backHref="/ibadah"
      />
      <Card>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {blanks.map((i) => (
            <div key={`b${i}`} />
          ))}
          {cells.map((c) => (
            <div
              key={c.g}
              className={`rounded-xl p-1.5 text-center ring-1 ${
                c.g === now.getDate() ? "bg-[#0A0A0A] text-white ring-[#0A0A0A] dark:bg-[#D4AF37] dark:text-[#0A0A0A] dark:ring-[#D4AF37]" : "bg-[#F5F5F4] ring-black/5 dark:bg-white/5 dark:ring-white/10"
              }`}
            >
              <p className="text-sm font-extrabold">{c.g}</p>
              <p className={`text-[10px] ${c.g === now.getDate() ? "text-white/80 dark:text-[#0A0A0A]/70" : "text-[#0B3D39] dark:text-[#D4AF37]"}`}>
                {c.h}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Angka besar = tanggal Masehi, angka kecil = tanggal Hijriah (Aladhan, Umm al-Qura /
          MABIMS). Kalau tanggal Hijriah belum tampil, periksa koneksi internet.
        </p>
      </Card>
    </div>
  );
}

// ---------- Belajar Shalat & Wudhu ----------
export function ShalatWudhuPage() {
  const [tab, setTab] = useState<"wudhu" | "shalat">("wudhu");
  const steps = tab === "wudhu" ? WUDHU_STEPS : SHALAT_STEPS;
  return (
    <div>
      <PageHeader title="Belajar Shalat & Wudhu" subtitle="Langkah demi langkah" backHref="/ibadah" />
      <div className="mb-3">
        <Note>Panduan ibadah dalam aplikasi ini mengikuti mazhab Syafi&apos;i.</Note>
      </div>
      <div className="mb-3 flex gap-2">
        <button onClick={() => setTab("wudhu")} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${tab === "wudhu" ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/15"}`}>
          <Icon name="droplet" className="h-4 w-4" /> Wudhu
        </button>
        <button onClick={() => setTab("shalat")} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${tab === "shalat" ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/15"}`}>
          <Icon name="mosque" className="h-4 w-4" /> Shalat
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <Card key={i} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{s}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Dzikir Harian ----------
export function DzikirPage() {
  const { progress, setTasbih } = useProgress();
  return (
    <div>
      <PageHeader title="Dzikir Harian" subtitle="Ketuk untuk menghitung, target per dzikir" backHref="/ibadah" />
      <div className="flex flex-col gap-3">
        {DZIKIR.map((d) => {
          const count = progress.tasbihCounts[d.id] ?? 0;
          const done = count >= d.count;
          return (
            <Card key={d.id}>
              <p className="arabic text-right text-2xl text-neutral-900 dark:text-neutral-100">{d.arabic}</p>
              <p className="mt-1 text-sm italic text-neutral-600 dark:text-neutral-400">{d.latin}</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{d.translation}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => !done && setTasbih(d.id, count + 1)}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-2xl py-2.5 text-sm font-bold ${done ? "bg-black/5 text-[#0B3D39] dark:bg-white/5 dark:text-[#D4AF37]" : "bg-[#0A0A0A] text-white active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"}`}
                >
                  {done ? (
                    <>
                      <Icon name="check" className="h-4 w-4" /> Selesai
                    </>
                  ) : (
                    `Hitung (${count}/${d.count})`
                  )}
                </button>
                <button onClick={() => setTasbih(d.id, 0)} className="rounded-2xl bg-[#F5F5F4] px-3 py-2.5 text-sm font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                  Ulang
                </button>
              </div>
              <div className="mt-2">
                <ProgressBar value={count} max={d.count} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Tahlil & Doa ----------
export function TahlilPage() {
  const { progress, setTasbih } = useProgress();
  const count = progress.tasbihCounts["tahlil"] ?? 0;
  const target = 100;
  return (
    <div>
      <PageHeader title="Tahlil & Doa" subtitle="Bacaan tahlil" backHref="/ibadah" />
      <Card>
        <p className="arabic text-right text-2xl leading-loose text-neutral-900 dark:text-neutral-100">{TAHLIL_TEXT.arabic}</p>
        <p className="mt-2 text-sm italic text-neutral-600 dark:text-neutral-400">{TAHLIL_TEXT.latin}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{TAHLIL_TEXT.translation}</p>
        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{TAHLIL_TEXT.note}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => count < target && setTasbih("tahlil", count + 1)}
            className="flex-1 rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Hitung ({count}/{target})
          </button>
          <button onClick={() => setTasbih("tahlil", 0)} className="rounded-2xl bg-[#F5F5F4] px-4 py-3 text-sm font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            Ulang
          </button>
        </div>
        <div className="mt-2">
          <ProgressBar value={count} max={target} />
        </div>
      </Card>
    </div>
  );
}

// ---------- Masjid Terdekat ----------
export function MasjidPage() {
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [locError, setLocError] = useState(false);
  const requestLoc = () => {
    if (!navigator.geolocation) {
      setLocError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setLocError(true),
      { timeout: 10000 }
    );
  };
  const mapsUrl = loc
    ? `https://www.google.com/maps/search/masjid/@${loc.lat},${loc.lon},15z`
    : "https://www.google.com/maps/search/masjid+terdekat";
  return (
    <div>
      <PageHeader title="Masjid Terdekat" subtitle="Dibuka di Google Maps" backHref="/ibadah" />
      <Card className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Aplikasi ini tidak menyimpan daftar masjid sendiri — pencarian dibuka langsung di Google
          Maps supaya datanya selalu terbaru.
        </p>
        <button onClick={requestLoc} className="flex items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          <Icon name="pin" className="h-4 w-4" /> Gunakan lokasiku
        </button>
        {locError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Lokasi tidak bisa diambil (izin ditolak atau GPS tidak tersedia). Pencarian tetap bisa
            dibuka tanpa lokasi.
          </p>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-white py-3 text-center text-sm font-bold text-[#0B3D39] ring-1 ring-black/10 dark:bg-white/5 dark:text-[#D4AF37] dark:ring-white/15"
        >
          Buka di Google Maps
        </a>
        {loc && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Lokasi: {loc.lat.toFixed(4)}, {loc.lon.toFixed(4)}
          </p>
        )}
      </Card>
    </div>
  );
}

// ---------- Arah Kiblat ----------
export function KiblatPage() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState("Ketuk tombol di bawah untuk mengaktifkan kompas.");
  const [supported, setSupported] = useState(true);

  const activate = () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      setSupported(false);
      setStatus("Perangkat ini tidak mendukung sensor kompas.");
      return;
    }
    const start = () => {
      if (!navigator.geolocation) {
        setStatus("Geolocation tidak tersedia di perangkat ini.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setBearing(qiblaBearing(pos.coords.latitude, pos.coords.longitude));
          setStatus("Kompas aktif — putar HP sampai panah menunjuk ke atas.");
        },
        () => setStatus("Izin lokasi ditolak — arah kiblat tidak bisa dihitung."),
        { timeout: 10000 }
      );
      const handler = (e: DeviceOrientationEvent) => {
        const h = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
        if (typeof h === "number") setHeading(h);
        else if (e.alpha !== null) setHeading(360 - e.alpha);
      };
      window.addEventListener("deviceorientation", handler);
    };
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === "function") {
      doe
        .requestPermission()
        .then((res) => (res === "granted" ? start() : setStatus("Izin kompas ditolak.")))
        .catch(() => setStatus("Izin kompas tidak bisa diminta."));
    } else {
      start();
    }
  };

  const rotation = bearing !== null && heading !== null ? bearing - heading : 0;
  return (
    <div>
      <PageHeader title="Arah Kiblat" subtitle="Kompas kiblat dari lokasimu" backHref="/ibadah" />
      <Card className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[#F5F5F4] ring-4 ring-[#0B3D39]/20 dark:bg-white/10 dark:ring-[#D4AF37]/25">
          <span className="absolute top-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">U</span>
          <span
            className="text-[#0B3D39] transition-transform duration-200 dark:text-[#D4AF37]"
            style={{ transform: `rotate(${rotation + 90}deg)` }}
            aria-hidden
          >
            <Icon name="arrow-left" className="h-14 w-14" />
          </span>
          <span className="absolute bottom-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">S</span>
        </div>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {bearing !== null ? `Arah kiblat: ${Math.round(bearing)}° dari utara` : "Arah kiblat belum dihitung"}
        </p>
        <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{status}</p>
        <button onClick={activate} className="rounded-2xl bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          Aktifkan Kompas
        </button>
        {!supported && (
          <Note>
            Perangkat ini tidak punya sensor kompas. Sebagai patokan umum dari Jawa: kiblat menghadap
            ke barat laut (sekitar 295° dari utara).
          </Note>
        )}
      </Card>
    </div>
  );
}

// ---------- Amal Harian ----------
export function AmalPage() {
  const { progress, toggleAmal } = useProgress();
  const t = new Date();
  const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  const doneCount = AMAL_HARIAN.filter((a) => progress.amalDone[`${key}:${a}`]).length;
  return (
    <div>
      <PageHeader title="Amal Harian" subtitle={`${doneCount}/${AMAL_HARIAN.length} selesai hari ini`} backHref="/ibadah" />
      <div className="flex flex-col gap-2">
        {AMAL_HARIAN.map((a) => {
          const done = !!progress.amalDone[`${key}:${a}`];
          return (
            <button key={a} onClick={() => toggleAmal(a)} className="w-full text-left">
              <Card className={`flex items-center gap-3 ${done ? "bg-[#0B3D39]/5 dark:bg-[#D4AF37]/10" : ""}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${done ? "bg-[#0B3D39] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-black/10 text-neutral-500 dark:bg-white/15 dark:text-neutral-400"}`}>
                  {done ? <Icon name="check" className="h-4 w-4" /> : ""}
                </span>
                <span className={`text-sm font-bold ${done ? "text-[#0B3D39] line-through dark:text-[#D4AF37]" : "text-neutral-900 dark:text-neutral-100"}`}>{a}</span>
              </Card>
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        <ProgressBar value={doneCount} max={AMAL_HARIAN.length} />
      </div>
    </div>
  );
}

// ---------- Asmaul Husna ----------
export function AsmaulHusnaPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ASMAUL_HUSNA;
    return ASMAUL_HUSNA.filter(
      (a) => a.latin.toLowerCase().includes(s) || a.meaning.toLowerCase().includes(s) || String(a.no) === s
    );
  }, [q]);
  return (
    <div>
      <PageHeader title="Asmaul Husna" subtitle="99 nama Allah yang indah" backHref="/ibadah" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari nama atau arti… (mis. Pengasih)"
        className="mb-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:bg-[#171717] dark:ring-white/15"
      />
      <div className="flex flex-col gap-2">
        {filtered.map((a) => (
          <Card key={a.no} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/20 text-sm font-extrabold text-[#8a6d1c] dark:text-[#D4AF37]">
              {a.no}
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">{a.latin}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{a.meaning}</p>
            </div>
            <span className="arabic text-2xl text-[#0B3D39] dark:text-[#D4AF37]">{a.arabic}</span>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">Tidak ditemukan. Coba kata lain.</p>}
      </div>
    </div>
  );
}

// ---------- Yasin & Tahlil ----------

type YasinAyah = { numberInSurah: number; text: string };

function YasinReader() {
  const { progress, setLastRead } = useProgress();
  const [ayahs, setAyahs] = useState<YasinAyah[]>([]);
  const [trans, setTrans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qari, setQari] = useState(QARIS[0]);
  const [audioError, setAudioError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");
  const audioUrl = surahAudioUrl(qari.edition, 36);
  const lastReadAyah = progress.lastRead?.surahNo === 36 ? progress.lastRead.ayah : null;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchSurahText(36)
      .then(({ arabic, translation }) => {
        if (!alive) return;
        setAyahs(arabic.map((text, i) => ({ numberInSurah: i + 1, text })));
        setTrans(translation);
      })
      .catch(
        () =>
          alive &&
          setError(
            "Tidak bisa memuat Surat Yasin dari Quran.com API (cadangan AlQuran Cloud juga gagal). Periksa koneksi internet."
          )
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (progress.lastRead?.surahNo !== 36) {
      setLastRead({ surahNo: 36, surahName: "Yaseen", ayah: 1, at: new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAyah = (ayah: number) => {
    setLastRead({ surahNo: 36, surahName: "Yaseen", ayah, at: new Date().toISOString() });
  };

  const jumpToAyah = (ayah: number) => {
    markAyah(ayah);
    document
      .getElementById(`yasin-ayah-${ayah}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fontSizeClass =
    fontSize === "md" ? "text-[24px]" : fontSize === "xl" ? "text-[32px]" : "text-[28px]";

  return (
    <div>
      <Card className="mb-3">
        <p className="mb-1 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          Surat Yasin · 83 ayat · Makkiyah
        </p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {QURAN_SOURCE_NOTE}. Ketuk sebuah ayat untuk menandainya sebagai terakhir dibaca.
        </p>
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
          <Icon name="audio" className="h-4 w-4 text-[#0B3D39] dark:text-[#D4AF37]" />
          Dengarkan — {qari.name}
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {QARIS.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setQari(q);
                setAudioError(false);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                qari.id === q.id
                  ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                  : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
              }`}
            >
              {q.name}
            </button>
          ))}
        </div>
        <audio
          key={audioUrl}
          controls
          preload="none"
          className="w-full"
          src={audioUrl}
          onError={() => setAudioError(true)}
        />
        {audioError && (
          <p className="mt-2 text-xs leading-relaxed text-red-600 dark:text-red-400">
            Audio tidak bisa dimuat dari server (periksa koneksi internet atau coba qari lain).
            Pemutar hanya memutar rekaman asli dari CDN.
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/5 pt-3 dark:border-white/10">
          <button
            onClick={() => setShowTranslation((v) => !v)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            <Icon name="eye" className="h-4 w-4" /> Terjemahan
            <span className="text-xs text-[#0B3D39] dark:text-[#D4AF37]">
              {showTranslation ? "Tampil" : "Sembunyi"}
            </span>
          </button>
          <span className="flex items-center gap-1">
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Ukuran teks</span>
            {(["md", "lg", "xl"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                  fontSize === s
                    ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                    : "bg-black/5 dark:bg-white/10"
                }`}
              >
                {s === "md" ? "A-" : s === "lg" ? "A" : "A+"}
              </button>
            ))}
          </span>
        </div>
      </Card>

      {lastReadAyah != null && (
        <button
          onClick={() => jumpToAyah(lastReadAyah)}
          className="mb-3 flex w-full items-center justify-between rounded-2xl bg-[#0B3D39]/5 px-4 py-3 text-left ring-1 ring-[#0B3D39]/20 dark:bg-[#D4AF37]/10 dark:ring-[#D4AF37]/25"
        >
          <span className="text-sm font-bold text-[#0B3D39] dark:text-[#D4AF37]">
            Terakhir dibaca: Ayat {lastReadAyah}
          </span>
          <span className="text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">Lanjutkan</span>
        </button>
      )}

      <Card className="px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Memuat Surat Yasin dari AlQuran Cloud API…
          </p>
        ) : error ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <>
            <p className="arabic mb-5 text-center text-2xl text-neutral-900 dark:text-neutral-100">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className={`mushaf ${fontSizeClass} text-neutral-900 dark:text-neutral-100`}>
              {ayahs.map((a) => (
                <span
                  key={a.numberInSurah}
                  id={`yasin-ayah-${a.numberInSurah}`}
                  onClick={() => markAyah(a.numberInSurah)}
                  className={`ayah ${lastReadAyah === a.numberInSurah ? "last-read" : ""}`}
                  title={`Ketuk untuk menandai Ayat ${a.numberInSurah} sebagai terakhir dibaca`}
                >
                  {a.text}{" "}
                  <span className="ayah-mark">
                    ۝<span className="ayah-no">{a.numberInSurah}</span>
                  </span>{" "}
                </span>
              ))}
            </p>
            {showTranslation && trans.length > 0 && (
              <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/10">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Terjemahan
                </p>
                {trans.map((t, i) => (
                  <p
                    key={i}
                    className="mb-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="font-extrabold text-[#C9A227]">{i + 1}.</span> {t}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

function TahlilSteps() {
  const { progress, setTasbih } = useProgress();
  const [open, setOpen] = useState<number | null>(1);
  const count = progress.tasbihCounts["tahlil"] ?? 0;
  const target = 100;
  return (
    <div>
      <div className="mb-3">
        <Note>
          Susunan bacaan tahlil singkat menurut NU Online — &quot;Surat Yasin, Susunan Tahlil
          Singkat, dan Doa Arwah&quot; (LBM PBNU, 11 Juni 2019). Ketuk tiap langkah untuk
          membaca teksnya.
        </Note>
      </div>
      <div className="flex flex-col gap-2">
        {TAHLIL_STEPS.map((s) => (
          <Card key={s.no}>
            <button
              className="flex w-full items-center gap-3 text-left"
              onClick={() => setOpen(open === s.no ? null : s.no)}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
                {s.no}
              </span>
              <span className="flex-1 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                {s.title}
                {s.count && (
                  <span className="ml-2 rounded-full bg-[#0B3D39]/10 px-2 py-0.5 text-[11px] font-extrabold text-[#0B3D39] dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]">
                    {s.count}
                  </span>
                )}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">{open === s.no ? "▾" : "▸"}</span>
            </button>
            {open === s.no && (
              <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
                <p className="arabic whitespace-pre-line text-right text-2xl leading-loose text-neutral-900 dark:text-neutral-100">
                  {s.arabic}
                </p>
                <p className="mt-2 text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {s.latin}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {s.translation}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="mt-3">
        <p className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          Hitung tahlil — {TAHLIL_TEXT.title} 100x
        </p>
        <p className="arabic mt-2 text-right text-2xl leading-loose text-neutral-900 dark:text-neutral-100">
          {TAHLIL_TEXT.arabic}
        </p>
        <p className="mt-2 text-sm italic text-neutral-600 dark:text-neutral-400">{TAHLIL_TEXT.latin}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {TAHLIL_TEXT.translation}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => count < target && setTasbih("tahlil", count + 1)}
            className="flex-1 rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Hitung ({count}/{target})
          </button>
          <button
            onClick={() => setTasbih("tahlil", 0)}
            className="rounded-2xl bg-[#F5F5F4] px-4 py-3 text-sm font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
          >
            Ulang
          </button>
        </div>
        <div className="mt-2">
          <ProgressBar value={count} max={target} />
        </div>
      </Card>
      <div className="mt-3">
        <Note>{TAHLIL_TEXT.note}</Note>
      </div>
    </div>
  );
}

function DoaTahlil() {
  return (
    <div>
      <div className="mb-3">
        <Note>
          Doa penutup tahlil (doa arwah) menurut NU Online — &quot;Surat Yasin, Susunan
          Tahlil Singkat, dan Doa Arwah&quot; (LBM PBNU, 11 Juni 2019). Dibaca setelah
          rangkaian tahlil selesai.
        </Note>
      </div>
      <div className="flex flex-col gap-3">
        {DOA_TAHLIL.map((d) => (
          <Card key={d.title}>
            <h2 className="font-extrabold text-neutral-900 dark:text-neutral-100">{d.title}</h2>
            <p className="arabic mt-3 text-right text-2xl leading-loose text-neutral-900 dark:text-neutral-100">
              {d.arabic}
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-400">
              {d.latin}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {d.translation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function YasinTahlilPage() {
  const [tab, setTab] = useState<"yasin" | "tahlil" | "doa">("yasin");
  const tabs = [
    { id: "yasin", label: "Surat Yasin" },
    { id: "tahlil", label: "Tahlil" },
    { id: "doa", label: "Doa Tahlil" },
  ] as const;
  return (
    <div>
      <PageHeader
        title="Yasin & Tahlil"
        subtitle="Surat Yasin, susunan tahlil, dan doa arwah"
        backHref="/ibadah"
      />
      <div className="mb-3 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold ${
              tab === t.id
                ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "yasin" && <YasinReader />}
      {tab === "tahlil" && <TahlilSteps />}
      {tab === "doa" && <DoaTahlil />}
    </div>
  );
}
