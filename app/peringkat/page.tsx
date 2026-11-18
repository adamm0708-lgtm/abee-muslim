"use client";
import { Card, Icon, Note, PageHeader } from "@/components/ui";
import { useProgress } from "@/lib/store";

const SAMPLE = [
  { name: "Aisyah", points: 1240 },
  { name: "Budi", points: 980 },
  { name: "Citra", points: 860 },
  { name: "Dimas", points: 720 },
  { name: "Eka", points: 540 },
];

export default function PeringkatPage() {
  const { progress } = useProgress();
  const rows = [...SAMPLE.map((s) => ({ ...s, you: false })), { name: progress.name + " (kamu)", points: progress.points, you: true }]
    .sort((a, b) => b.points - a.points);
  return (
    <div>
      <PageHeader title="Peringkat" subtitle="Papan peringkat poin minggu ini" backHref="/" />
      <Card>
        <div className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
          {rows.map((r, i) => (
            <div key={r.name} className={`flex items-center justify-between py-3 ${r.you ? "font-extrabold text-[#0B3D39] dark:text-[#D4AF37]" : ""}`}>
              <span className="flex items-center gap-3">
                <span className={`w-6 text-center text-sm font-extrabold ${i < 3 ? "text-[#C9A227]" : "text-neutral-400 dark:text-neutral-500"}`}>#{i + 1}</span>
                <span className="text-sm">{r.name}</span>
              </span>
              <span className="flex items-center gap-1 text-sm font-extrabold">
                <Icon name="star" className="h-3.5 w-3.5 text-[#C9A227]" /> {r.points}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-3">
        <Note>
          Nama-nama di atas adalah data contoh (demo lokal) — peringkat bersama baru aktif setelah
          Supabase + login pengguna diaktifkan. Poinmu sendiri ({progress.points}) adalah data
          aslimu dari perangkat ini.
        </Note>
      </div>
    </div>
  );
}
