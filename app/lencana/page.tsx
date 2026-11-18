"use client";
import { Card, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";

export default function LencanaPage() {
  const { progress } = useProgress();
  const hafalanCount = Object.values(progress.hafalanDone).filter(Boolean).length;
  const missionsTotal = Object.values(progress.missionsDone).reduce((a, b) => a + b, 0);
  const badges = [
    { icon: "🌱", title: "Pemula", desc: "Mulai perjalananmu", earned: true },
    { icon: "🔥", title: "Rajin 3 Hari", desc: "Buka aplikasi 3 hari berturut-turut", earned: progress.streak >= 3 },
    { icon: "🔥", title: "Rajin 7 Hari", desc: "Buka aplikasi 7 hari berturut-turut", earned: progress.streak >= 7 },
    { icon: "⭐", title: "100 Poin", desc: "Kumpulkan 100 poin", earned: progress.points >= 100 },
    { icon: "⭐", title: "500 Poin", desc: "Kumpulkan 500 poin", earned: progress.points >= 500 },
    { icon: "📖", title: "Penghafal", desc: "Tandai 5 surah sebagai hafal", earned: hafalanCount >= 5 },
    { icon: "🎯", title: "Pemburu Misi", desc: "Selesaikan 10 misi harian", earned: missionsTotal >= 10 },
    { icon: "🕌", title: "Anak Sholeh", desc: "Selesaikan semua amal harian dalam sehari", earned: false },
  ];
  const earned = badges.filter((b) => b.earned).length;
  return (
    <div>
      <PageHeader title="🎖️ Lencana" subtitle={`${earned}/${badges.length} lencana didapat`} backHref="/" />
      <div className="mb-3">
        <ProgressBar value={earned} max={badges.length} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <Card key={b.title} className={`text-center ${b.earned ? "" : "opacity-50"}`}>
            <p className="text-4xl">{b.icon}</p>
            <p className="mt-2 text-sm font-extrabold text-abee-ink dark:text-[#F7F2E7]">{b.title}</p>
            <p className="text-xs text-slate-500 dark:text-[#A8C3B5]">{b.desc}</p>
            <p className={`mt-2 text-xs font-bold ${b.earned ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-[#7FA294]"}`}>
              {b.earned ? "Didapat ✓" : "Belum didapat"}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-400 dark:text-[#7FA294]">
        Lencana &ldquo;Anak Sholeh&rdquo; menyusul — butuh pelacakan amal harian per hari, akan
        diaktifkan di versi berikutnya.
      </p>
    </div>
  );
}
