import Link from "next/link";
import { MenuGrid, MenuItem, PageHeader } from "@/components/ui";
import { IBADAH_MENU } from "@/lib/data";

export default function IbadahMenu() {
  return (
    <div>
      <PageHeader title="🕌 Ibadah" subtitle="Semua kebutuhan ibadah harianmu dalam satu tempat" backHref="/" />
      <MenuGrid>
        {IBADAH_MENU.map((m) => (
          <MenuItem key={m.slug} href={`/ibadah/${m.slug}`} icon={m.icon} label={m.label} bg={m.bg} />
        ))}
      </MenuGrid>
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-[#7FA294]">
        Ketuk salah satu menu untuk membuka fiturnya.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/quran" className="flex-1 rounded-2xl bg-abee-green py-3 text-center text-sm font-bold text-white">
          Menu Al-Qur&apos;an →
        </Link>
        <Link href="/belajar" className="flex-1 rounded-2xl bg-white py-3 text-center text-sm font-bold text-abee-green ring-1 ring-black/10 dark:bg-[#14382E] dark:text-teal-300 dark:ring-white/15">
          Belajar →
        </Link>
      </div>
    </div>
  );
}
