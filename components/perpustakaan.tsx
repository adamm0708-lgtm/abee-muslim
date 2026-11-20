"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BUKU_KATEGORI, BUKU_PILIHAN, PERPUSTAKAAN, type Buku } from "@/lib/data";
import { Chip, SectionTitle } from "@/components/ui";
import { FullscreenButton } from "@/components/reading";
import { CSS_FULLSCREEN_CLASS, useFullscreen } from "@/lib/reading";

/** Sampul CSS — gradasi zamrud/emas + judul + pengarang. Tidak hotlink gambar
 *  eksternal (rapuh), jadi sampul selalu tampil apa pun kondisi sumber. */
const COVER_GRADIENTS: Record<Buku["category"], string> = {
  Kitab: "bg-gradient-to-br from-[#0B3D39] via-[#0E4D42] to-[#7A5C14]",
  "Novel & Cerita": "bg-gradient-to-br from-[#14532D] via-[#166534] to-[#92400E]",
  Pendidikan: "bg-gradient-to-br from-[#1A2E1A] via-[#0B3D39] to-[#C9A227]",
};

export function BookCover({
  book,
  className = "",
}: {
  book: Buku;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl p-3 ring-1 ring-black/10 ${COVER_GRADIENTS[book.category]} ${className}`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4AF37]">
        {book.category}
      </p>
      <p className="mt-2 line-clamp-4 text-sm font-extrabold leading-snug text-white">
        {book.title}
      </p>
      <p className="mt-2 line-clamp-1 text-[11px] text-white/80">{book.author}</p>
    </div>
  );
}

/** Slider buku pilihan di beranda — pola BeritaSlider: kartu lebar, bisa
 *  di-swipe, auto-advance tiap ~5 detik, berhenti saat disentuh, dot. */
export function BukuSlider() {
  const slides = useMemo(
    () =>
      BUKU_PILIHAN.map((slug) => PERPUSTAKAAN.find((b) => b.slug === slug)).filter(
        (b): b is Buku => Boolean(b)
      ),
    []
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeIndex = slides.length > 0 ? index % slides.length : 0;

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

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

  if (slides.length === 0) return null;

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
          {slides.map((book) => (
            <Link
              key={book.slug}
              href={`/perpustakaan?buku=${book.slug}`}
              className="flex w-full shrink-0 gap-3 bg-white p-3.5 dark:bg-[#171717]"
            >
              <BookCover book={book} className="h-32 w-24 shrink-0" />
              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3D39] dark:text-[#D4AF37]">
                  {book.category} · {book.language}
                </p>
                <p className="mt-1 line-clamp-2 text-base font-extrabold leading-snug text-neutral-900 dark:text-neutral-100">
                  {book.title}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {book.author}
                </p>
                <p className="mt-2 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">
                  Ketuk untuk membaca →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          {slides.map((book, i) => (
            <button
              key={book.slug}
              type="button"
              aria-label={`Buku ${i + 1}`}
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

/** Seksi Perpustakaan di beranda (di bawah Berita & Artikel). */
export function PerpustakaanSection() {
  return (
    <div>
      <div className="flex items-end justify-between">
        <SectionTitle title="Perpustakaan" />
        <Link
          href="/perpustakaan"
          className="pb-2 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]"
        >
          Lihat semua
        </Link>
      </div>
      <BukuSlider />
    </div>
  );
}

/** Detail satu buku: pembaca di dalam aplikasi + tombol download. */
function DetailBuku({ book }: { book: Buku }) {
  const fs = useFullscreen();
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/perpustakaan"
        className="text-sm font-semibold text-[#0B3D39] dark:text-[#D4AF37]"
      >
        ← Semua buku
      </Link>
      <div className="flex gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
        <BookCover book={book} className="h-36 w-28 shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3D39] dark:text-[#D4AF37]">
            {book.category} · {book.language}
          </p>
          <p className="mt-1 text-base font-extrabold leading-snug text-neutral-900 dark:text-neutral-100">
            {book.title}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{book.author}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {book.desc}
          </p>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Sumber: {book.source}
          </p>
        </div>
      </div>

      {book.embedId ? (
        <div
          ref={fs.ref}
          className={
            fs.cssActive
              ? `${CSS_FULLSCREEN_CLASS} flex flex-col`
              : fs.active
                ? "flex flex-col"
                : undefined
          }
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Pembaca buku dari Archive.org — perbesar tulisan pakai tombol zoom
              (+/−) di dalam pembaca buku.
            </p>
            <FullscreenButton active={fs.active} onToggle={fs.toggle} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <iframe
            src={`https://archive.org/embed/${book.embedId}`}
            title={`Baca ${book.title}`}
            className={`w-full rounded-2xl ring-1 ring-black/5 dark:ring-white/10 ${
              fs.active ? "min-h-0 flex-1" : "h-[70vh]"
            }`}
            allowFullScreen
          />
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Bila pembaca tidak tampil, pakai tombol Download PDF di bawah.
          </p>
        </div>
      ) : (
        <p className="rounded-xl bg-[#F5F5F4] p-3 text-xs leading-relaxed text-neutral-600 ring-1 ring-black/5 dark:bg-white/5 dark:text-neutral-400 dark:ring-white/10">
          Buku ini dibaca di situs sumbernya — ketuk tombol di bawah untuk membukanya.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {book.readUrl && (
          <a
            href={book.readUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#0B3D39] px-4 py-3 text-center text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Baca di SantriOnline ↗
          </a>
        )}
        <a
          href={book.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[#0B3D39] ring-1 ring-black/10 dark:bg-[#171717] dark:text-[#D4AF37] dark:ring-white/10"
        >
          Download PDF ⬇
        </a>
      </div>
    </div>
  );
}

/** Halaman Perpustakaan lengkap: cari + filter kategori + daftar + detail. */
export function PerpustakaanPage() {
  const params = useSearchParams();
  const slug = params.get("buku");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");

  const selected = slug ? PERPUSTAKAAN.find((b) => b.slug === slug) : undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERPUSTAKAAN.filter((b) => {
      if (category !== "semua" && b.category !== category) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  if (selected) return <DetailBuku book={selected} />;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul atau pengarang…"
        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-neutral-900 ring-1 ring-black/10 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D39] dark:bg-[#171717] dark:text-neutral-100 dark:ring-white/10"
      />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {BUKU_KATEGORI.map((c) => (
          <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.label}
          </Chip>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Tidak ada buku yang cocok.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((book) => (
            <Link
              key={book.slug}
              href={`/perpustakaan?buku=${book.slug}`}
              className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99] dark:bg-[#171717] dark:ring-white/10"
            >
              <BookCover book={book} className="h-24 w-[72px] shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3D39] dark:text-[#D4AF37]">
                  {book.category} · {book.language}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-neutral-900 dark:text-neutral-100">
                  {book.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {book.author}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {book.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {PERPUSTAKAAN.length} buku · Sumber: Archive.org &amp; SantriOnline — buku
        ditautkan dari situs sumbernya, bukan disimpan di aplikasi.
      </p>
    </div>
  );
}
