"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui";

export type BeritaItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return "";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Daftar berita dari /api/berita (RSS Republika + NU Online). */
export function BeritaList({ limit }: { limit: number }) {
  const [items, setItems] = useState<BeritaItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/berita")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => alive && setItems((j.items ?? []) as BeritaItem[]))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  if (error || (items !== null && items.length === 0)) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Berita tidak bisa dimuat.</p>;
  }
  if (items === null) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Memuat berita…</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.slice(0, limit).map((it) => (
        <a
          key={it.link}
          href={it.link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99] dark:bg-[#171717] dark:ring-white/10"
        >
          <p className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 dark:text-neutral-100">
            {it.title}
          </p>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {it.source}
            {timeAgo(it.publishedAt) ? ` · ${timeAgo(it.publishedAt)}` : ""}
          </p>
        </a>
      ))}
    </div>
  );
}

/** Slider berita otomatis (gambar + judul) ala situs news: jalan sendiri
 *  tiap ~5 detik, berhenti saat disentuh/diarahkan kursor, bisa di-swipe,
 *  ada indikator dot. Hanya item yang punya gambar yang masuk slider. */
export function BeritaSlider() {
  const [items, setItems] = useState<BeritaItem[] | null>(null);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/berita")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => alive && setItems((j.items ?? []) as BeritaItem[]))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const slides = useMemo(
    () => (items ?? []).filter((it) => it.imageUrl).slice(0, 8),
    [items]
  );
  const safeIndex = slides.length > 0 ? index % slides.length : 0;

  // Auto-advance tiap 5 detik; berhenti saat paused.
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  // Lanjutkan auto-play beberapa detik setelah interaksi.
  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 6000);
  };
  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  if (error || (items !== null && items.length === 0)) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Berita tidak bisa dimuat.</p>;
  }
  if (items === null) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Memuat berita…</p>;
  }
  // Tidak ada item bergambar: kembali ke daftar teks biasa.
  if (slides.length === 0) {
    return <BeritaList limit={5} />;
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchMove={(e) => {
        if (touchX.current === null) return;
        const dx = e.touches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) {
          go(dx < 0 ? 1 : -1);
          touchX.current = e.touches[0].clientX;
        }
      }}
      onTouchEnd={() => {
        touchX.current = null;
        scheduleResume();
      }}
    >
      <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((it) => (
            <a
              key={it.link}
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full shrink-0"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
                    {it.title}
                  </p>
                  <p className="mt-1 text-xs text-white/80">
                    {it.source}
                    {timeAgo(it.publishedAt) ? ` · ${timeAgo(it.publishedAt)}` : ""}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          {slides.map((it, i) => (
            <button
              key={it.link}
              type="button"
              aria-label={`Berita ${i + 1}`}
              onClick={() => {
                setIndex(i);
                setPaused(true);
                scheduleResume();
              }}
              className={`h-2 rounded-full transition-all ${
                i === safeIndex
                  ? "w-5 bg-[#0B3D39] dark:bg-[#D4AF37]"
                  : "w-2 bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Seksi Berita & Artikel di beranda (5 terbaru + tautan "Lihat semua"). */
export function BeritaSection() {
  return (
    <div>
      <div className="flex items-end justify-between">
        <SectionTitle title="Berita & Artikel" />
        <Link
          href="/berita"
          className="pb-2 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]"
        >
          Lihat semua
        </Link>
      </div>
      <BeritaSlider />
    </div>
  );
}
