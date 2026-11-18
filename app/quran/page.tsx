import Link from "next/link";
import { MenuGrid, MenuItem, PageHeader } from "@/components/ui";
import { QURAN_MENU } from "@/lib/data";

export default function QuranMenu() {
  return (
    <div>
      <PageHeader title="📖 Al-Qur'an" subtitle="Baca, hafalkan, dan dengarkan Al-Qur'an" backHref="/" />
      <MenuGrid>
        {QURAN_MENU.map((m) => (
          <MenuItem key={m.slug} href={`/quran/${m.slug}`} icon={m.icon} label={m.label} bg={m.bg} />
        ))}
      </MenuGrid>
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-[#7FA294]">
        Teks Arab dan terjemahan diambil dari sumber yang dikenal; untuk surah di luar Juz 30,
        aplikasi mengambil dari AlQuran Cloud API.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/ibadah" className="flex-1 rounded-2xl bg-abee-green py-3 text-center text-sm font-bold text-white">
          Menu Ibadah →
        </Link>
        <Link href="/belajar" className="flex-1 rounded-2xl bg-white py-3 text-center text-sm font-bold text-abee-green ring-1 ring-black/10 dark:bg-[#14382E] dark:text-teal-300 dark:ring-white/15">
          Belajar →
        </Link>
      </div>
    </div>
  );
}
