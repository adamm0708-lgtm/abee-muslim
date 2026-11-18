import Link from "next/link";
import { MenuGrid, MenuItem, PageHeader } from "@/components/ui";
import { QURAN_MENU } from "@/lib/data";

export default function QuranMenu() {
  return (
    <div>
      <PageHeader title="Al-Qur'an" subtitle="Baca, hafalkan, dan dengarkan Al-Qur'an" backHref="/" />
      <MenuGrid>
        {QURAN_MENU.map((m) => (
          <MenuItem key={m.slug} href={`/quran/${m.slug}`} icon={m.icon} label={m.label} />
        ))}
      </MenuGrid>
      <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Teks Arab dan terjemahan diambil dari sumber yang dikenal; untuk surah di luar Juz 30,
        aplikasi mengambil dari AlQuran Cloud API.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/ibadah" className="flex-1 rounded-2xl bg-[#0A0A0A] py-3 text-center text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          Menu Ibadah
        </Link>
        <Link href="/belajar" className="flex-1 rounded-2xl bg-white py-3 text-center text-sm font-bold text-[#0B3D39] ring-1 ring-black/10 dark:bg-[#171717] dark:text-[#D4AF37] dark:ring-white/15">
          Belajar
        </Link>
      </div>
    </div>
  );
}
