"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Card, Icon, Note, PageHeader, ProgressBar, toArabicIndic } from "@/components/ui";
import { ReaderToolbar } from "@/components/reading";
import { CSS_FULLSCREEN_CLASS, normalizeArabicText, useFullscreen, useReaderFontSize } from "@/lib/reading";
import { useProgress } from "@/lib/store";
import {
  HIJRI_MONTHS_SHORT_ID,
  JADWAL_ORDER,
  QURAN_SOURCE_NOTE,
  fetchSurahMsi,
  fetchSurahTajweed,
  fetchSurahText,
  fetchSurahUthmani,
  getHijriMonthCalendar,
  getHijriToday,
  getRamadhanInfo,
  getTimings,
  qiblaBearing,
  type HijriParts,
  type Timings,
} from "@/lib/api";
import { mapTajweedSurah } from "@/lib/tajweed-map";
import { useAutoScrollLoop } from "@/lib/autoscroll";
import { JUZ_SAJDAH_LEGEND, SIFIR_LEGEND, WAQAF_LEGEND } from "@/lib/tajweed";
import {
  AMAL_HARIAN,
  ASMAUL_HUSNA,
  DOA_SETELAH_SHALAT,
  DOA_SETELAH_SURAT,
  DOA_TAHLIL,
  DUAS,
  DUA_CATEGORIES,
  DZIKIR,
  DZIKIR_PAGI,
  DZIKIR_PETANG,
  DZIKIR_WIRID_MENU,
  QARIS,
  SHALAT_STEPS,
  TAHLIL_STEPS,
  TAHLIL_TEXT,
  WIRID_SESUDAH_SHALAT,
  WUDHU_STEPS,
  surahAudioUrl,
  type IconName,
  type WiridItem,
} from "@/lib/data";
import {
  FARDHU_NIAT,
  MANDI_CAUSES,
  MANDI_NIAT,
  MANDI_RUKUN,
  MANDI_STEPS,
  RAWATIB,
  RAWATIB_KEUTAMAAN,
  SHALAT_READINGS,
  WUDHU_READINGS,
  type BacaanShalat,
  type RawatibItem,
} from "@/lib/shalat-wudhu";

// ---------- Doa Harian ----------
const STATUS_BADGE: Record<string, string> = {
  Shahih:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Hasan: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Dhaif: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Al-Qur'an":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Fikih Syafi'i":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Doa umum": "bg-neutral-200 text-neutral-700 dark:bg-white/10 dark:text-neutral-300",
};

function DuaCard({
  d,
  open,
  onToggle,
  showCategory,
  arabicClass,
  bodyClass,
}: {
  d: (typeof DUAS)[number];
  open: boolean;
  onToggle: () => void;
  showCategory?: boolean;
  arabicClass: string;
  bodyClass: string;
}) {
  const catLabel = DUA_CATEGORIES.find((c) => c.slug === d.category)?.label ?? d.category;
  return (
    <Card>
      <button
        className="flex w-full items-center justify-between gap-2 text-left"
        onClick={onToggle}
      >
        <span className="min-w-0">
          <span className="block truncate font-extrabold text-neutral-900 dark:text-neutral-100">
            {d.title}
          </span>
          {showCategory && (
            <span className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
              {catLabel}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
              STATUS_BADGE[d.status] ?? STATUS_BADGE["Doa umum"]
            }`}
          >
            {d.status}
          </span>
          <span className="text-neutral-400 dark:text-neutral-500">{open ? "▾" : "▸"}</span>
        </span>
      </button>
      {open && (
        <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
          <p className={`arabic text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
            {normalizeArabicText(d.arabic)}
          </p>
          <p className={`mt-2 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{d.latin}</p>
          <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
            {d.translation}
          </p>
          {d.note && (
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              <span className="font-extrabold text-neutral-600 dark:text-neutral-300">
                Keterangan:{" "}
              </span>
              {d.note}
            </p>
          )}
          <p className="mt-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">
            {d.source}
          </p>
        </div>
      )}
    </Card>
  );
}

export function DoaPage() {
  const [open, setOpen] = useState<string | null>("bangun-tidur");
  const [cat, setCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  const fs = useFullscreen();

  const shown = useMemo(() => {
    let list = DUAS;
    if (cat) list = list.filter((d) => d.category === cat);
    if (q)
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.translation.toLowerCase().includes(q)
      );
    return list;
  }, [cat, q]);

  const toggle = (id: string) => setOpen(open === id ? null : id);
  const countFor = (slug: string) => DUAS.filter((d) => d.category === slug).length;

  return (
    <div ref={fs.ref} className={fs.cssActive ? CSS_FULLSCREEN_CLASS : undefined}>
      <PageHeader
        title="Doa Harian"
        subtitle={`${DUAS.length} doa dalam ${DUA_CATEGORIES.length} kategori — ketuk kategori atau cari judulnya`}
        backHref="/ibadah"
      />

      <ReaderToolbar
        size={size}
        onSizeChange={setSize}
        fullscreenActive={fs.active}
        onFullscreenToggle={fs.toggle}
      />

      {/* Cari doa */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari doa… (mis. masuk pasar, wudhu, safar)"
        className="mb-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:bg-[#171717] dark:ring-white/15"
      />

      {/* Kategori */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full px-3.5 py-2 text-xs font-bold ${
            cat === null
              ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
              : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/10"
          }`}
        >
          Semua ({DUAS.length})
        </button>
        {DUA_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(cat === c.slug ? null : c.slug)}
            className={`rounded-full px-3.5 py-2 text-xs font-bold ${
              cat === c.slug
                ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/10"
            }`}
          >
            {c.label} ({countFor(c.slug)})
          </button>
        ))}
      </div>

      {/* Daftar doa: hasil cari / satu kategori = daftar datar; "Semua" = per kategori */}
      {q || cat ? (
        <div className="flex flex-col gap-3">
          {shown.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Tidak ditemukan. Coba kata kunci lain.
            </p>
          ) : (
            shown.map((d) => (
              <DuaCard
                key={d.id}
                d={d}
                open={open === d.id}
                onToggle={() => toggle(d.id)}
                showCategory={q !== ""}
                arabicClass={arabicClass}
                bodyClass={bodyClass}
              />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {DUA_CATEGORIES.map((c) => {
            const items = DUAS.filter((d) => d.category === c.slug);
            if (items.length === 0) return null;
            return (
              <div key={c.slug}>
                <button
                  onClick={() => setCat(c.slug)}
                  className="mb-2 flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                    {c.label}
                  </span>
                  <span className="text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">
                    {items.length} doa · Lihat semua ›
                  </span>
                </button>
                <div className="flex flex-col gap-3">
                  {items.slice(0, 3).map((d) => (
                    <DuaCard
                      key={d.id}
                      d={d}
                      open={open === d.id}
                      onToggle={() => toggle(d.id)}
                      arabicClass={arabicClass}
                      bodyClass={bodyClass}
                    />
                  ))}
                  {items.length > 3 && (
                    <button
                      onClick={() => setCat(c.slug)}
                      className="rounded-2xl bg-white py-2.5 text-xs font-bold text-neutral-500 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-400 dark:ring-white/10"
                    >
                      + {items.length - 3} doa lagi di {c.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <Note>
          Lencana status: <b>Shahih</b> (riwayat sahih) · <b>Hasan</b> (baik) ·{" "}
          <b>Dhaif</b> (lemah) · <b>Doa umum</b> (susunan doa memohon kebaikan, bukan
          riwayat khusus dari Rasulullah ﷺ). Doa dari ayat Al-Qur&apos;an dilabel Shahih
          karena teksnya otentik dari mushaf.
        </Note>
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
// Bacaan wudhu, bacaan shalat & sunnah rawatib (Adam 2026-11-20 20:45 WIB).
// Niat wudhu, mandi besar & niat shalat fardhu (Adam 2026-11-20 21:36 WIB).
// Teks Arab diverifikasi silang dari kitab hadis / fikih Syafi'i — lihat lib/shalat-wudhu.ts.

function BacaanCard({
  b,
  index,
  arabicClass,
  bodyClass,
}: {
  b: BacaanShalat;
  index: number;
  arabicClass: string;
  bodyClass: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B3D39] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">{b.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_BADGE[b.status]}`}>{b.status}</span>
          </div>
          {b.verses ? (
            <div className="mt-2 flex flex-col gap-1">
              {b.verses.map((v, i) => (
                <p key={i} className={`arabic text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
                  {normalizeArabicText(v)}
                </p>
              ))}
            </div>
          ) : (
            <p className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              {normalizeArabicText(b.arabic)}
            </p>
          )}
          <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{b.latin}</p>
          <p className={`mt-1 text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{b.translation}</p>
          <p className={`mt-2 text-xs font-semibold text-[#0B3D39] dark:text-[#D4AF37] ${bodyClass}`}>{b.source}</p>
          {b.note && (
            <p className={`mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 ${bodyClass}`}>{b.note}</p>
          )}
          {b.link && (
            <Link
              href={b.link.href}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#0B3D39] px-3 py-1.5 text-xs font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
            >
              <Icon name="book-open" className="h-3.5 w-3.5" /> {b.link.label}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

function RawatibCard({
  r,
  arabicClass,
  bodyClass,
}: {
  r: RawatibItem;
  arabicClass: string;
  bodyClass: string;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">{r.title}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            r.muakkad
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
          }`}
        >
          {r.muakkad ? "Muakkad" : "Ghairu muakkad"}
        </span>
        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[11px] font-bold text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
          {r.rakaat} rakaat · {r.waktu}
        </span>
      </div>
      <p className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
        {normalizeArabicText(r.niatArab)}
      </p>
      <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{r.niatLatin}</p>
      <p className={`mt-1 text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{r.niatArti}</p>
      <p className={`mt-2 text-sm text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
        <span className="font-bold">Keutamaan: </span>
        {r.keutamaan}
      </p>
      <p className={`mt-1 text-xs font-semibold text-[#0B3D39] dark:text-[#D4AF37] ${bodyClass}`}>{r.source}</p>
      {r.note && (
        <p className={`mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 ${bodyClass}`}>{r.note}</p>
      )}
    </Card>
  );
}

export function ShalatWudhuPage() {
  const [tab, setTab] = useState<"wudhu" | "shalat" | "rawatib" | "mandi">("wudhu");
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  const steps = tab === "wudhu" ? WUDHU_STEPS : SHALAT_STEPS;
  const doaSetelahMandi = WUDHU_READINGS.find((b) => b.id === "doa-setelah-wudhu");
  const tabBtn = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${
      active
        ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/15"
    }`;
  return (
    <div>
      <PageHeader title="Belajar Shalat & Wudhu" subtitle="Langkah demi langkah" backHref="/ibadah" />
      <ReaderToolbar size={size} onSizeChange={setSize} showFullscreen={false} />
      <div className="mb-3">
        <Note>Panduan ibadah dalam aplikasi ini mengikuti mazhab Syafi&apos;i.</Note>
      </div>
      <div className="mb-3 flex gap-2">
        <button onClick={() => setTab("wudhu")} className={tabBtn(tab === "wudhu")}>
          <Icon name="droplet" className="h-4 w-4" /> Wudhu
        </button>
        <button onClick={() => setTab("shalat")} className={tabBtn(tab === "shalat")}>
          <Icon name="mosque" className="h-4 w-4" /> Shalat
        </button>
        <button onClick={() => setTab("rawatib")} className={tabBtn(tab === "rawatib")}>
          <Icon name="clock" className="h-4 w-4" /> Rawatib
        </button>
        <button onClick={() => setTab("mandi")} className={tabBtn(tab === "mandi")}>
          <Icon name="droplet" className="h-4 w-4" /> Mandi
        </button>
      </div>

      {tab === "rawatib" ? (
        <div className="flex flex-col gap-3">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                Sunnah Rawatib — 12 Rakaat Sehari Semalam
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_BADGE["Shahih"]}`}>Shahih</span>
            </div>
            <p className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              {normalizeArabicText(RAWATIB_KEUTAMAAN.arabic)}
            </p>
            <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{RAWATIB_KEUTAMAAN.latin}</p>
            <p className={`mt-1 text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{RAWATIB_KEUTAMAAN.translation}</p>
            <p className={`mt-2 text-xs font-semibold text-[#0B3D39] dark:text-[#D4AF37] ${bodyClass}`}>
              {RAWATIB_KEUTAMAAN.source}
            </p>
            <p className={`mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 ${bodyClass}`}>
              {RAWATIB_KEUTAMAAN.note}
            </p>
          </Card>
          <Note>
            Niat tempatnya di hati — lafaz niat di bawah ini menurut tuntunan fikih mazhab Syafi&apos;i (bukan
            riwayat hadis) dan hanya alat bantu belajar; shalat tetap sah tanpa melafazkannya.
          </Note>
          {RAWATIB.map((r) => (
            <RawatibCard key={r.id} r={r} arabicClass={arabicClass} bodyClass={bodyClass} />
          ))}
          <Note>
            Tidak ada ba&apos;diyah Subuh dan ba&apos;diyah Ashar — setelah Subuh dan setelah Ashar adalah waktu
            terlarang shalat sunnah (HR. Bukhari 586, Muslim 827). Rawatib 4 rakaat dikerjakan 2 rakaat + 2 rakaat,
            masing-masing dengan salam.
          </Note>
        </div>
      ) : tab === "mandi" ? (
        <div className="flex flex-col gap-3">
          <Card>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              Kapan Mandi Besar Wajib — 6 Perkara
            </h3>
            <p
              className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}
            >
              {normalizeArabicText(MANDI_CAUSES.arabic)}
            </p>
            <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>
              {MANDI_CAUSES.latin}
            </p>
            <p className={`mt-1 text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
              {MANDI_CAUSES.translation}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {MANDI_CAUSES.items.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-xs font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
                    {i + 1}
                  </span>
                  <p className={`leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{c}</p>
                </div>
              ))}
            </div>
            <p className={`mt-2 text-xs font-semibold text-[#0B3D39] dark:text-[#D4AF37] ${bodyClass}`}>
              {MANDI_CAUSES.source}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              Rukun Mandi — 2 Perkara
            </h3>
            <p
              className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}
            >
              {normalizeArabicText(MANDI_RUKUN.arabic)}
            </p>
            <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>
              {MANDI_RUKUN.latin}
            </p>
            <p className={`mt-1 text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
              {MANDI_RUKUN.translation}
            </p>
            <p className={`mt-2 text-xs font-semibold text-[#0B3D39] dark:text-[#D4AF37] ${bodyClass}`}>
              {MANDI_RUKUN.source}
            </p>
            <p className={`mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 ${bodyClass}`}>
              {MANDI_RUKUN.note}
            </p>
          </Card>

          <h2 className="mt-2 text-base font-extrabold text-neutral-900 dark:text-neutral-100">
            Langkah-Langkah Mandi yang Sempurna
          </h2>
          <div className="flex flex-col gap-2">
            {MANDI_STEPS.map((s, i) => (
              <Card key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
                  {i + 1}
                </span>
                <p className={`leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{s}</p>
              </Card>
            ))}
          </div>
          <Note>
            Sabun dan sampo bukan rukun mandi — yang mensucikan adalah air (air mutlak). Pakailah sabun/sampo
            setelah air merata ke seluruh tubuh (panduan NU Online).
          </Note>

          <h2 className="mt-2 text-base font-extrabold text-neutral-900 dark:text-neutral-100">
            Niat Mandi Besar
          </h2>
          <Note>
            Niat tempatnya di hati — lafaz niat di bawah ini menurut tuntunan fikih mazhab Syafi&apos;i (bukan
            riwayat hadis) dan hanya alat bantu belajar; mandi tetap sah tanpa melafazkannya, selama niat hadir di
            hati saat air pertama menyentuh tubuh.
          </Note>
          {MANDI_NIAT.map((b, i) => (
            <BacaanCard key={b.id} b={b} index={i} arabicClass={arabicClass} bodyClass={bodyClass} />
          ))}

          <h2 className="mt-2 text-base font-extrabold text-neutral-900 dark:text-neutral-100">
            Doa Setelah Mandi
          </h2>
          {doaSetelahMandi && (
            <BacaanCard
              b={{
                ...doaSetelahMandi,
                title: "Doa Setelah Mandi",
                note: "Doa ini adalah doa setelah wudhu (HR. Muslim 234, Tirmidzi 55). Dalam panduan mandi wajib yang diterbitkan Kemenag RI, doa yang sama dibaca setelah selesai mandi.",
              }}
              index={0}
              arabicClass={arabicClass}
              bodyClass={bodyClass}
            />
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <Card key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
                  {i + 1}
                </span>
                <p className={`leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{s}</p>
              </Card>
            ))}
          </div>

          {tab === "wudhu" ? (
            <div className="mt-5 flex flex-col gap-3">
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">Bacaan Wudhu</h2>
              <Note>
                Niat wudhu tempatnya di hati — lafaz niat di bawah ini menurut tuntunan fikih mazhab Syafi&apos;i
                (bukan riwayat hadis) dan hanya alat bantu belajar.
              </Note>
              {WUDHU_READINGS.map((b, i) => (
                <BacaanCard key={b.id} b={b} index={i} arabicClass={arabicClass} bodyClass={bodyClass} />
              ))}
              <Note>
                Doa khusus untuk tiap anggota wudhu (doa saat membasuh wajah, tangan, kepala, kaki) tidak dicantumkan
                di sini — tidak ada satu pun riwayat yang sahih dari Nabi ﷺ tentang itu. Imam An-Nawawi (Al-Adzkar
                hlm. 30) dan Ibnul Qayyim (Zad al-Ma&apos;ad 1/195) menjelaskan bahwa semua hadis tentang dzikir di
                tengah wudhu adalah dusta dan dibuat-buat. Yang diajarkan Nabi ﷺ hanyalah basmalah di awal wudhu dan
                doa setelah selesai berwudhu.
              </Note>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-3">
                <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  Niat Shalat Fardhu
                </h2>
                <Note>
                  Niat tempatnya di hati dan dihadirkan bersamaan dengan takbiratul ihram — lafaz niat di bawah ini
                  menurut tuntunan fikih mazhab Syafi&apos;i (bukan riwayat hadis) dan hanya alat bantu belajar;
                  shalat tetap sah tanpa melafazkannya.
                </Note>
                {FARDHU_NIAT.map((b, i) => (
                  <BacaanCard key={b.id} b={b} index={i} arabicClass={arabicClass} bodyClass={bodyClass} />
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">Bacaan Shalat</h2>
                {SHALAT_READINGS.map((b, i) => (
                  <BacaanCard key={b.id} b={b} index={i} arabicClass={arabicClass} bodyClass={bodyClass} />
                ))}
                <Link
                  href="/ibadah/doa"
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] dark:bg-[#171717] dark:ring-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B3D39] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
                    <Icon name="hands" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                      Doa Qunut Subuh
                    </span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      Sudah ada di Doa Harian — ketuk untuk membuka
                    </span>
                  </span>
                  <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-neutral-400" />
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ---------- Dzikir Harian ----------
export function DzikirPage() {
  const { progress, setTasbih } = useProgress();
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  return (
    <div>
      <PageHeader title="Dzikir Harian" subtitle="Ketuk untuk menghitung, target per dzikir" backHref="/ibadah" />
      <ReaderToolbar size={size} onSizeChange={setSize} showFullscreen={false} />
      <div className="flex flex-col gap-3">
        {DZIKIR.map((d) => {
          const count = progress.tasbihCounts[d.id] ?? 0;
          const done = count >= d.count;
          return (
            <Card key={d.id}>
              <p className={`arabic text-right text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>{normalizeArabicText(d.arabic)}</p>
              <p className={`mt-1 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{d.latin}</p>
              <p className={`text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{d.translation}</p>
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

// ---------- Dzikir dan Wirid (grup baru, Adam 2026-11-20) ----------
// Grup "Dzikir dan Wirid": Dzikir Setelah Shalat Fardlu, Dzikir Pagi,
// Dzikir Petang. Tiap bacaan punya counter ketuk (pola DzikirPage) +
// progres keseluruhan + tombol "Mulai dari awal". Di bawah halaman wirid
// ada tombol "Doa Setelah Shalat" (Adam 2026-11-20 09:32 WIB).

const DZIKIR_WIRID_ICONS: Record<string, IconName> = {
  wirid: "clock",
  "dzikir-pagi": "leaf",
  "dzikir-petang": "moon",
};

export function DzikirWiridPage() {
  return (
    <div>
      <PageHeader title="Dzikir dan Wirid" subtitle="Wirid sesudah salat & dzikir pagi petang" backHref="/ibadah" />
      <div className="mb-3">
        <Note>Dzikir dan wirid harian — pilih salah satu untuk memulai.</Note>
      </div>
      <div className="flex flex-col gap-2">
        {DZIKIR_WIRID_MENU.map((m) => (
          <Link
            key={m.slug}
            href={`/ibadah/${m.slug}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] dark:bg-[#171717] dark:ring-white/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
              <Icon name={DZIKIR_WIRID_ICONS[m.slug] ?? "book"} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-neutral-900 dark:text-neutral-100">{m.label}</span>
              <span className="block text-xs font-bold text-neutral-400 dark:text-neutral-500">{m.desc}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">▸</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function WiridCard({
  item,
  index,
  showCounter = true,
  arabicClass,
  bodyClass,
}: {
  item: WiridItem;
  index: number;
  showCounter?: boolean;
  arabicClass: string;
  bodyClass: string;
}) {
  const { progress, setTasbih } = useProgress();
  const count = progress.tasbihCounts[item.id] ?? 0;
  const done = count >= item.count;
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-extrabold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{item.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                STATUS_BADGE[item.status] ?? STATUS_BADGE["Doa umum"]
              }`}
            >
              {item.status}
            </span>
            {item.special && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {item.special}
              </span>
            )}
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
              {item.count}x
            </span>
          </div>
          <p className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
            {normalizeArabicText(item.arabic)}
          </p>
          <p className={`mt-2 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{item.latin}</p>
          <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
            {item.translation}
          </p>
          {item.note && (
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              <span className="font-extrabold text-neutral-600 dark:text-neutral-300">
                Keterangan:{" "}
              </span>
              {item.note}
            </p>
          )}
          <p className="mt-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">
            {item.source}
          </p>
          {showCounter && (
            <>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => !done && setTasbih(item.id, count + 1)}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-2xl py-2.5 text-sm font-bold ${
                    done
                      ? "bg-black/5 text-[#0B3D39] dark:bg-white/5 dark:text-[#D4AF37]"
                      : "bg-[#0A0A0A] text-white active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                  }`}
                >
                  {done ? (
                    <>
                      <Icon name="check" className="h-4 w-4" /> Selesai
                    </>
                  ) : (
                    `Hitung (${count}/${item.count})`
                  )}
                </button>
                <button
                  onClick={() => setTasbih(item.id, 0)}
                  className="rounded-2xl bg-[#F5F5F4] px-3 py-2.5 text-sm font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
                >
                  Ulang
                </button>
              </div>
              <div className="mt-2">
                <ProgressBar value={count} max={item.count} />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function WiridListPage({
  items,
  title,
  subtitle,
  backHref,
  children,
}: {
  items: WiridItem[];
  title: string;
  subtitle: string;
  backHref: string;
  children?: ReactNode;
}) {
  const { progress, setTasbih } = useProgress();
  const doneCount = items.filter((i) => (progress.tasbihCounts[i.id] ?? 0) >= i.count).length;
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  const fs = useFullscreen();
  return (
    <div ref={fs.ref} className={fs.cssActive ? CSS_FULLSCREEN_CLASS : undefined}>
      <PageHeader title={title} subtitle={subtitle} backHref={backHref} />
      <ReaderToolbar
        size={size}
        onSizeChange={setSize}
        fullscreenActive={fs.active}
        onFullscreenToggle={fs.toggle}
      />
      <Card className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {doneCount} dari {items.length} bacaan selesai
          </p>
          <button
            onClick={() => items.forEach((i) => setTasbih(i.id, 0))}
            className="rounded-2xl bg-[#F5F5F4] px-3 py-2 text-xs font-bold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
          >
            Mulai dari awal
          </button>
        </div>
        <div className="mt-2">
          <ProgressBar value={doneCount} max={items.length} />
        </div>
      </Card>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <WiridCard key={item.id} item={item} index={i} arabicClass={arabicClass} bodyClass={bodyClass} />
        ))}
      </div>
      {children}
    </div>
  );
}

export function WiridPage() {
  const [showDoa, setShowDoa] = useState(false);
  const { arabicClass, bodyClass } = useReaderFontSize();
  return (
    <WiridListPage
      items={WIRID_SESUDAH_SHALAT}
      title="Dzikir Setelah Shalat Fardlu"
      subtitle="Wirid berurutan sesudah salat fardu · ketuk untuk menghitung"
      backHref="/ibadah/dzikir-wirid"
    >
      <div className="mt-4">
        <button
          onClick={() => setShowDoa(!showDoa)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] py-3.5 text-sm font-bold text-white transition active:scale-[0.98] dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          <Icon name="hands" className="h-4 w-4" />
          {showDoa ? "Tutup Doa" : "Doa Setelah Shalat"}
          <span>{showDoa ? "▾" : "▸"}</span>
        </button>
        {showDoa && (
          <div className="mt-3 flex flex-col gap-3">
            <Note>
              Doa dibaca setelah wirid selesai — mengikuti contoh doa sesudah salat fardhu.
            </Note>
            {DOA_SETELAH_SHALAT.map((d, i) => (
              <WiridCard key={d.id} item={d} index={i} showCounter={false} arabicClass={arabicClass} bodyClass={bodyClass} />
            ))}
          </div>
        )}
      </div>
    </WiridListPage>
  );
}

export function DzikirPagiPage() {
  return (
    <WiridListPage
      items={DZIKIR_PAGI}
      title="Dzikir Pagi"
      subtitle="Al-Ma'tsurat pagi · dibaca setelah Subuh hingga Zuhur"
      backHref="/ibadah/dzikir-wirid"
    />
  );
}

export function DzikirPetangPage() {
  return (
    <WiridListPage
      items={DZIKIR_PETANG}
      title="Dzikir Petang"
      subtitle="Al-Ma'tsurat petang · dibaca setelah Asar hingga Isya"
      backHref="/ibadah/dzikir-wirid"
    />
  );
}

// ---------- Tahlil & Doa ----------
export function TahlilPage() {
  const { progress, setTasbih } = useProgress();
  const count = progress.tasbihCounts["tahlil"] ?? 0;
  const target = 100;
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  return (
    <div>
      <PageHeader title="Tahlil & Doa" subtitle="Bacaan tahlil" backHref="/ibadah" />
      <ReaderToolbar size={size} onSizeChange={setSize} showFullscreen={false} />
      <Card>
        <p className={`arabic text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>{normalizeArabicText(TAHLIL_TEXT.arabic)}</p>
        <p className={`mt-2 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{TAHLIL_TEXT.latin}</p>
        <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>{TAHLIL_TEXT.translation}</p>
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

/** Normalisasi sudut ke [0, 360). */
function normDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Selisih sudut terpendek (target - current) dalam (-180, 180]. */
function shortestDelta(target: number, current: number): number {
  return ((target - current + 540) % 360) - 180;
}

/**
 * Heading (arah hadap pengguna, 0° = utara) dari event orientasi.
 *
 * - webkitCompassHeading (iOS): sudah berupa heading dalam derajat.
 * - alpha: arahnya BERLAWANAN dengan heading kompas (W3C: "alpha is in
 *   the opposite sense to a compass heading"), jadi heading tepi-atas
 *   HP = 360 - alpha. Ini hanya benar bila event.absolute === true
 *   (atau event deviceorientationabsolute). Sejak Chrome 50,
 *   `deviceorientation` biasa memberi alpha RELATIF terhadap arah HP
 *   saat halaman dibuka — bukan utara — sehingga kompas menunjuk arah
 *   sembarang yang berubah tiap kali tombol ditekan.
 * - Koreksi orientasi layar: yang dipakai adalah arah hadap pengguna,
 *   bukan arah tepi atas HP — kurangi sudut rotasi layar
 *   (0 portrait, 90/270 landscape). Tanpa ini, kompas meleset 90°
 *   bila HP dipegang landscape.
 */
function headingFromEvent(e: DeviceOrientationEvent): { heading: number; absolute: boolean } | null {
  const h = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  const soAngle = typeof screen !== "undefined" ? screen.orientation?.angle : undefined;
  const screenAngle =
    soAngle ?? (window as unknown as { orientation?: number }).orientation ?? 0;
  if (typeof h === "number") return { heading: normDeg(h - screenAngle), absolute: true };
  if (e.alpha === null) return null;
  return { heading: normDeg(360 - e.alpha - screenAngle), absolute: e.absolute === true };
}

export function KiblatPage() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [arrowDeg, setArrowDeg] = useState(90);
  const [status, setStatus] = useState("Ketuk tombol di bawah untuk mengaktifkan kompas.");
  const [supported, setSupported] = useState(true);
  const [source, setSource] = useState<"mutlak" | "relatif" | null>(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  // Status tombol: "Mengaktifkan…" (sibuk sementara) / "Kompas Aktif" /
  // "Coba Lagi" (setelah gagal atau sensor tak merespons).
  const [activating, setActivating] = useState(false);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [noSensor, setNoSensor] = useState(false);

  const activeRef = useRef(false);
  const bearingRef = useRef<number | null>(null);
  const smoothRef = useRef<number | null>(null);
  const arrowRef = useRef(90);
  const jitterRef = useRef(0);
  const stableRef = useRef(0);
  const lastShownRef = useRef<{ heading: number; arrow: number } | null>(null);
  const listenersRef = useRef<{ type: string; fn: EventListener }[]>([]);
  const noSensorRef = useRef(false);
  const headingSeenRef = useRef(false);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lepas semua listener + timer (dipakai saat ketuk ulang & saat unmount).
  const cleanupListeners = () => {
    for (const { type, fn } of listenersRef.current) {
      window.removeEventListener(type as "deviceorientation", fn);
    }
    listenersRef.current = [];
    if (watchdogRef.current !== null) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  const armWatchdog = () => {
    // Bila 5 detik setelah arah kiblat terhitung tidak ada satu pun event
    // heading yang bisa dipakai, beri tahu pengguna — jangan biarkan panah
    // diam tanpa penjelasan (laporan Adam: tombol seperti tidak berfungsi).
    if (watchdogRef.current !== null) clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      if (!headingSeenRef.current) {
        noSensorRef.current = true;
        setNoSensor(true);
        setStatus(
          "Sensor kompas tidak merespons — panah tidak bisa bergerak. Angka kiblat di atas tetap benar."
        );
      }
    }, 5000);
  };

  // Lepas semua listener saat halaman ditinggalkan (sebelumnya listener
  // deviceorientation tidak pernah dilepas).
  useEffect(() => {
    return () => {
      cleanupListeners();
      activeRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      setSupported(false);
      setStatus("Perangkat ini tidak mendukung sensor kompas.");
      return;
    }
    // Umpan balik LANGSUNG: ketukan selalu terlihat diterima — status
    // berubah saat itu juga, bukan setelah geolocation selesai (yang bisa
    // makan waktu sampai 10 detik). Inilah yang dilaporkan Adam: "ketuk
    // aktifkan kompas, tidak berubah".
    setFailed(false);
    setNoSensor(false);
    noSensorRef.current = false;
    headingSeenRef.current = false;
    smoothRef.current = null;
    lastShownRef.current = null;
    setHeading(null);
    setSource(null);
    setNeedsCalibration(false);
    setActivating(true);
    setStatus("Mengaktifkan kompas…");
    // Bersihkan listener lama supaya ketukan ulang tidak menggandakan
    // listener. Tombol tidak pernah mati permanen: ketuk ulang selalu
    // memulai aktivasi baru yang bersih (guard activeRef yang lama
    // dihapus — dialah yang membuat ketukan kedua mati total).
    cleanupListeners();
    activeRef.current = false;
    setActive(false);
    const start = () => {
      activeRef.current = true;
      setActive(true);
      if (!navigator.geolocation) {
        activeRef.current = false;
        setActive(false);
        setActivating(false);
        setFailed(true);
        setStatus("Geolocation tidak tersedia di perangkat ini.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const b = qiblaBearing(pos.coords.latitude, pos.coords.longitude);
          bearingRef.current = b;
          setBearing(b);
          setActivating(false);
          setStatus("Kompas aktif — putar HP sampai panah menunjuk ke atas.");
          armWatchdog();
        },
        () => {
          // Gagal / timeout / izin ditolak: kembalikan tombol ke keadaan
          // bisa diketuk lagi. Sebelumnya activeRef tetap true selamanya
          // sampai halaman ditutup — pengguna tidak bisa mencoba lagi.
          cleanupListeners();
          activeRef.current = false;
          setActive(false);
          setActivating(false);
          setFailed(true);
          setStatus("Izin lokasi ditolak — ketuk “Coba Lagi” untuk mencoba lagi.");
        },
        { timeout: 10000 }
      );
      const handler = (e: DeviceOrientationEvent) => {
        const res = headingFromEvent(e);
        if (!res) return;
        // Event heading pertama yang bisa dipakai: sensor merespons.
        if (!headingSeenRef.current) {
          headingSeenRef.current = true;
          if (watchdogRef.current !== null) {
            clearTimeout(watchdogRef.current);
            watchdogRef.current = null;
          }
          noSensorRef.current = false;
          setNoSensor(false);
        }
        setSource(res.absolute ? "mutlak" : "relatif");
        // Perhalus heading (EMA di lingkaran) supaya panah tidak gemetar.
        const prev = smoothRef.current;
        const next = prev === null ? res.heading : normDeg(prev + shortestDelta(res.heading, prev) * 0.3);
        const delta = prev === null ? 0 : Math.abs(shortestDelta(res.heading, prev));
        if (delta > 25) {
          jitterRef.current += 1;
          stableRef.current = 0;
          if (jitterRef.current >= 3) setNeedsCalibration(true);
        } else {
          jitterRef.current = 0;
          stableRef.current += 1;
          if (stableRef.current > 20) setNeedsCalibration(false);
        }
        smoothRef.current = next;
        const b = bearingRef.current;
        if (b !== null) {
          // Panah: jalur terpendek (tanpa putaran jauh) saat heading
          // melewati 359°→0°. Ikon arrow-left menunjuk ke kiri (270°)
          // saat rotate 0, jadi panah ke atas = rotate 90°.
          const targetArrow = normDeg(b - next + 90);
          arrowRef.current += shortestDelta(targetArrow, normDeg(arrowRef.current));
        }
        // Batasi render ulang: hanya bila berubah ≥ 0,5°.
        const last = lastShownRef.current;
        if (
          !last ||
          Math.abs(shortestDelta(next, last.heading)) >= 0.5 ||
          Math.abs(arrowRef.current - last.arrow) >= 0.5
        ) {
          lastShownRef.current = { heading: next, arrow: arrowRef.current };
          setHeading(next);
          setArrowDeg(arrowRef.current);
        }
      };
      const onCalib = () => setNeedsCalibration(true);
      // Utamakan event MUTLAK: di Chrome Android, `deviceorientation`
      // biasa memberi alpha relatif sejak Chrome 50 — kompas menunjuk
      // arah sembarang. `deviceorientationabsolute` menjamin alpha
      // berbasis magnetometer (utara). iOS memakai webkitCompassHeading.
      const absoluteSupported =
        typeof window !== "undefined" && "ondeviceorientationabsolute" in window;
      const type = absoluteSupported ? "deviceorientationabsolute" : "deviceorientation";
      const fn = handler as EventListener;
      const calibFn = onCalib as EventListener;
      window.addEventListener(type as "deviceorientation", fn);
      window.addEventListener("compassneedscalibration", calibFn);
      listenersRef.current.push({ type, fn }, { type: "compassneedscalibration", fn: calibFn });
    };
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === "function") {
      doe
        .requestPermission()
        .then((res) =>
          res === "granted"
            ? start()
            : (setActivating(false),
              setFailed(true),
              setStatus("Izin kompas ditolak — ketuk lagi untuk mencoba."))
        )
        .catch(() => {
          setActivating(false);
          setFailed(true);
          setStatus("Izin kompas tidak bisa diminta — ketuk lagi untuk mencoba.");
        });
    } else {
      start();
    }
  };

  return (
    <div>
      <PageHeader title="Arah Kiblat" subtitle="Kompas kiblat dari lokasimu" backHref="/ibadah" />
      <Card className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[#F5F5F4] ring-4 ring-[#0B3D39]/20 dark:bg-white/10 dark:ring-[#D4AF37]/25">
          <span className="absolute top-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">U</span>
          <span
            className="text-[#0B3D39] transition-transform duration-200 dark:text-[#D4AF37]"
            style={{ transform: `rotate(${arrowDeg}deg)` }}
            aria-hidden
          >
            <Icon name="arrow-left" className="h-14 w-14" />
          </span>
          <span className="absolute bottom-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">S</span>
        </div>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {bearing !== null ? `Arah kiblat: ${Math.round(bearing)}° dari utara` : "Arah kiblat belum dihitung"}
        </p>
        {heading !== null && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Arah hadapmu: {Math.round(heading)}°
            {source === "mutlak" ? " · kompas mutlak" : source === "relatif" ? " · kompas relatif" : ""}
          </p>
        )}
        <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{status}</p>
        {source === "relatif" && (
          <Note>
            Perangkat ini hanya memberi arah relatif — panah bergerak mengikuti putaran HP, tapi utara
            tidak akurat. Angka derajat kiblat di atas tetap benar; cocokkan dengan kompas lain.
          </Note>
        )}
        {needsCalibration && (
          <Note>
            Kompas perlu kalibrasi: gerakkan HP membentuk angka 8 beberapa kali sampai panah stabil.
          </Note>
        )}
        {noSensor && (
          <Note>
            Sensor kompas tidak merespons — panah tidak bisa bergerak. Coba tutup lalu buka lagi
            halaman ini, dan pastikan izin lokasi & gerakan (motion) diizinkan. Sementara itu angka
            kiblat di atas tetap benar:{" "}
            {bearing !== null
              ? `hadap ke ${Math.round(bearing)}° memakai kompas bawaan HP.`
              : "hadap ke sekitar 295° (barat laut, patokan Jawa) memakai kompas bawaan HP."}
          </Note>
        )}
        <button
          onClick={activate}
          disabled={activating || (active && !noSensor)}
          className="rounded-2xl bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          {activating
            ? "Mengaktifkan…"
            : active && !noSensor
              ? "Kompas Aktif"
              : noSensor || failed
                ? "Coba Lagi"
                : "Aktifkan Kompas"}
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
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
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
      <ReaderToolbar size={size} onSizeChange={setSize} showFullscreen={false} />
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
              <p className={`font-extrabold text-neutral-900 dark:text-neutral-100 ${bodyClass}`}>{a.latin}</p>
              <p className={`text-neutral-500 dark:text-neutral-400 ${bodyClass}`}>{a.meaning}</p>
            </div>
            <span className={`arabic text-[#0B3D39] dark:text-[#D4AF37] ${arabicClass}`}>{normalizeArabicText(a.arabic)}</span>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">Tidak ditemukan. Coba kata lain.</p>}
      </div>
    </div>
  );
}

// ---------- Yasin & Tahlil ----------

type YasinAyah = { numberInSurah: number; text: string };

function YasinReader({
  arabicClass,
  bodyClass,
}: {
  arabicClass: string;
  bodyClass: string;
}) {
  const { progress, setLastRead } = useProgress();
  const [ayahs, setAyahs] = useState<YasinAyah[]>([]);
  const [yasinPlain, setYasinPlain] = useState<string[] | null>(null);
  const [trans, setTrans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qari, setQari] = useState(QARIS[0]);
  const [audioError, setAudioError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  // Gulir otomatis langsung jalan saat buka Yasin — tidak perlu buka
  // pengaturan dulu (permintaan Adam 2026-11-23). Tombol pill di bawah
  // untuk berhenti; buka lagi langsung jalan lagi.
  const [autoScroll, setAutoScroll] = useState(true);
  useAutoScrollLoop({
    running: autoScroll,
    ready: !loading,
    onStop: () => setAutoScroll(false),
  });
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
        // Tanda maddah + saktah + sifir + waqaf MSI dikembalikan lewat
        // pemetaan tajwid dari teks Uthmani ke teks Simple — Yasin tidak
        // memakai warna tajwid, tapi tandanya harus tampil. Teks Uthmani
        // polos adalah sumber sifir; teks MSI (equran.id) adalah sumber
        // tanda waqaf MSI (termasuk akhir ayat). Gagal = teks Simple polos.
        fetchSurahTajweed(36)
          .then((lines) => {
            if (!alive) return;
            fetchSurahUthmani(36)
              .then((uthmani) => {
                if (!alive) return;
                fetchSurahMsi(36)
                  .then((msi) => {
                    if (!alive) return;
                    const mapped = mapTajweedSurah(lines, arabic, uthmani, msi, 36);
                    if (mapped) setYasinPlain(mapped.map((m) => m.plain));
                  })
                  .catch(() => {
                    if (!alive) return;
                    const mapped = mapTajweedSurah(lines, arabic, uthmani, undefined, 36);
                    if (mapped) setYasinPlain(mapped.map((m) => m.plain));
                  });
              })
              .catch(() => {
                if (!alive) return;
                const mapped = mapTajweedSurah(lines, arabic);
                if (mapped) setYasinPlain(mapped.map((m) => m.plain));
              });
          })
          .catch(() => {});
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

  const markAyah = (ayah: number) => {
    setLastRead({ surahNo: 36, surahName: "Yaseen", ayah, at: new Date().toISOString() });
  };

  const jumpToAyah = (ayah: number) => {
    markAyah(ayah);
    document
      .getElementById(`yasin-ayah-${ayah}`)
      // Langsung (auto), bukan smooth: gulir halus dibatalkan oleh loop
      // gulir otomatis yang menulis scrollTop tiap frame (2026-11-23).
      ?.scrollIntoView({ behavior: "auto", block: "center" });
  };

  // Buka Yasin langsung di ayat terakhir dibaca, begitu teksnya selesai
  // dimuat — tidak perlu mencari dengan menggulir (permintaan Adam 2026-11-23).
  const jumpedToLastReadRef = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (ayahs.length === 0) return;
    if (lastReadAyah == null || jumpedToLastReadRef.current) return;
    jumpedToLastReadRef.current = true;
    const t = window.setTimeout(() => jumpToAyah(lastReadAyah), 150);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, ayahs, lastReadAyah]);

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
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Ukuran teks &amp; layar penuh ada di toolbar di atas
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
            <p className={`arabic mb-5 text-center text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className={`mushaf text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              {ayahs.map((a) => (
                <span
                  key={a.numberInSurah}
                  id={`yasin-ayah-${a.numberInSurah}`}
                  onClick={() => markAyah(a.numberInSurah)}
                  className={`ayah ${lastReadAyah === a.numberInSurah ? "last-read" : ""}`}
                  title={`Ketuk untuk menandai Ayat ${a.numberInSurah} sebagai terakhir dibaca`}
                >
                  {yasinPlain && yasinPlain.length === ayahs.length
                    ? yasinPlain[a.numberInSurah - 1]
                    : a.text}{" "}
                  <span className="ayah-mark">{toArabicIndic(a.numberInSurah)}</span>{" "}
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
                    className={`mb-2 leading-relaxed text-neutral-600 dark:text-neutral-400 ${bodyClass}`}
                  >
                    <span className="font-extrabold text-[#C9A227]">{i + 1}.</span> {t}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Tanda waqaf + sifir (Mushaf Standar Indonesia / Kemenag) — bagian
          dari teks, tampil di Yasin seperti di reader. */}
      <Card className="mt-3">
        <p className="mb-2 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          Tanda waqaf
        </p>
        <div className="flex flex-wrap gap-2">
          {WAQAF_LEGEND.map((r) => (
            <span
              key={r.name}
              className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
            >
              <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                {r.mark}
              </span>
              {r.name} — {r.desc}
            </span>
          ))}
        </div>
        <p className="mb-2 mt-3 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          Tanda sifir
        </p>
        <div className="flex flex-wrap gap-2">
          {SIFIR_LEGEND.map((r) => (
            <span
              key={r.name}
              className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
            >
              <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                {r.mark}
              </span>
              {r.name} — {r.desc}
            </span>
          ))}
        </div>
        <p className="mb-2 mt-3 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
          Penanda juz &amp; sajdah
        </p>
        <div className="flex flex-wrap gap-2">
          {JUZ_SAJDAH_LEGEND.map((r) => (
            <span
              key={r.name}
              className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
            >
              <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                {r.mark}
              </span>
              {r.name} — {r.desc}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
          Tanda waqaf dan sifir mengikuti Mushaf Standar Indonesia (Kemenag RI) dan
          dipetakan dari teks Uthmani ke ejaan Simple yang ditampilkan. Tanda waqaf
          juga ada di akhir ayat — karena MSI memang menaruh tanda waqaf di akhir
          ayat, berbeda dengan Mushaf Madinah yang tidak. Penanda juz (۞, awal
          rub&apos;/perempat juz) dan sajdah (۩, akhir ayat sajdah) dikembalikan
          dari teks Uthmani.
        </p>
      </Card>

      {/* Tombol berhenti gulir otomatis (muncul saat gulir aktif) */}
      {autoScroll && (
        <button
          onClick={() => setAutoScroll(false)}
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#0A0A0A] px-4 py-2.5 text-sm font-bold text-white shadow-lg ring-1 ring-[#D4AF37]/60 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          Menggulir pelan — ketuk untuk berhenti
        </button>
      )}
    </div>
  );
}

function TahlilSteps({
  arabicClass,
  bodyClass,
}: {
  arabicClass: string;
  bodyClass: string;
}) {
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
                <p className={`arabic whitespace-pre-line text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
                  {normalizeArabicText(s.arabic)}
                </p>
                <p className={`mt-2 italic leading-relaxed text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>
                  {s.latin}
                </p>
                <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
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
        <p className={`arabic mt-2 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
          {normalizeArabicText(TAHLIL_TEXT.arabic)}
        </p>
        <p className={`mt-2 italic text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>{TAHLIL_TEXT.latin}</p>
        <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
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

function DoaTahlil({
  arabicClass,
  bodyClass,
}: {
  arabicClass: string;
  bodyClass: string;
}) {
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
            <p className={`arabic mt-3 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              {normalizeArabicText(d.arabic)}
            </p>
            <p className={`mt-2 italic leading-relaxed text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>
              {d.latin}
            </p>
            <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
              {d.translation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DoaSetelahSurat({
  arabicClass,
  bodyClass,
}: {
  arabicClass: string;
  bodyClass: string;
}) {
  return (
    <div>
      <div className="mb-3">
        <Note>
          Doa yang dibaca setelah selesai membaca surat Yasin, Al-Mulk, dan
          Al-Waqi&apos;ah. Sumber: Yasin — Kitab Abwabul Faraj (Habib Abdullah
          al-Haddad); Al-Mulk — Kitab Al-Minahus Saniyah &apos;ala
          Al-Washiyah Al-Matbuliyah; Al-Waqi&apos;ah — Kitab Khulashah
          Al-Madad An-Nabawi (Habib Umar bin Hafidz) dan Kitab Nubdzatul
          Anwar wa Fawaidul Akhyar hlm. 85.
        </Note>
      </div>
      <div className="flex flex-col gap-3">
        {DOA_SETELAH_SURAT.map((d) => (
          <Card key={d.title}>
            <h2 className="font-extrabold text-neutral-900 dark:text-neutral-100">{d.title}</h2>
            <p className={`arabic mt-3 text-right leading-loose text-neutral-900 dark:text-neutral-100 ${arabicClass}`}>
              {normalizeArabicText(d.arabic)}
            </p>
            <p className={`mt-2 italic leading-relaxed text-neutral-600 dark:text-neutral-400 ${bodyClass}`}>
              {d.latin}
            </p>
            <p className={`mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300 ${bodyClass}`}>
              {d.translation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function YasinTahlilPage() {
  const [tab, setTab] = useState<"yasin" | "tahlil" | "doa" | "doa-surat">("yasin");
  const { size, setSize, arabicClass, bodyClass } = useReaderFontSize();
  const fs = useFullscreen();
  const tabs = [
    { id: "yasin", label: "Surat Yasin" },
    { id: "tahlil", label: "Tahlil" },
    { id: "doa", label: "Doa Tahlil" },
    { id: "doa-surat", label: "Doa Sesudah Baca" },
  ] as const;
  return (
    <div>
      <PageHeader
        title="Yasin & Tahlil"
        subtitle="Surat Yasin, susunan tahlil, dan doa arwah"
        backHref="/ibadah"
      />
      <div ref={fs.ref} className={fs.cssActive ? CSS_FULLSCREEN_CLASS : undefined}>
        <ReaderToolbar
          size={size}
          onSizeChange={setSize}
          fullscreenActive={fs.active}
          onFullscreenToggle={fs.toggle}
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
        {tab === "yasin" && <YasinReader arabicClass={arabicClass} bodyClass={bodyClass} />}
        {tab === "tahlil" && <TahlilSteps arabicClass={arabicClass} bodyClass={bodyClass} />}
        {tab === "doa" && <DoaTahlil arabicClass={arabicClass} bodyClass={bodyClass} />}
        {tab === "doa-surat" && <DoaSetelahSurat arabicClass={arabicClass} bodyClass={bodyClass} />}
      </div>
    </div>
  );
}
