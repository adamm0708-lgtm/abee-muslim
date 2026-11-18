"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Note, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";
import {
  PRAYER_ORDER,
  daysToRamadhan,
  getTimings,
  hijriParts,
  hijriToday,
  qiblaBearing,
  type Timings,
} from "@/lib/api";
import {
  AMAL_HARIAN,
  ASMAUL_HUSNA,
  DUAS,
  DZIKIR,
  SHALAT_STEPS,
  TAHLIL_TEXT,
  WUDHU_STEPS,
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
              <span className="font-extrabold text-abee-ink dark:text-[#F7F2E7]">{d.title}</span>
              <span className="text-slate-400 dark:text-[#7FA294]">{open === d.id ? "▾" : "▸"}</span>
            </button>
            {open === d.id && (
              <div className="mt-3 border-t border-black/5 dark:border-white/10 pt-3">
                <p className="arabic text-right text-2xl text-abee-ink dark:text-[#F7F2E7]">{d.arabic}</p>
                <p className="mt-2 text-sm italic text-slate-600 dark:text-[#B9D2C6]">{d.latin}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-[#D5E5DC]">{d.translation}</p>
                <p className="mt-2 text-xs text-slate-400 dark:text-[#7FA294]">{d.source}</p>
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
  const count = progress.tasbihCounts["tasbih"] ?? 0;
  const done = count >= target;
  const tap = () => {
    if (done) return;
    const next = count + 1;
    setTasbih("tasbih", next);
    if (next === target) addPoints(10);
  };
  return (
    <div>
      <PageHeader title="Tasbih Digital" subtitle="Ketuk lingkaran untuk berdzikir" backHref="/ibadah" />
      <Card className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex gap-2">
          {[33, 99, 100].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${target === t ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#B9D2C6]"}`}
            >
              {t}x
            </button>
          ))}
        </div>
        <button
          onClick={tap}
          className={`flex h-44 w-44 flex-col items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 ${done ? "bg-emerald-500" : "bg-abee-green"}`}
          aria-label="Ketuk untuk menghitung tasbih"
        >
          <span className="text-5xl font-extrabold">{count}</span>
          <span className="text-sm opacity-80">/ {target}</span>
        </button>
        <p className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
          {done ? "Alhamdulillah, target tercapai! +10 poin 🎉" : "Subhanallah · Alhamdulillah · Allahu Akbar"}
        </p>
        <ProgressBar value={count} max={target} />
        <button
          onClick={() => setTasbih("tasbih", 0)}
          className="rounded-full bg-slate-100 dark:bg-white/10 px-4 py-2 text-sm font-bold text-slate-600 dark:text-[#B9D2C6]"
        >
          Ulang dari 0
        </button>
      </Card>
      <Note>
        Hitungan tersimpan di perangkatmu. Kalau Supabase diaktifkan, hitungan juga tersimpan di
        akunmu dan bisa lanjut di perangkat lain.
      </Note>
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
      <PageHeader title="Jadwal Shalat" subtitle={`Kota: ${progress.city} · Metode Kemenag (Aladhan API)`} backHref="/ibadah" />
      <Card>
        <p className="mb-3 text-sm text-slate-500 dark:text-[#A8C3B5]">Hijriah: {hijriToday()}</p>
        {timings ? (
          <div className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
            {PRAYER_ORDER.map((name) => (
              <div key={name} className="flex items-center justify-between py-3">
                <span className="font-bold text-abee-ink dark:text-[#F7F2E7]">{name === "Terbit" ? "Terbit (Syuruq)" : name}</span>
                <span className="font-mono text-lg font-extrabold text-abee-green dark:text-teal-300">{timings[name]}</span>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-slate-600 dark:text-[#B9D2C6]">Jadwal shalat tidak bisa dimuat. Periksa koneksi internet, lalu buka lagi halaman ini.</p>
        ) : (
          <p className="text-sm text-slate-600 dark:text-[#B9D2C6]">Memuat jadwal shalat…</p>
        )}
      </Card>
      <Note>
        Waktu shalat diambil langsung dari Aladhan API (api.aladhan.com) dengan metode 20
        (Kementerian Agama RI). Ganti kota di menu Atur.
      </Note>
    </div>
  );
}

// ---------- Road to Ramadhan ----------
export function RamadhanPage() {
  const [days, setDays] = useState<number | null>(null);
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    setDays(daysToRamadhan());
    const start = new Date();
    for (let i = 0; i < 400; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const h = hijriParts(d);
      if (h.month === 9 && h.day === 1) {
        setDateStr(
          d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        );
        break;
      }
    }
  }, []);
  return (
    <div>
      <PageHeader title="Road to Ramadhan" subtitle="Hitung mundur menuju bulan suci" backHref="/ibadah" />
      <Card className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-center !text-white">
        <p className="text-6xl font-extrabold">{days === null ? "…" : days}</p>
        <p className="text-lg font-bold">hari lagi menuju 1 Ramadhan</p>
        {dateStr && <p className="mt-1 text-sm opacity-80">Diperkirakan: {dateStr}</p>}
      </Card>
      <Card>
        <h2 className="font-extrabold text-abee-ink dark:text-[#F7F2E7]">Persiapan Ramadhan</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700 dark:text-[#D5E5DC]">
          <li>Perbanyak puasa sunnah Senin–Kamis dan Ayyamul Bidh.</li>
          <li>Mulai khatam Al-Qur&apos;an sedikit demi sedikit (lihat Khatam Planner).</li>
          <li>Latih shalat malam dan dzikir pagi–petang.</li>
          <li>Siapkan target sedekah dan amal harian.</li>
        </ul>
      </Card>
      <Note>
        Tanggal 1 Ramadhan dihitung dari kalender Hijriah (Intl) dan bisa bergeser 1 hari mengikuti
        keputusan pemerintah / rukyatul hilal.
      </Note>
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
  const cells: { g: number; h: number; hm: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const h = hijriParts(date);
    const hm = new Intl.DateTimeFormat("id-ID-u-ca-islamic", { month: "short" }).format(date);
    cells.push({ g: d, h: h.day, hm });
  }
  const blanks = Array.from({ length: startWeekday }, (_, i) => i);
  return (
    <div>
      <PageHeader
        title="Kalender Hijriyah"
        subtitle={`${now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })} · ${hijriToday()}`}
        backHref="/ibadah"
      />
      <Card>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 dark:text-[#7FA294]">
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
                c.g === now.getDate() ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26] ring-abee-green" : "bg-slate-50 dark:bg-white/5 ring-black/5 dark:ring-white/10"
              }`}
            >
              <p className="text-sm font-extrabold">{c.g}</p>
              <p className={`text-[10px] ${c.g === now.getDate() ? "text-white/80" : "text-emerald-600 dark:text-emerald-400"}`}>
                {c.h} {c.hm}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-[#A8C3B5]">
          Angka besar = tanggal Masehi, angka kecil hijau = tanggal Hijriah. Kalender Hijriah
          dihitung otomatis dari perangkatmu.
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
      <div className="mb-3 flex gap-2">
        <button onClick={() => setTab("wudhu")} className={`flex-1 rounded-2xl py-3 text-sm font-bold ${tab === "wudhu" ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-white dark:bg-[#14382E] text-slate-600 dark:text-[#B9D2C6] ring-1 ring-black/10 dark:ring-white/15"}`}>
          💧 Wudhu
        </button>
        <button onClick={() => setTab("shalat")} className={`flex-1 rounded-2xl py-3 text-sm font-bold ${tab === "shalat" ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-white dark:bg-[#14382E] text-slate-600 dark:text-[#B9D2C6] ring-1 ring-black/10 dark:ring-white/15"}`}>
          🕌 Shalat
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <Card key={i} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-abee-green dark:bg-[#D4AF37] text-sm font-extrabold text-white dark:text-[#0B2E26]">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-[#D5E5DC]">{s}</p>
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
              <p className="arabic text-right text-2xl text-abee-ink dark:text-[#F7F2E7]">{d.arabic}</p>
              <p className="mt-1 text-sm italic text-slate-600 dark:text-[#B9D2C6]">{d.latin}</p>
              <p className="text-sm text-slate-700 dark:text-[#D5E5DC]">{d.translation}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => !done && setTasbih(d.id, count + 1)}
                  className={`flex-1 rounded-2xl py-2.5 text-sm font-bold ${done ? "bg-emerald-100 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300" : "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26] active:scale-95"}`}
                >
                  {done ? "Selesai ✓" : `Hitung (${count}/${d.count})`}
                </button>
                <button onClick={() => setTasbih(d.id, 0)} className="rounded-2xl bg-slate-100 dark:bg-white/10 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-[#B9D2C6]">
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
        <p className="arabic text-right text-2xl leading-loose text-abee-ink dark:text-[#F7F2E7]">{TAHLIL_TEXT.arabic}</p>
        <p className="mt-2 text-sm italic text-slate-600 dark:text-[#B9D2C6]">{TAHLIL_TEXT.latin}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-[#D5E5DC]">{TAHLIL_TEXT.translation}</p>
        <p className="mt-2 text-xs text-slate-400 dark:text-[#7FA294]">{TAHLIL_TEXT.note}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => count < target && setTasbih("tahlil", count + 1)}
            className="flex-1 rounded-2xl bg-abee-green dark:bg-[#D4AF37] py-3 text-sm font-bold text-white dark:text-[#0B2E26] active:scale-95"
          >
            Hitung ({count}/{target})
          </button>
          <button onClick={() => setTasbih("tahlil", 0)} className="rounded-2xl bg-slate-100 dark:bg-white/10 px-4 py-3 text-sm font-bold text-slate-600 dark:text-[#B9D2C6]">
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
        <p className="text-sm leading-relaxed text-slate-700 dark:text-[#D5E5DC]">
          Aplikasi ini tidak menyimpan daftar masjid sendiri — pencarian dibuka langsung di Google
          Maps supaya datanya selalu terbaru.
        </p>
        <button onClick={requestLoc} className="rounded-2xl bg-abee-green dark:bg-[#D4AF37] py-3 text-sm font-bold text-white dark:text-[#0B2E26]">
          📍 Gunakan lokasiku
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
          className="rounded-2xl bg-white dark:bg-[#14382E] py-3 text-center text-sm font-bold text-abee-green dark:text-teal-300 ring-1 ring-black/10 dark:ring-white/15"
        >
          Buka di Google Maps →
        </a>
        {loc && (
          <p className="text-xs text-slate-500 dark:text-[#A8C3B5]">
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
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 ring-4 ring-abee-green/20">
          <span className="absolute top-2 text-xs font-bold text-slate-400 dark:text-[#7FA294]">U</span>
          <span
            className="text-6xl transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
            aria-hidden
          >
            ⬆️
          </span>
          <span className="absolute bottom-2 text-xs font-bold text-slate-400 dark:text-[#7FA294]">S</span>
        </div>
        <p className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
          {bearing !== null ? `Arah kiblat: ${Math.round(bearing)}° dari utara` : "Arah kiblat belum dihitung"}
        </p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-[#A8C3B5]">{status}</p>
        <button onClick={activate} className="rounded-2xl bg-abee-green dark:bg-[#D4AF37] px-6 py-3 text-sm font-bold text-white dark:text-[#0B2E26]">
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
              <Card className={`flex items-center gap-3 ${done ? "bg-emerald-50 dark:bg-emerald-400/10" : ""}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${done ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-white/15 text-slate-500 dark:text-[#A8C3B5]"}`}>
                  {done ? "✓" : ""}
                </span>
                <span className={`text-sm font-bold ${done ? "text-emerald-800 dark:text-emerald-200 line-through" : "text-abee-ink dark:text-[#F7F2E7]"}`}>{a}</span>
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
        className="mb-3 w-full rounded-2xl bg-white dark:bg-[#14382E] px-4 py-3 text-sm font-semibold ring-1 ring-black/10 dark:ring-white/15 outline-none focus:ring-2 focus:ring-abee-green"
      />
      <div className="flex flex-col gap-2">
        {filtered.map((a) => (
          <Card key={a.no} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-abee-gold/20 text-sm font-extrabold text-amber-700 dark:text-amber-300">
              {a.no}
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-abee-ink dark:text-[#F7F2E7]">{a.latin}</p>
              <p className="text-xs text-slate-500 dark:text-[#A8C3B5]">{a.meaning}</p>
            </div>
            <span className="arabic text-2xl text-abee-green dark:text-teal-300">{a.arabic}</span>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-slate-500 dark:text-[#A8C3B5]">Tidak ditemukan. Coba kata lain.</p>}
      </div>
    </div>
  );
}
