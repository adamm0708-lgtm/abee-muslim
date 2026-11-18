"use client";
import { Card, Icon, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";
import type { IconName } from "@/lib/data";

export default function LencanaPage() {
  const { progress } = useProgress();
  const hafalanCount = Object.values(progress.hafalanDone).filter(Boolean).length;
  const missionsTotal = Object.values(progress.missionsDone).reduce((a, b) => a + b, 0);
  const badges: { icon: IconName; title: string; desc: string; earned: boolean }[] = [
    { icon: "leaf", title: "Pemula", desc: "Mulai perjalananmu", earned: true },
    { icon: "flame", title: "Rajin 3 Hari", desc: "Buka aplikasi 3 hari berturut-turut", earned: progress.streak >= 3 },
    { icon: "flame", title: "Rajin 7 Hari", desc: "Buka aplikasi 7 hari berturut-turut", earned: progress.streak >= 7 },
    { icon: "star", title: "100 Poin", desc: "Kumpulkan 100 poin", earned: progress.points >= 100 },
    { icon: "star", title: "500 Poin", desc: "Kumpulkan 500 poin", earned: progress.points >= 500 },
    { icon: "book", title: "Penghafal", desc: "Tandai 5 surah sebagai hafal", earned: hafalanCount >= 5 },
    { icon: "target", title: "Pemburu Misi", desc: "Selesaikan 10 misi harian", earned: missionsTotal >= 10 },
    { icon: "mosque", title: "Anak Sholeh", desc: "Selesaikan semua amal harian dalam sehari", earned: false },
  ];
  const earned = badges.filter((b) => b.earned).length;
  return (
    <div>
      <PageHeader title="Lencana" subtitle={`${earned}/${badges.length} lencana didapat`} backHref="/" />
      <div className="mb-3">
        <ProgressBar value={earned} max={badges.length} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <Card key={b.title} className={`text-center ${b.earned ? "" : "opacity-50"}`}>
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                b.earned
                  ? "bg-[#0A0A0A] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                  : "bg-black/5 text-neutral-400 dark:bg-white/5"
              }`}
            >
              <Icon name={b.icon} className="h-7 w-7" />
            </span>
            <p className="mt-2 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">{b.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{b.desc}</p>
            <p className={`mt-2 flex items-center justify-center gap-1 text-xs font-bold ${b.earned ? "text-[#0B3D39] dark:text-[#D4AF37]" : "text-neutral-400 dark:text-neutral-500"}`}>
              {b.earned ? (
                <>
                  <Icon name="check" className="h-3.5 w-3.5" /> Didapat
                </>
              ) : (
                "Belum didapat"
              )}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Lencana &ldquo;Anak Sholeh&rdquo; menyusul — butuh pelacakan amal harian per hari, akan
        diaktifkan di versi berikutnya.
      </p>
    </div>
  );
}
