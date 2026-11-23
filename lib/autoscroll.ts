import { useEffect, useRef } from "react";

/**
 * Gulir otomatis pelan di mode baca (Qur'an & Yasin).
 *
 * Dipakai bersama: kecepatan 8 px/detik (kira-kira 1 baris tiap 7 detik di
 * ukuran teks sedang). Langsung jalan saat halaman baca dibuka — tidak perlu
 * buka pengaturan dulu. Berhenti sendiri di ujung halaman, dan berhenti
 * begitu pengguna menggulir sendiri (roda mouse / sentuhan).
 *
 * Pelajaran dari bug 2026-11-23: scrollBy dengan pecahan piksel (0,13 px
 * per frame) ternyata tidak menggerakkan halaman — pecahan dikumpulkan dulu
 * lalu digulir per piksel bulat, dan scrollTop ditulis langsung ke
 * documentElement (dengan fallback ke body).
 */
export const AUTO_SCROLL_SPEED_PX_PER_SEC = 8;

export function useAutoScrollLoop(opts: {
  /** Apakah gulir otomatis sedang menyala (state di komponen pemilik). */
  running: boolean;
  /** Konten sudah selesai dimuat (bukan loading) — kalau belum, tunggu. */
  ready: boolean;
  /** Dipanggil saat gulir berhenti sendiri (ujung halaman / halaman pendek).
   *  Hanya mematikan state jalan saat itu — bukan preferensi. */
  onStop: () => void;
}) {
  const { running, ready, onStop } = opts;
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  useEffect(() => {
    if (!running) return;
    const el = document.documentElement;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const noRoom = el.scrollHeight <= window.innerHeight + 4;
      if (noRoom) {
        // Konten belum dimuat: tunggu saja (teks masih datang).
        if (!ready) {
          raf = requestAnimationFrame(tick);
          return;
        }
        // Sudah dimuat tapi halaman memang pendek: berhenti.
        onStopRef.current();
        return;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= el.scrollHeight - 4;
      if (atBottom) {
        onStopRef.current();
        return;
      }
      acc += AUTO_SCROLL_SPEED_PX_PER_SEC * dt;
      const step = Math.floor(acc);
      if (step >= 1) {
        acc -= step;
        const before = el.scrollTop;
        el.scrollTop += step;
        if (el.scrollTop === before) document.body.scrollTop += step;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const stop = () => onStopRef.current();
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [running, ready]);
}
