import { notFound } from "next/navigation";
import { DZIKIR_WIRID_MENU, IBADAH_MENU } from "@/lib/data";
import {
  AmalPage,
  AsmaulHusnaPage,
  DoaPage,
  DzikirPage,
  DzikirPagiPage,
  DzikirPetangPage,
  DzikirWiridPage,
  JadwalPage,
  KalenderPage,
  KiblatPage,
  MasjidPage,
  RamadhanPage,
  ShalatWudhuPage,
  TahlilPage,
  TasbihPage,
  WiridPage,
  YasinTahlilPage,
} from "@/components/ibadah";

export function generateStaticParams() {
  // Menu grup + anak-anaknya (anak grup tidak ada di IBADAH_MENU).
  return [...IBADAH_MENU, ...DZIKIR_WIRID_MENU].map((m) => ({ slug: m.slug }));
}

const PAGES: Record<string, () => JSX.Element> = {
  doa: DoaPage,
  tasbih: TasbihPage,
  jadwal: JadwalPage,
  ramadhan: RamadhanPage,
  kalender: KalenderPage,
  "shalat-wudhu": ShalatWudhuPage,
  dzikir: DzikirPage,
  "dzikir-wirid": DzikirWiridPage,
  wirid: WiridPage,
  "dzikir-pagi": DzikirPagiPage,
  "dzikir-petang": DzikirPetangPage,
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
