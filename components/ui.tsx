"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { IconName } from "@/lib/data";
import { IBADAH_MENU, QURAN_MENU } from "@/lib/data";
import { CITIES, PRAYER_ORDER, formatCountdown, formatCountdownWords, getTimings, gregShortId, nextPrayer, pasaranJawa, type Timings } from "@/lib/api";
import { useProgress } from "@/lib/store";

// ---------- Ikon garis tipis (SVG, tanpa emoji) ----------

const PATHS: Partial<Record<IconName, ReactNode>> = {
  menu: (<><path d="M4 6h16M4 12h16M4 18h16" /></>),
  close: (<><path d="M6 6l12 12M18 6L6 18" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.8-3.8" /></>),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  "book-open": (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  hands: (
    <>
      <path d="M12 20.5c-4.2 0-8-2.6-8-6.8 0-1.6.9-2.7 2.1-3.1.5 1.6 1.6 2.7 3.1 3.1.8-1.1 1.9-1.6 2.8-1.6s2 .5 2.8 1.6c1.5-.4 2.6-1.5 3.1-3.1 1.2.4 2.1 1.5 2.1 3.1 0 4.2-3.8 6.8-8 6.8z" />
      <path d="M8.5 20.5v1.5M15.5 20.5v1.5" />
    </>
  ),
  mosque: (
    <>
      <path d="M12 2.5c2.8 1.8 4.5 3.6 4.5 6v2.5h-9V8.5c0-2.4 1.7-4.2 4.5-6z" />
      <path d="M3 11v10h18V11" />
      <path d="M6.5 11V5.5M17.5 11V5.5" />
      <path d="M10 21v-3.5a2 2 0 0 1 4 0V21" />
    </>
  ),
  moon: (<><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></>),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  half: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  droplet: (<><path d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.7 12 2.7z" /></>),
  leaf: (
    <>
      <path d="M5 19C5 9.5 12.5 4 20 4c0 8-5.5 15-13 15" />
      <path d="M5 19c3-5.5 7-9.5 11-11.5" />
    </>
  ),
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16.2 7.8l-2 6.3-6.3 2 2-6.3z" />
    </>
  ),
  check: (<><path d="M20 6L9 17l-5-5" /></>),
  star: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  ),
  headphones: (
    <>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  play: (<><path d="M6 4l14 8-14 8z" /></>),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  bookmark: (<><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></>),
  audio: (
    <>
      <path d="M11 5L6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  cap: (
    <>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v6a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a1 1 0 0 0-1 1c0 2.2 1.6 3.5 4 3.5M17 6h3a1 1 0 0 1 1 1c0 2.2-1.6 3.5-4 3.5" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="M8.5 10L6 3h5l1 4 1-4h5l-2.5 7" />
    </>
  ),
  "chevron-right": (<><path d="M9 18l6-6-6-6" /></>),
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </>
  ),
  quote: (<><path d="M10 8c-3 1-5 3.5-5 7v1h5v-6H7.5C8 9 9 8.5 10 8.2zM20 8c-3 1-5 3.5-5 7v1h5v-6h-2.5c.5-1 1.5-1.5 2.5-1.8z" /></>),
};

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  if (name === "alif") {
    return (
      <span className={`arabic flex items-center justify-center text-2xl leading-none ${className}`} aria-hidden>
        ب
      </span>
    );
  }
  if (name === "beads") {
    const dots = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      return { x: 12 + 7.5 * Math.cos(a), y: 10.5 + 7.5 * Math.sin(a) };
    });
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.4} fill="currentColor" stroke="none" />
        ))}
        <path d="M12 18.5v3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name]}
    </svg>
  );
}

// ---------- Lencana bintang 8 (nomor surah) ----------

export function StarBadge({ no, className = "" }: { no: number; className?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 11 : 4.8;
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <span className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full text-[#0A0A0A] dark:text-[#D4AF37]" aria-hidden>
        <polygon points={pts.join(" ")} fill="currentColor" />
      </svg>
      <span className="relative text-[13px] font-extrabold leading-none text-white dark:text-[#0A0A0A]">{no}</span>
    </span>
  );
}

// ---------- Kartu & elemen dasar ----------

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-2 w-2 rotate-45 bg-[#C9A227]" aria-hidden />
      <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-4">
      {backHref && (
        <Link href={backHref} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0B3D39] dark:text-[#D4AF37]">
          <Icon name="arrow-left" className="h-4 w-4" /> Kembali
        </Link>
      )}
      <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
      <span className="mt-2 block h-0.5 w-10 rounded-full bg-[#C9A227]" aria-hidden />
      {subtitle && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
    </div>
  );
}

export function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: IconName;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5 transition active:scale-95 dark:bg-[#171717] dark:ring-white/10"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F5F4] dark:bg-white/5" aria-hidden>
        <Icon name={icon} className="h-7 w-7 text-[#0B3D39] dark:text-[#D4AF37]" />
      </span>
      <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-neutral-800 dark:text-neutral-100">
        {label}
      </span>
    </Link>
  );
}

export function MenuGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-4 gap-3">{children}</div>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
      <div className="h-full rounded-full bg-[#C9A227] transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
        active
          ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-[#F5F5F4] p-3 text-xs leading-relaxed text-neutral-600 ring-1 ring-black/5 dark:bg-white/5 dark:text-neutral-400 dark:ring-white/10">
      {children}
    </p>
  );
}

// ---------- Kartu foto Fitur Utama ----------

export function PhotoCard({
  href,
  label,
  photo,
}: {
  href: string;
  label: string;
  photo: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Link
      href={href}
      className="relative h-32 w-40 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/10 dark:ring-white/10"
    >
      {failed ? (
        <div className="geo-pattern absolute inset-0" aria-hidden />
      ) : (
        <img
          src={photo}
          alt={label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />
      <span className="absolute bottom-2.5 left-3 right-2 text-[11px] font-extrabold uppercase leading-tight tracking-wider text-[#D4AF37]">
        {label}
      </span>
    </Link>
  );
}

// ---------- Kartu kutipan (Mutiara) ----------

export function QuoteCard({ text, source }: { text: string; source: string }) {
  return (
    <Card>
      <div className="flex gap-3">
        <span className="font-wordmark text-5xl leading-[0.6] text-[#C9A227]" aria-hidden>
          &ldquo;
        </span>
        <div className="flex-1">
          {/* suppressHydrationWarning: kutipan diputar per hari kalender —
              server (UTC) dan klien (WIB) bisa berada di tanggal berbeda. */}
          <p
            className="text-sm italic leading-relaxed text-neutral-700 dark:text-neutral-300"
            suppressHydrationWarning
          >
            {text}
          </p>
          <p
            className="mt-2 text-right text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            suppressHydrationWarning
          >
            — {source}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ---------- Header hitam + drawer ----------

const DRAWER_SECTIONS: { title: string; items: { href: string; icon: IconName; label: string }[] }[] = [
  {
    title: "Al-Qur'an",
    items: QURAN_MENU.map((m) => ({ href: `/quran/${m.slug}`, icon: m.icon, label: m.label })),
  },
  {
    title: "Ibadah",
    items: IBADAH_MENU.map((m) => ({ href: `/ibadah/${m.slug}`, icon: m.icon, label: m.label })),
  },
  {
    title: "Belajar & Progres",
    items: [
      { href: "/belajar", icon: "cap" as IconName, label: "Belajar" },
      { href: "/peringkat", icon: "trophy" as IconName, label: "Peringkat" },
      { href: "/lencana", icon: "medal" as IconName, label: "Lencana" },
      { href: "/atur", icon: "settings" as IconName, label: "Pengaturan" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0A0A] text-white shadow-md">
        <div className="mx-auto flex h-14 w-full max-w-md items-center gap-2 px-3">
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10"
            aria-label="Buka menu"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <Link href="/" className="flex min-w-0 flex-1 items-center">
            <span className="leading-none">
              <span className="font-wordmark block whitespace-nowrap text-[17px] font-bold">
                <span className="text-[#D4AF37]">ABEE</span> Muslim
              </span>
              <span className="mt-1 block whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.18em] text-white/50">
                Belajar Islam &amp; Ibadah
              </span>
            </span>
          </Link>
          <Link href="/quran/baca" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10" aria-label="Cari surah">
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <Link href="/ibadah/kiblat" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10" aria-label="Arah kiblat">
            <Icon name="compass" className="h-5 w-5" />
          </Link>
          <Link href="/atur" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10" aria-label="Pengaturan">
            <Icon name="settings" className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Drawer menu samping */}
      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-200 dark:bg-[#111111] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Menu aplikasi"
        >
          <div className="flex items-center justify-between bg-[#0A0A0A] px-4 py-4 text-white">
            <span className="font-wordmark text-lg font-bold">
              <span className="text-[#D4AF37]">ABEE</span> Muslim
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
              aria-label="Tutup menu"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {DRAWER_SECTIONS.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="px-2 pb-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        active
                          ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                          : "text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon name={item.icon} className="h-5 w-5 shrink-0 opacity-80" />
                      {item.label}
                      <Icon name="chevron-right" className="ml-auto h-4 w-4 opacity-40" />
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <p className="border-t border-black/5 px-4 py-3 text-center text-[11px] text-neutral-400 dark:border-white/10 dark:text-neutral-500">
            ABEE Muslim v0.1 · ABEE MotionVerse
          </p>
        </aside>
      </div>
    </>
  );
}

// ---------- Bottom nav (5 item) ----------

const NAV = [
  { href: "/", label: "Beranda", icon: "home" as IconName, match: (p: string) => p === "/" },
  { href: "/quran/baca", label: "Al-Qur'an", icon: "book-open" as IconName, match: (p: string) => p.startsWith("/quran") },
  { href: "/ibadah/doa", label: "Doa", icon: "hands" as IconName, match: (p: string) => p === "/ibadah/doa" },
  { href: "/ibadah/tasbih", label: "Tasbih", icon: "beads" as IconName, match: (p: string) => p === "/ibadah/tasbih" },
  { href: "/ibadah/kalender", label: "Kalender", icon: "calendar" as IconName, match: (p: string) => p === "/ibadah/kalender" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#111111]/95">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${
                active ? "text-[#0B3D39] dark:text-[#D4AF37]" : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ---------- Jam analog (SVG, jarum hidup mengikuti jam perangkat) ----------

function AnalogClock({ now }: { now: Date }) {
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  // r2: bulatkan ke 2 desimal — sin/cos & pembagian float bisa berbeda 1 ulp
  // antara mesin JS server (Node) dan klien (Chrome) sehingga props x1/y1/
  // transform tidak sama saat hydration; pembulatan membuat SSR = klien.
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const secDeg = r2(s * 6);
  const minDeg = r2((m + s / 60) * 6);
  const hourDeg = r2((h + m / 60) * 30);
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      width="112"
      height="112"
      viewBox="0 0 120 120"
      className="shrink-0"
      role="img"
      aria-label="Jam sekarang"
      suppressHydrationWarning
    >
      <circle cx="60" cy="60" r="58" fill="#0B3D39" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#D4AF37" strokeOpacity="0.25" strokeWidth="1" />
      {ticks.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = r2(60 + Math.sin(rad) * 45);
        const y1 = r2(60 - Math.cos(rad) * 45);
        const x2 = r2(60 + Math.sin(rad) * 50);
        const y2 = r2(60 - Math.cos(rad) * 50);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D4AF37"
            strokeWidth={deg % 90 === 0 ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="60"
        y1="60"
        x2="60"
        y2="32"
        stroke="#F7F2E7"
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${hourDeg} 60 60)`}
      />
      <line
        x1="60"
        y1="60"
        x2="60"
        y2="22"
        stroke="#F7F2E7"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${minDeg} 60 60)`}
      />
      <line
        x1="60"
        y1="67"
        x2="60"
        y2="20"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform={`rotate(${secDeg} 60 60)`}
      />
      <circle cx="60" cy="60" r="3.5" fill="#D4AF37" />
    </svg>
  );
}

// ---------- Kartu shalat kecil (strip ringkas di beranda) ----------

/** Shalat berikutnya + jam + hitung mundur kata-kata, satu baris ringkas.
 * Menautkan ke /ibadah/jadwal. Kartu lengkap tetap ada di PrayerCard di bawah. */
export function PrayerMini() {
  const { progress } = useProgress();
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    setError(false);
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [progress.city]);

  const next = useMemo(() => (timings ? nextPrayer(timings, now) : null), [timings, now]);

  return (
    <Link href="/ibadah/jadwal" aria-label="Lihat jadwal shalat lengkap">
      <div
        className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-[#0A0A0A] px-4 py-3 text-white shadow-sm transition active:scale-[0.99]"
        suppressHydrationWarning
      >
        {timings && next ? (
          <>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">
                {next.name} · <span className="text-[#D4AF37]">{timings[next.name]}</span>
              </p>
              <p className="truncate text-xs text-white/70">
                {formatCountdownWords(next.at.getTime() - now.getTime())}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#D4AF37]">
              Jadwal lengkap <Icon name="chevron-right" className="h-4 w-4" />
            </span>
          </>
        ) : error ? (
          <p className="text-sm font-bold">Jadwal shalat tidak bisa dimuat</p>
        ) : (
          <p className="text-sm font-bold">Memuat jadwal shalat…</p>
        )}
      </div>
    </Link>
  );
}

// ---------- Kartu shalat berikutnya (kartu gelap besar) ----------

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function PrayerCard() {
  const { progress, setCity } = useProgress();
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [showCities, setShowCities] = useState(false);
  // Jam analog hanya dirender setelah mount: jarumnya mengikuti jam perangkat
  // (server render dalam UTC, klien dalam zona lokal — mustahil sama saat SSR).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    setError(false);
    getTimings(progress.city)
      .then((t) => alive && setTimings(t))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [progress.city]);

  const next = useMemo(() => (timings ? nextPrayer(timings, now) : null), [timings, now]);
  const countdown = next ? formatCountdown(next.at.getTime() - now.getTime()) : "--:--:--";

  // Fraksi interval shalat sebelumnya → berikutnya (untuk bilah progres).
  const intervalPct = useMemo(() => {
    if (!timings || !next) return 0;
    const order = PRAYER_ORDER;
    const idx = order.indexOf(next.name);
    const nextMin = toMinutes(timings[next.name]);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let prevMin: number;
    if (idx === 0) {
      // Sebelum Subuh: interval dari Isya kemarin.
      prevMin = toMinutes(timings["Isya"]) - 1440;
    } else {
      prevMin = toMinutes(timings[order[idx - 1]]);
    }
    const span = nextMin - prevMin;
    if (span <= 0) return 0;
    return Math.min(100, Math.max(0, ((nowMin - prevMin) / span) * 100));
  }, [timings, next, now]);

  const weekday = now.toLocaleDateString("id-ID", { weekday: "long" });

  return (
    // suppressHydrationWarning: isi kartu bergantung jam perangkat (server
    // render dalam UTC, klien dalam zona lokal) — nilainya benar setelah hydrate.
    <div className="flex flex-col gap-3" suppressHydrationWarning>
      {/* Kartu hero gelap: kotak tanggal + jam analog + shalat berikut */}
      <div className="rounded-2xl bg-[#0A0A0A] p-5 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-lg font-extrabold leading-tight"
              suppressHydrationWarning
            >
              {gregShortId(now)}
            </p>
            <p
              className="mt-0.5 text-sm font-bold text-white/80"
              suppressHydrationWarning
            >
              {weekday} {pasaranJawa(now)}
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#D4AF37]">
              {timings
                ? timings.dateHijri || "Tanggal Hijriah tidak bisa dimuat"
                : error
                  ? "Tanggal Hijriah tidak bisa dimuat"
                  : "Memuat tanggal Hijriah…"}
            </p>
          </div>
          {mounted ? (
            <AnalogClock now={now} />
          ) : (
            <div className="h-[112px] w-[112px] shrink-0" aria-hidden />
          )}
        </div>

        {timings && next ? (
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/60">
              Selanjutnya: {next.label}
            </p>
            <p
              className="mt-1 text-4xl font-extrabold"
              suppressHydrationWarning
            >
              {timings[next.name]}
            </p>
            <p className="mt-1 text-xs text-white/50">Waktu Indonesia Barat (WIB)</p>
          </div>
        ) : error ? (
          <p className="mt-4 text-sm text-white/80">
            Jadwal shalat tidak bisa dimuat (periksa koneksi internet). Coba lagi nanti.
          </p>
        ) : (
          <p className="mt-4 text-sm text-white/80">Memuat jadwal shalat…</p>
        )}
      </div>

      {/* Kartu putih: hitung mundur menuju waktu shalat */}
      <div className="rounded-2xl bg-white p-5 text-neutral-900 shadow-sm ring-1 ring-black/5 dark:bg-[#171717] dark:text-neutral-100 dark:ring-white/10">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Menuju waktu
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <Icon name="pin" className="h-3.5 w-3.5" />
            {progress.city}
          </span>
        </div>

        {timings && next ? (
          <>
            <p className="mt-2 text-2xl font-extrabold">
              {next.label}{" "}
              <span className="text-neutral-400 dark:text-neutral-500">{timings[next.name]}</span>
            </p>
            {/* Hitung mundur dengan kata-kata — bukan angka HH:MM:SS yang mirip jam. */}
            <p
              className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B3D39] dark:text-[#D4AF37]"
              suppressHydrationWarning
            >
              {formatCountdownWords(next.at.getTime() - now.getTime())}
            </p>
            <p
              className="mt-1 font-mono text-sm font-bold text-neutral-400 dark:text-neutral-500"
              suppressHydrationWarning
            >
              {countdown}
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
              <div
                className="h-full rounded-full bg-[#D4AF37]"
                style={{ width: `${intervalPct}%` }}
                suppressHydrationWarning
              />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {PRAYER_ORDER.map((name) => (
                <div
                  key={name}
                  className={`rounded-xl px-0.5 py-2 text-center ${
                    next.name === name
                      ? "bg-[#D4AF37] text-[#0A0A0A]"
                      : "bg-[#F5F5F4] dark:bg-white/5"
                  }`}
                >
                  <p className="text-[9px] font-semibold opacity-80">{name}</p>
                  <p className="text-[11px] font-extrabold">{timings[name]}</p>
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Jadwal shalat tidak bisa dimuat (periksa koneksi internet). Coba lagi nanti.
          </p>
        ) : (
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Memuat jadwal shalat…</p>
        )}

        <button
          onClick={() => setShowCities((v) => !v)}
          className="mt-4 rounded-full bg-[#0A0A0A] px-4 py-2 text-xs font-extrabold text-white transition active:scale-95 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          Ubah Kota
        </button>
        {showCities && (
          <div className="mt-3 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCity(c.name);
                  setShowCities(false);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  c.name === progress.city
                    ? "bg-[#D4AF37] text-[#0A0A0A]"
                    : "bg-black/5 text-neutral-600 hover:bg-black/10 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Angka Arab-Indik (٠١٢٣٤٥٦٧٨٩): dipakai untuk nomor ayat akhir ayat.
 * Font UthmanicHafs menggambar angka Arab-Indik SEBAGAI ornamen penanda
 * akhir ayat — angka DI DALAM lingkaran (terverifikasi untuk 1–286).
 * JANGAN tambahkan karakter ۝ di depannya: ۝ digambar sebagai lingkaran
 * kosong terpisah, jadi akan muncul DUA lingkaran. Angka Latin juga jangan:
 * angkanya akan jatuh di luar lingkaran. */
export function toArabicIndic(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
