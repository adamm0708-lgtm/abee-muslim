import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { PerpustakaanPage } from "@/components/perpustakaan";

export default function Perpustakaan() {
  return (
    <div>
      <PageHeader
        title="Perpustakaan"
        subtitle="Ruang Baca — kitab, novel & cerita Islami, dan buku pendidikan. Baca online di aplikasi atau download PDF-nya."
        backHref="/"
      />
      <Suspense
        fallback={<p className="text-sm text-neutral-500 dark:text-neutral-400">Memuat…</p>}
      >
        <PerpustakaanPage />
      </Suspense>
    </div>
  );
}
