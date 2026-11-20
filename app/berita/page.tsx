import { PageHeader } from "@/components/ui";
import { BeritaList } from "@/components/berita";

export default function BeritaPage() {
  return (
    <div>
      <PageHeader
        title="Berita & Artikel"
        subtitle="Berita Islam terbaru dari Republika, NU Online, dan Muslim.or.id"
        backHref="/"
      />
      <BeritaList limit={20} />
      <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Sumber: Republika &middot; NU Online &middot; Muslim.or.id &middot; Ketuk berita untuk membaca artikel aslinya.
      </p>
    </div>
  );
}
