"use client";
import { useState } from "react";
import { Card, Icon, Note, PageHeader } from "@/components/ui";
import { useProgress, levelFromPoints, type ThemeChoice } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { CITIES, QURAN_SOURCE_NOTE } from "@/lib/api";
import { InstallButton } from "@/components/pwa";
import { supabaseConfigured } from "@/lib/supabase";
import type { IconName } from "@/lib/data";

const THEME_OPTIONS: { value: ThemeChoice; label: string; desc: string; icon: IconName }[] = [
  { value: "auto", label: "Otomatis", desc: "Terang siang, gelap malam (dari Terbit & Maghrib)", icon: "half" },
  { value: "light", label: "Terang", desc: "Selalu tema terang", icon: "sun" },
  { value: "dark", label: "Gelap", desc: "Selalu tema gelap", icon: "moon" },
];

export default function AturPage() {
  const { progress, setName, setCity, resetProgress } = useProgress();
  const { choice, setChoice, effective } = useTheme();
  const [name, setNameInput] = useState(progress.name);
  const [saved, setSaved] = useState(false);
  const { level, title } = levelFromPoints(progress.points);

  const saveName = () => {
    const v = name.trim();
    if (v) {
      setName(v);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Profil, kota, dan data aplikasi" backHref="/" />
      <Note>Panduan ibadah dalam aplikasi ini mengikuti mazhab Syafi&apos;i.</Note>
      <Note>{QURAN_SOURCE_NOTE}.</Note>
      <div className="flex flex-col gap-4">
        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Nama tampilan</p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Namamu"
              className="flex-1 rounded-2xl bg-[#F5F5F4] px-4 py-3 text-sm font-bold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
            />
            <button onClick={saveName} className="rounded-2xl bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
              Simpan
            </button>
          </div>
          {saved && (
            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">
              <Icon name="check" className="h-3.5 w-3.5" /> Nama tersimpan
            </p>
          )}
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <span>Level {level} · {title}</span>
            <span className="flex items-center gap-1">
              <Icon name="star" className="h-3.5 w-3.5 text-[#C9A227]" /> {progress.points} poin
            </span>
            <span className="flex items-center gap-1">
              <Icon name="flame" className="h-3.5 w-3.5 text-[#C9A227]" /> streak {progress.streak} hari
            </span>
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Kota (untuk jadwal shalat & cuaca)</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCity(c.name)}
                className={`rounded-full px-3 py-2 text-xs font-bold ${progress.city === c.name ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Tema tampilan</p>
          <div className="flex flex-col gap-2">
            {THEME_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setChoice(o.value)}
                className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left ring-1 ${
                  choice === o.value
                    ? "bg-[#0A0A0A] text-white ring-[#0A0A0A] dark:bg-[#D4AF37] dark:text-[#0A0A0A] dark:ring-[#D4AF37]"
                    : "bg-[#F5F5F4] text-neutral-900 ring-black/10 dark:bg-white/5 dark:text-neutral-100 dark:ring-white/15"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon name={o.icon} className="h-5 w-5 shrink-0 opacity-80" />
                  <span>
                    <span className="block text-sm font-bold">{o.label}</span>
                    <span className={`block text-xs ${choice === o.value ? "text-white/80 dark:text-[#0A0A0A]/70" : "text-neutral-500 dark:text-neutral-400"}`}>{o.desc}</span>
                  </span>
                </span>
                {choice === o.value && <Icon name="check" className="h-5 w-5 shrink-0" />}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {choice === "auto"
              ? `Mode otomatis aktif — tema sekarang ${effective === "dark" ? "gelap (Maghrib–Terbit)" : "terang (Terbit–Maghrib)"}. Kalau jadwal shalat belum termuat, dipakai jam lokal (terang 05:00–18:00).`
              : "Pilihanmu tersimpan dan mengalahkan mode otomatis."}
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Install aplikasi</p>
          <InstallButton />
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Penyimpanan</p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {supabaseConfigured()
              ? "Supabase terhubung — progres disinkronkan ke cloud."
              : "Mode lokal: progres tersimpan di perangkat ini (localStorage). Aktifkan Supabase di env var NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk sinkronisasi cloud."}
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Tentang aplikasi</p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            ABEE Muslim v0.1 — aplikasi belajar Islam & ibadah untuk semua orang, oleh ABEE
            MotionVerse. Jadwal shalat resmi Kemenag (Bimas Islam) lewat MyQuran, Hijriah
            Kemenag (MABIMS), teks Al-Qur&apos;an Mushaf Uthmani + terjemahan Kemenag 2019
            lewat Quran.com, cuaca dari Open-Meteo.
          </p>
        </Card>

        <button
          onClick={() => {
            if (window.confirm("Hapus semua progres (poin, streak, hafalan, kelompok)? Tindakan ini tidak bisa dibatalkan.")) {
              resetProgress();
            }
          }}
          className="rounded-2xl bg-red-50 py-3 text-sm font-bold text-red-600 ring-1 ring-red-200 dark:bg-red-400/10 dark:text-red-400"
        >
          Hapus Semua Progres
        </button>

        <Note>
          Menghapus progres hanya menghapus data di perangkat ini (dan baris Supabase perangkat
          ini). Nama dan kota tetap tersimpan.
        </Note>
      </div>
    </div>
  );
}
