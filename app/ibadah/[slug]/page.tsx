import { notFound } from "next/navigation";
import { IBADAH_MENU } from "@/lib/data";
import {
  AmalPage,
  AsmaulHusnaPage,
  DoaPage,
  DzikirPage,
  JadwalPage,
  KalenderPage,
  KiblatPage,
  MasjidPage,
  RamadhanPage,
  ShalatWudhuPage,
  TahlilPage,
  TasbihPage,
  YasinTahlilPage,
} from "@/components/ibadah";

export function generateStaticParams() {
  return IBADAH_MENU.map((m) => ({ slug: m.slug }));
}

const PAGES: Record<string, () => JSX.Element> = {
  doa: DoaPage,
  tasbih: TasbihPage,
  jadwal: JadwalPage,
  ramadhan: RamadhanPage,
  kalender: KalenderPage,
  "shalat-wudhu": ShalatWudhuPage,
  dzikir: DzikirPage,
  tahlil: TahlilPage,
  "yasin-tahlil": YasinTahlilPage,
  masjid: MasjidPage,
  kiblat: KiblatPage,
  amal: AmalPage,
  "asmaul-husna": AsmaulHusnaPage,
};

export default function IbadahDetail({ params }: { params: { slug: string } }) {
  const Page = PAGES[params.slug];
  if (!Page) notFound();
  return <Page />;
}
