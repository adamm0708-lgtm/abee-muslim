import { notFound } from "next/navigation";
import { QURAN_MENU } from "@/lib/data";
import {
  BacaPage,
  HafalanPage,
  HijaiyahPage,
  KhatamPage,
  KelompokPage,
  QariPage,
  SuratPilihanPage,
  VideoPage,
} from "@/components/quran";

export function generateStaticParams() {
  return QURAN_MENU.map((m) => ({ slug: m.slug }));
}

const PAGES: Record<string, () => JSX.Element> = {
  hafalan: HafalanPage,
  hijaiyah: HijaiyahPage,
  qari: QariPage,
  baca: BacaPage,
  khatam: KhatamPage,
  kelompok: KelompokPage,
  video: VideoPage,
  pilihan: SuratPilihanPage,
};

export default function QuranDetail({ params }: { params: { slug: string } }) {
  const Page = PAGES[params.slug];
  if (!Page) notFound();
  return <Page />;
}
