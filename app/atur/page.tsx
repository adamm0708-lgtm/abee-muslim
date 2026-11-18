"use client";
import { useState } from "react";
import { Card, Note, PageHeader } from "@/components/ui";
import { useProgress, levelFromPoints, type ThemeChoice } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { CITIES } from "@/lib/api";
import { supabaseConfigured } from "@/lib/supabase";

const THEME_OPTIONS: { value: ThemeChoice; label: string; desc: string }[] = [
  { value: "auto", label: "🌓 Otomatis", desc: "Terang siang, gelap malam (dari Terbit & Maghrib)" },
  { value: "light", label: "☀️ Terang", desc: "Selalu tema terang" },
  { value: "dark", label: "🌙 Gelap", desc: "Selalu tema gelap" },
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
      <PageHeader title="⚙️ Atur" subtitle="Profil, kota, dan data aplikasi" backHref="/" />
      <div className="flex flex-col gap-4">
        <Card>
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Nama tampilan</p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Namamu"
              className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-bold ring-1 ring-black/10 dark:ring-white/15 outline-none"
            />
            <button onClick={saveName} className="rounded-2xl bg-abee-green dark:bg-[#D4AF37] px-4 py-3 text-sm font-bold text-white dark:text-[#0B2E26]">
              Simpan
            </button>
          </div>
          {saved && <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">Nama tersimpan ✓</p>}
          <p className="mt-3 text-sm text-slate-600 dark:text-[#B9D2C6]">
            Level {level} · {title} · ⭐ {progress.points} poin · 🔥 streak {progress.streak} hari
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Kota (untuk jadwal shalat & cuaca)</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCity(c.name)}
                className={`rounded-full px-3 py-2 text-xs font-bold ${progress.city === c.name ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#B9D2C6]"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Tema tampilan</p>
          <div className="flex flex-col gap-2">
            {THEME_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setChoice(o.value)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left ring-1 ${
                  choice === o.value
                    ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26] ring-abee-green dark:ring-[#D4AF37]"
                    : "bg-slate-50 dark:bg-white/5 text-abee-ink dark:text-[#F7F2E7] ring-black/10 dark:ring-white/15"
                }`}
              >
                <span>
                  <span className="block text-sm font-bold">{o.label}</span>
                  <span className={`block text-xs ${choice === o.value ? "text-white/80 dark:text-[#0B2E26]/70" : "text-slate-500 dark:text-[#A8C3B5]"}`}>{o.desc}</span>
                </span>
                {choice === o.value && <span className="text-lg">✓</span>}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-[#A8C3B5]">
            {choice === "auto"
              ? `Mode otomatis aktif — tema sekarang ${effective === "dark" ? "gelap 🌙 (Maghrib–Terbit)" : "terang ☀️ (Terbit–Maghrib)"}. Kalau jadwal shalat belum termuat, dipakai jam lokal (terang 05:00–18:00).`
              : "Pilihanmu tersimpan dan mengalahkan mode otomatis."}
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Penyimpanan</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#B9D2C6]">
            {supabaseConfigured()
              ? "Supabase terhubung — progres disinkronkan ke cloud."
              : "Mode lokal: progres tersimpan di perangkat ini (localStorage). Aktifkan Supabase di env var NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk sinkronisasi cloud."}
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Tentang aplikasi</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#B9D2C6]">
            ABEE Muslim v0.1 — aplikasi belajar Islam & ibadah untuk semua orang, oleh ABEE
            MotionVerse. Jadwal shalat dari Aladhan API, cuaca dari Open-Meteo, teks Al-Qur&apos;an
            dari AlQuran Cloud API.
          </p>
        </Card>

        <button
          onClick={() => {
            if (window.confirm("Hapus semua progres (poin, streak, hafalan, kelompok)? Tindakan ini tidak bisa dibatalkan.")) {
              resetProgress();
            }
          }}
          className="rounded-2xl bg-red-50 dark:bg-red-400/10 py-3 text-sm font-bold text-red-600 dark:text-red-400 ring-1 ring-red-200"
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
