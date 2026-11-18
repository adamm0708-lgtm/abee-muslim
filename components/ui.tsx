"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#14382E] dark:ring-white/10 ${className}`}>
      {children}
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
        <Link href={backHref} className="mb-2 inline-block text-sm font-semibold text-abee-green dark:text-teal-300">
          ← Kembali
        </Link>
      )}
      <h1 className="text-2xl font-extrabold text-abee-ink dark:text-[#F7F2E7]">{title}</h1>
      <span className="mt-2 block h-1 w-12 rounded-full bg-[#D4AF37]" aria-hidden />
      {subtitle && <p className="mt-2 text-sm text-slate-500 dark:text-[#A8C3B5]">{subtitle}</p>}
    </div>
  );
}

export function MenuItem({
  href,
  icon,
  label,
  bg,
}: {
  href: string;
  icon: string;
  label: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5 transition active:scale-95 dark:bg-[#14382E] dark:ring-white/10"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${bg}`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="text-xs font-bold leading-tight text-abee-ink dark:text-[#F7F2E7]">{label}</span>
    </Link>
  );
}

export function MenuGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-4 gap-3">{children}</div>;
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/15">
      <div className="h-full rounded-full bg-abee-teal transition-all" style={{ width: `${pct}%` }} />
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
      className={`rounded-full px-4 py-2 text-sm font-bold ${
        active ? "bg-abee-green text-white dark:bg-[#D4AF37] dark:text-[#0B2E26]" : "bg-white text-slate-600 ring-1 ring-black/10 dark:bg-[#14382E] dark:text-[#B9D2C6] dark:ring-white/10"
      }`}
    >
      {children}
    </button>
  );
}

const NAV = [
  { href: "/", label: "Beranda", icon: "⌂" },
  { href: "/peringkat", label: "Peringkat", icon: "🏆" },
  { href: "/lencana", label: "Lencana", icon: "🎖️" },
  { href: "/atur", label: "Atur", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0B2E26]/95">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${
                active ? "text-abee-green dark:text-teal-300" : "text-slate-400 dark:text-[#7FA294]"
              }`}
            >
              <span className="text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20">
      {children}
    </p>
  );
}
