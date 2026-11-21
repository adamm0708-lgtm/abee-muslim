"use client";
// Pengingat Amalan — IKLAN full-screen saat aplikasi pertama dibuka.
//
// Bentuknya seperti iklan (modal full-screen, muncul ~1 dtk setelah aplikasi
// dibuka, seperti InstallPromptModal): banner visual CSS + tulisan ajakan
// besar + tombol aksi + dalil kecil di bawahnya + tombol tutup. Hanya SATU
// iklan per sekali buka aplikasi — yang prioritas tertinggi yang berlaku.
//
// Prioritas isi (tertinggi dulu):
//   1. Waktu shalat (0–30 mnt setelah masuk waktu): "Sudahkah Anda shalat …?"
//   2. Jumat (Maghrib Kamis–Maghrib Jumat): Al-Kahfi
//   3. Malam Jumat (Kamis setelah Maghrib): Yasin
//   4. Setiap malam (setelah Isya): Al-Mulk (+ As-Sajdah)
//   5. Harian: ngaji (bila belum selesai hari itu)
//   6. Harian: Istighfar 100x (rotasi setelah ngaji selesai); Ahad: Ar-Rahman
//
// Shell modal dibuat GENERIK (PromoModal) supaya nanti bisa dipakai untuk
// konten lain — mis. iklan affiliate — tanpa menulis ulang. Saat ini TIDAK
// ada konten affiliate apa pun.
//
// Koordinasi dengan AdhanReminder: selama modal promo terbuka, banner adzan
// disembunyikan (via PromoSlotProvider); menutup iklan shalat juga menutup
// pengingat adzan hari itu supaya tidak muncul dua pengingat shalat.
// Jam dari client clock (bukan jam server); dismiss/selesai per pengingat
// per hari disimpan di localStorage via store; toggle di Pengaturan.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, Icon, PageHeader } from "@/components/ui";
import { getTimings, type Timings } from "@/lib/api";
import { useProgress, todayKey } from "@/lib/store";
import {
  ADHAN_PRAYERS,
  useAdhanAudio,
} from "@/components/adhan";
import { usePromoSlot } from "@/components/promo-slot";
import { PENGINGAT, type DalilStatus, type PengingatDef } from "@/lib/pengingat";
import type { IconName } from "@/lib/data";

const STATUS_BADGE: Record<DalilStatus, string> = {
  Shahih:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Hasan: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Dhaif: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Tradisi: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
};

/** Aksen banner (gradasi zamrud/emas, beda per pengingat). */
const ACCENT: Record<string, string> = {
  shalat: "from-[#0B3D39] via-[#0E4F45] to-[#06231F]",
  kahfi: "from-[#8A6D1B] via-[#C9A227] to-[#6B5410]",
  yasin: "from-[#0B3D39] via-[#14655A] to-[#082A26]",
  mulk: "from-[#123B2E] via-[#0B3D39] to-[#04100E]",
  ngaji: "from-[#0E4F45] via-[#0B3D39] to-[#06231F]",
  istighfar: "from-[#6B5410] via-[#C9A227] to-[#4A3A0C]",
  arrahman: "from-[#0B3D39] via-[#C9A227] to-[#0B3D39]",
};

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Apakah pengingat ini sedang dalam jendelanya (jam klien)? */
export function isPengingatDue(
  p: PengingatDef,
  now: Date,
  timings: Timings | null
): boolean {
  const day = now.getDay(); // 0=Ahad … 4=Kamis, 5=Jumat
  const mins = now.getHours() * 60 + now.getMinutes();
  const maghrib = timings ? toMinutes(timings.Maghrib) : 18 * 60;
  const isya = timings ? toMinutes(timings.Isya) : 19 * 60;
  switch (p.schedule) {
    case "jumat":
      // Maghrib Kamis s.d. Maghrib Jumat.
      return (day === 4 && mins >= maghrib) || (day === 5 && mins < maghrib);
    case "malam-jumat":
      // Kamis setelah Maghrib s.d. menjelang Subuh Jumat.
      return (day === 4 && mins >= maghrib) || (day === 5 && mins < 5 * 60);
    case "malam":
      // Setiap malam setelah Isya.
      return mins >= isya;
    case "harian":
      return true;
    case "mingguan":
      // Surat Pilihan: setiap Ahad.
      return day === 0;
  }
}

/**
 * Kunci siklus untuk dismiss/selesai. Pengingat Jumat & malam Jumat
 * memakai tanggal Jumatnya, supaya ditutup Kamis malam tetap tertutup
 * sampai Jumat Maghrib. Yang lain memakai tanggal hari ini.
 */
export function cycleKeyFor(p: PengingatDef, now: Date): string {
  if (p.schedule === "jumat" || p.schedule === "malam-jumat") {
    const fri = new Date(now);
    if (now.getDay() === 4) fri.setDate(fri.getDate() + 1);
    return todayKey(fri);
  }
  return todayKey(now);
}

// ---------- Shell modal generik (dipakai ulang untuk konten lain) ----------

/**
 * Modal generik. Menutupnya HARUS mudah — laporan Adam 2026-11-21:
 * popup menutupi layar dan menu di belakangnya tidak bisa diketuk
 * selama popup terbuka. Karena itu modal ini bisa ditutup dengan TIGA
 * cara: (1) ketuk area gelap di luar kartu, (2) tombol "Tutup" yang
 * jelas di bawah kartu, (3) tombol X di pojok + tombol Esc. Menutup =
 * dismiss pengingat itu untuk siklus hari ini (perilaku lama tombol X).
 */
export function PromoModal({
  accent,
  kicker,
  title,
  icon,
  onClose,
  children,
}: {
  accent: string;
  kicker: string;
  title: string;
  icon: IconName;
  onClose: () => void;
  children: ReactNode;
}) {
  // Esc menutup modal (desktop).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#171717]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative bg-gradient-to-br px-5 pb-5 pt-6 text-white ${accent}`}
        >
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white transition active:scale-95"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            <Icon name={icon} className="h-7 w-7 text-white" />
          </span>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            {kicker}
          </p>
          <p className="mt-1 text-xl font-extrabold leading-snug">{title}</p>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {children}
        </div>
        <div className="border-t border-black/5 px-5 py-3 dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-neutral-100 px-4 py-2.5 text-sm font-extrabold text-neutral-700 transition active:scale-95 dark:bg-white/10 dark:text-neutral-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DalilList({ def }: { def: PengingatDef }) {
  return (
    <div className="flex flex-col gap-2 border-t border-black/5 pt-3 dark:border-white/10">
      {def.dalil.map((d, i) => (
        <div key={i} className="rounded-2xl bg-[#F5F5F4] p-3 dark:bg-white/5">
          <p className="text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            &ldquo;{d.text}&rdquo;
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
            <span>{d.source}</span>
            {d.status && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${STATUS_BADGE[d.status]}`}
              >
                {d.status}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------- Modal iklan Pengingat Amalan (global, sekali per buka) ----------

type PromoContent =
  | { kind: "shalat"; prayer: string }
  | { kind: "pengingat"; def: PengingatDef };

export function PengingatPromo() {
  const { progress, dismissAdhan, dismissPengingat, markPengingatDone } =
    useProgress();
  const { promoOpen, setPromoOpen } = usePromoSlot();
  const [mounted, setMounted] = useState(false);
  const [timings, setTimings] = useState<Timings | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [delayDone, setDelayDone] = useState(false);
  const [content, setContent] = useState<PromoContent | null>(null);
  const decidedRef = useRef(false);
  const mountAtRef = useRef(Date.now());
  const adhanAudio = useAdhanAudio();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let alive = true;
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setTimings(null));
    return () => {
      alive = false;
    };
  }, [progress.city]);

  // Muncul ~1 dtk setelah aplikasi dibuka.
  useEffect(() => {
    const id = setTimeout(() => setDelayDone(true), 1000);
    return () => clearTimeout(id);
  }, []);

  // Cek ulang tiap detik sampai keputusan diambil (menunggu jadwal shalat).
  useEffect(() => {
    const id = setInterval(() => {
      if (decidedRef.current) {
        clearInterval(id);
        return;
      }
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const candidate = useMemo<PromoContent | null>(() => {
    if (!progress.pengingatEnabled && !progress.adhanEnabled) return null;
    const t = todayKey(now);
    // 1. Waktu shalat (0–30 mnt setelah masuk waktu).
    if (progress.adhanEnabled && timings) {
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const dismissed = progress.adhanDismissed[t] ?? [];
      for (const name of ADHAN_PRAYERS) {
        if (progress.adhanPrayers[name] === false) continue;
        if (dismissed.includes(name)) continue;
        const diff = nowMin - toMinutes(timings[name as keyof Timings]);
        if (diff >= 0 && diff < 30) return { kind: "shalat", prayer: name };
      }
    }
    if (!progress.pengingatEnabled) return null;
    // 2–6. Pengingat amalan menurut prioritas.
    for (const p of PENGINGAT) {
      if (progress.pengingatToggles[p.id] === false) continue;
      const key = cycleKeyFor(p, now);
      if ((progress.pengingatDismissed[key] ?? []).includes(p.id)) continue;
      if ((progress.pengingatDone[key] ?? []).includes(p.id)) continue;
      if (isPengingatDue(p, now, timings)) return { kind: "pengingat", def: p };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    progress.pengingatEnabled,
    progress.adhanEnabled,
    progress.adhanPrayers,
    progress.adhanDismissed,
    progress.pengingatToggles,
    progress.pengingatDismissed,
    progress.pengingatDone,
    timings,
    now,
  ]);

  // Ambil keputusan sekali per sesi: setelah delay, dan setelah jadwal
  // shalat termuat (atau 4 dtk berlalu — pakai fallback Maghrib/Isya).
  useEffect(() => {
    if (!mounted || !delayDone || decidedRef.current) return;
    if (!timings && Date.now() - mountAtRef.current < 4000) return;
    decidedRef.current = true;
    if (candidate) {
      setContent(candidate);
      setPromoOpen(candidate.kind === "shalat" ? "shalat" : candidate.def.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, delayDone, timings, candidate]);

  // Berhenti memutar adzan bila modal ditutup selagi berbunyi.
  useEffect(() => {
    if (!content) adhanAudio.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!mounted || !content) return null;

  const close = () => {
    if (content.kind === "shalat") {
      dismissAdhan(content.prayer);
    } else {
      dismissPengingat(content.def.id, cycleKeyFor(content.def, now));
    }
    setContent(null);
    setPromoOpen(null);
  };

  if (content.kind === "shalat") {
    const prayer = content.prayer;
    const time = timings ? (timings as Record<string, string>)[prayer] : "";
    return (
      <PromoModal
        accent={ACCENT.shalat}
        kicker="Pengingat Shalat"
        title={`Sudahkah Anda shalat ${prayer}?`}
        icon="mosque"
        onClose={close}
      >
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Waktu {prayer} telah masuk
          {time ? ` · ${time} WIB` : ""} · {progress.city}. Yuk tunaikan shalat
          tepat waktu.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              dismissAdhan(prayer);
              setContent(null);
              setPromoOpen(null);
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-sm font-extrabold text-white transition active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            <Icon name="check" className="h-4 w-4" />
            Sudah, Alhamdulillah
          </button>
          <button
            onClick={adhanAudio.playing ? adhanAudio.stop : adhanAudio.play}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#0B3D39]/10 px-4 py-2.5 text-sm font-bold text-[#0B3D39] transition active:scale-95 dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]"
          >
            <Icon name="audio" className="h-4 w-4" />
            {adhanAudio.playing ? "Berhenti" : "Putar Adzan"}
          </button>
        </div>
        {adhanAudio.audioError && (
          <p className="text-xs font-bold text-red-600 dark:text-red-400">
            Suara adzan tidak bisa dimuat — periksa koneksi internet.
          </p>
        )}
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          Adzan: Aaqib Azeez (CC BY-SA 4.0)
        </p>
      </PromoModal>
    );
  }

  const def = content.def;
  const lastRead = progress.lastRead;
  const href =
    def.id === "ngaji" && lastRead
      ? `/quran/baca?surah=${lastRead.surahNo}`
      : def.href;
  const actionLabel =
    def.id === "ngaji" && lastRead
      ? `Lanjutkan ${lastRead.surahName} · Ayat ${lastRead.ayah}`
      : def.actionLabel;

  return (
    <PromoModal
      accent={ACCENT[def.id] ?? ACCENT.ngaji}
      kicker={`Pengingat Amalan · ${def.scheduleLabel}`}
      title={def.title}
      icon={def.icon}
      onClose={close}
    >
      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {def.subtitle}
        {def.id === "mulk" ? " · Jangan lupa As-Sajdah sebagai pasangannya." : ""}
      </p>
      <Link
        href={href}
        onClick={() => {
          markPengingatDone(def.id, cycleKeyFor(def, now));
          setContent(null);
          setPromoOpen(null);
        }}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-sm font-extrabold text-white transition active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
      >
        <Icon name="book-open" className="h-4 w-4" />
        {actionLabel}
      </Link>
      <DalilList def={def} />
      <Link
        href="/pengingat"
        onClick={() => {
          setContent(null);
          setPromoOpen(null);
        }}
        className="flex items-center justify-end gap-1 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]"
      >
        Lihat semua pengingat <Icon name="chevron-right" className="h-4 w-4" />
      </Link>
    </PromoModal>
  );
}

// ---------- Kartu daftar lengkap (halaman /pengingat) ----------

function PengingatCard({
  def,
  cycleKey,
}: {
  def: PengingatDef;
  cycleKey: string;
}) {
  const { progress, dismissPengingat, markPengingatDone } = useProgress();
  const [open, setOpen] = useState(false);
  const lastRead = progress.lastRead;

  const href =
    def.id === "ngaji" && lastRead
      ? `/quran/baca?surah=${lastRead.surahNo}`
      : def.href;
  const actionLabel =
    def.id === "ngaji" && lastRead
      ? `Lanjutkan ${lastRead.surahName} · Ayat ${lastRead.ayah}`
      : def.actionLabel;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B3D39]/10 dark:bg-[#D4AF37]/15">
          <Icon name={def.icon} className="h-5 w-5 text-[#0B3D39] dark:text-[#D4AF37]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-snug text-neutral-900 dark:text-neutral-100">
            {def.title}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {def.subtitle} · {def.scheduleLabel}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href={href}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-sm font-extrabold text-white transition active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          <Icon name="book-open" className="h-4 w-4" />
          {actionLabel}
        </Link>
        <button
          onClick={() => markPengingatDone(def.id, cycleKey)}
          className="flex items-center justify-center gap-1 rounded-2xl bg-[#0B3D39]/10 px-3 py-2.5 text-sm font-bold text-[#0B3D39] transition active:scale-95 dark:bg-[#D4AF37]/15 dark:text-[#D4AF37]"
        >
          <Icon name="check" className="h-4 w-4" />
          {def.doneLabel}
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-bold text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          {open ? "Sembunyikan dalil ▾" : "Lihat dalil ▸"}
        </button>
        <button
          onClick={() => dismissPengingat(def.id, cycleKey)}
          className="text-xs font-bold text-neutral-400 underline-offset-2 hover:underline dark:text-neutral-500"
        >
          Tutup hari ini
        </button>
      </div>
      {open && <DalilList def={def} />}
    </Card>
  );
}

/** Halaman daftar lengkap: semua pengingat + dalilnya, tanpa filter waktu. */
export function PengingatListPage() {
  const now = new Date();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Pengingat Amalan"
        subtitle="Amalan harian, mingguan, dan Jumat — lengkap dengan dalilnya"
        backHref="/"
      />
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Pengingat muncul sebagai iklan saat aplikasi pertama dibuka — hanya
        satu per buka, sesuai hari dan jam. Atur mana yang aktif di Pengaturan.
      </p>
      {PENGINGAT.map((p) => (
        <PengingatCard key={p.id} def={p} cycleKey={cycleKeyFor(p, now)} />
      ))}
    </div>
  );
}
