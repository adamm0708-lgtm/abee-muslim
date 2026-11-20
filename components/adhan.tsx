"use client";
// Pengingat adzan — muncul saat aplikasi dibuka dalam 15 menit pertama
// setelah waktu shalat masuk, dengan suara adzan yang bisa diputar.
//
// Audio: stream langsung dari Wikimedia Commons (tanpa file biner di repo).
// Adzan: Aaqib Azeez, lisensi CC BY-SA 4.0 — diverifikasi (Whisper: lafaz
// adzan lengkap, durasi 86,5 dtk, MP3 44,1 kHz). Bila stream gagal, tombol
// tetap ada dan pengguna diberi tahu — tidak ada rekaman pengganti.
import { useEffect, useMemo, useRef, useState } from "react";
import { getTimings, type Timings } from "@/lib/api";
import { useProgress, todayKey } from "@/lib/store";
import { Icon } from "@/components/ui";

export const ADHAN_URL =
  "https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3";
export const ADHAN_CREDIT = "Adzan: Aaqib Azeez (CC BY-SA 4.0)";
export const ADHAN_FILE_URL =
  "https://commons.wikimedia.org/wiki/File:The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3";

/** 5 waktu shalat yang diingatkan (Imsak/Terbit/Dhuha bukan shalat wajib). */
export const ADHAN_PRAYERS = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const;

/** Jendela pengingat: 15 menit pertama setelah waktu shalat masuk. */
const WINDOW_MIN = 15;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function AdhanReminder() {
  const { progress, dismissAdhan } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [timings, setTimings] = useState<Timings | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [shown, setShown] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayTried = useRef<Record<string, boolean>>({});

  useEffect(() => setMounted(true), []);

  // Browser hanya mengizinkan suara setelah interaksi pengguna — catat
  // sentuhan/ketikan pertama agar autoplay boleh dicoba.
  useEffect(() => {
    const mark = () => setInteracted(true);
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setTimings(null));
    return () => {
      alive = false;
    };
  }, [progress.city]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Shalat yang sedang dalam jendela 15 menit (paling lama satu yang cocok).
  const active = useMemo(() => {
    if (!progress.adhanEnabled || !timings) return null;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const dismissed = progress.adhanDismissed[todayKey()] ?? [];
    for (const name of ADHAN_PRAYERS) {
      if (progress.adhanPrayers[name] === false) continue;
      if (dismissed.includes(name)) continue;
      const diff = nowMin - toMinutes(timings[name as keyof Timings]);
      if (diff >= 0 && diff < WINDOW_MIN) return name;
    }
    return null;
  }, [progress.adhanEnabled, progress.adhanPrayers, progress.adhanDismissed, timings, now]);

  useEffect(() => {
    if (active && shown !== active) setShown(active);
    if (!active && !playing) setShown(null);
  }, [active, playing, shown]);

  const getAudio = () => {
    if (!audioRef.current) {
      const a = new Audio(ADHAN_URL);
      a.preload = "none";
      a.onended = () => setPlaying(false);
      audioRef.current = a;
    }
    return audioRef.current;
  };

  const play = () => {
    setAudioError(false);
    const a = getAudio();
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setAudioError(true));
  };

  const stop = () => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
  };

  // Coba putar otomatis sekali per shalat, hanya bila pengguna sudah
  // berinteraksi dengan halaman (aturan autoplay browser). Gagal = diam,
  // tombol "Putar Adzan" tetap jadi jalan utama.
  useEffect(() => {
    if (!shown || !interacted || autoplayTried.current[shown]) return;
    autoplayTried.current[shown] = true;
    const a = getAudio();
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        /* autoplay ditolak browser — pengguna menekan tombol */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, interacted]);

  // Berhenti memutar saat komponen dilepas.
  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    []
  );

  const dismiss = () => {
    stop();
    if (shown) dismissAdhan(shown);
    setShown(null);
  };

  if (!mounted || !shown) return null;
  const time = timings ? (timings as Record<string, string>)[shown] : "";

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-md px-4 pt-3"
      role="alert"
      aria-live="polite"
    >
      <div className="rounded-2xl bg-[#0A0A0A] p-4 text-white shadow-lg ring-1 ring-[#D4AF37]/40">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15">
            <Icon name="mosque" className="h-5 w-5 text-[#D4AF37]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold">Waktu {shown} telah masuk</p>
            <p className="mt-0.5 text-xs text-white/70">
              {shown}
              {time ? ` · ${time} WIB` : ""} · {progress.city}
            </p>
            {audioError && (
              <p className="mt-1 text-xs font-bold text-red-300">
                Suara adzan tidak bisa dimuat — periksa koneksi internet.
              </p>
            )}
            <p className="mt-1 text-[11px] text-white/50">{ADHAN_CREDIT}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={playing ? stop : play}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-4 py-2.5 text-sm font-extrabold text-[#0A0A0A] transition active:scale-95"
          >
            <Icon name={playing ? "close" : "audio"} className="h-4 w-4" />
            {playing ? "Berhenti" : "Putar Adzan"}
          </button>
          <button
            onClick={dismiss}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
