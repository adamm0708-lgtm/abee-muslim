import Link from "next/link";
import { MenuGrid, MenuItem, PageHeader } from "@/components/ui";
import { IBADAH_MENU } from "@/lib/data";

export default function IbadahMenu() {
  return (
    <div>
      <PageHeader title="Ibadah" subtitle="Semua kebutuhan ibadah harianmu dalam satu tempat" backHref="/" />
      <MenuGrid>
        {IBADAH_MENU.map((m) => (
          <MenuItem key={m.slug} href={`/ibadah/${m.slug}`} icon={m.icon} label={m.label} />
        ))}
      </MenuGrid>
      <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Ketuk salah satu menu untuk membuka fiturnya.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/quran" className="flex-1 rounded-2xl bg-[#0A0A0A] py-3 text-center text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          Menu Al-Qur&apos;an
        </Link>
        <Link href="/belajar" className="flex-1 rounded-2xl bg-white py-3 text-center text-sm font-bold text-[#0B3D39] ring-1 ring-black/10 dark:bg-[#171717] dark:text-[#D4AF37] dark:ring-white/15">
          Belajar
        </Link>
      </div>
    </div>
  );
}
