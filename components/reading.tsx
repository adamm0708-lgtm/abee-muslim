"use client";
import { Icon } from "@/components/ui";
import {
  READER_FONT_SIZES,
  READER_FONT_SIZE_LABELS,
  type ReaderFontSize,
} from "@/lib/reading";

/** Tombol layar penuh — satu tombol untuk masuk/keluar. */
export function FullscreenButton({
  active,
  onToggle,
  className = "",
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? "Keluar dari layar penuh" : "Layar penuh"}
      className={`flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0A0A0A] px-3.5 py-2.5 text-xs font-extrabold text-white active:scale-[0.98] dark:bg-[#D4AF37] dark:text-[#0A0A0A] ${className}`}
    >
      <Icon name={active ? "minimize" : "maximize"} className="h-4 w-4" />
      {active ? "Keluar" : "Layar Penuh"}
    </button>
  );
}

/** Toolbar baca bersama: ukuran teks A- A A+ A++ + tombol Layar Penuh.
 *  Dipakai di semua permukaan baca (Qur'an, Yasin & Tahlil, Doa, Wirid,
 *  Shalat & Wudhu, Asmaul Husna). Di halaman daftar pendek, pakai dengan
 *  showFullscreen={false}. */
export function ReaderToolbar({
  size,
  onSizeChange,
  fullscreenActive = false,
  onFullscreenToggle,
  showFullscreen = true,
}: {
  size: ReaderFontSize;
  onSizeChange: (s: ReaderFontSize) => void;
  fullscreenActive?: boolean;
  onFullscreenToggle?: () => void;
  showFullscreen?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
      <span className="flex min-w-0 flex-wrap items-center gap-1">
        <span className="mr-1 shrink-0 text-sm font-bold">Ukuran teks</span>
        {READER_FONT_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSizeChange(s)}
            aria-label={`Ukuran teks ${READER_FONT_SIZE_LABELS[s]}`}
            className={`min-h-9 min-w-9 rounded-lg px-2.5 py-1 text-xs font-extrabold ${
              size === s
                ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {READER_FONT_SIZE_LABELS[s]}
          </button>
        ))}
      </span>
      {showFullscreen && onFullscreenToggle && (
        <FullscreenButton active={fullscreenActive} onToggle={onFullscreenToggle} />
      )}
    </div>
  );
}
