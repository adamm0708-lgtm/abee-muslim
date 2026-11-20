"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui";

export type BeritaItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
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
      <BeritaList limit={5} />
    </div>
  );
}
