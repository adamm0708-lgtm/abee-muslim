import { PageHeader } from "@/components/ui";
import { BeritaList } from "@/components/berita";

export default function BeritaPage() {
  return (
    <div>
      <PageHeader
        title="Berita & Artikel"
        subtitle="Berita Islam terbaru dari Republika dan NU Online"
        backHref="/"
      />
      <BeritaList limit={20} />
      <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Sumber: Republika &middot; NU Online &middot; Ketuk berita untuk membaca artikel aslinya.
      </p>
    </div>
  );
}
