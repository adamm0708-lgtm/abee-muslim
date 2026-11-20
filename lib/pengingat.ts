// Pengingat Amalan — data + dalil.
//
// ATURAN: teks dalil di bawah adalah redaksi yang sudah diverifikasi dan
// disetujui Adam (2026-11-20). JANGAN mengubah redaksi/sumber/statusnya dan
// JANGAN menambah dalil tanpa verifikasi. Status "Tradisi" berarti amalan
// tersebut adalah tradisi yang hidup di pesantren/NU, bukan sunnah khusus
// yang bersandar pada hadis sahih — kejujuran ini WAJIB tampil di kartu.
import type { IconName } from "@/lib/data";

export type DalilStatus = "Shahih" | "Hasan" | "Dhaif" | "Tradisi";

export type Dalil = {
  text: string;
  source: string;
  /** Boleh kosong bila tidak ada penilaian status yang terverifikasi. */
  status?: DalilStatus;
};

export type PengingatSchedule =
  | "jumat" // Maghrib Kamis s.d. Maghrib Jumat
  | "malam-jumat" // Kamis setelah Maghrib s.d. Subuh Jumat
  | "malam" // setiap malam setelah Isya
  | "harian" // setiap hari
  | "mingguan"; // setiap Ahad (Surat Pilihan)

export type PengingatDef = {
  id: string;
  title: string;
  subtitle: string;
  schedule: PengingatSchedule;
  scheduleLabel: string;
  icon: IconName;
  href: string;
  actionLabel: string;
  doneLabel: string;
  dalil: Dalil[];
};

export const PENGINGAT: PengingatDef[] = [
  {
    id: "kahfi",
    title: "Sudahkah Anda membaca Al-Kahfi?",
    subtitle: "Jumat · Maghrib Kamis s.d. Maghrib Jumat",
    schedule: "jumat",
    scheduleLabel: "Setiap Jumat",
    icon: "book-open",
    href: "/quran/baca?surah=18",
    actionLabel: "Baca Al-Kahfi",
    doneLabel: "Sudah dibaca",
    dalil: [
      {
        text: "Barangsiapa membaca surat Al-Kahfi pada hari Jumat, ia akan diterangi dengan cahaya di antara dua Jumat.",
        source:
          "HR. Al-Hakim no. 3392, Al-Baihaqi — Ibnu Hajar: hasan; Al-Albani: shahih (Shahih Al-Jami' no. 6470)",
        status: "Shahih",
      },
      {
        text: "Diriwayatkan pula keutamaan membaca Al-Kahfi pada malam Jumat.",
        source: "HR. Ad-Darimi no. 3450, disahihkan Al-Albani",
        status: "Shahih",
      },
    ],
  },
  {
    id: "yasin",
    title:
      "Sudahkah Anda membaca Yasin? Yuk baca, kita hadiahkan untuk orang tua kita yang telah tiada.",
    subtitle: "Malam Jumat · Kamis setelah Maghrib",
    schedule: "malam-jumat",
    scheduleLabel: "Setiap malam Jumat",
    icon: "quote",
    href: "/ibadah/yasin-tahlil",
    actionLabel: "Baca Yasin",
    doneLabel: "Sudah dibaca",
    dalil: [
      {
        text: "Hadis 'Bacalah Yasin atas orang yang meninggal di antara kalian' (HR. Abu Dawud no. 2714) dinilai DHAIF oleh Al-Albani, An-Nawawi, dan Ibnu Hajar. Yasinan malam Jumat adalah tradisi yang hidup di pesantren/NU — bukan sunnah khusus yang bersandar pada hadis sahih. Menghadiahkan pahala bacaan untuk orang tua yang telah tiada dibolehkan menurut jumhur ulama.",
        source: "HR. Abu Dawud no. 2714 (dhaif) · Tradisi pesantren/NU",
        status: "Tradisi",
      },
    ],
  },
  {
    id: "mulk",
    title: "Sudahkah Anda membaca Al-Mulk malam ini?",
    subtitle: "Setiap malam setelah Isya · Pasangannya: As-Sajdah",
    schedule: "malam",
    scheduleLabel: "Setiap malam",
    icon: "moon",
    href: "/quran/baca?surah=67",
    actionLabel: "Baca Al-Mulk",
    doneLabel: "Sudah dibaca",
    dalil: [
      {
        text: "Ada surat dari Al-Qur'an yang terdiri dari 30 ayat, memberi syafaat hingga diampuni, yaitu surat Tabarak (Al-Mulk).",
        source:
          "HR. Abu Dawud no. 1400, Tirmidzi no. 2891 (hasan; Al-Albani dalam Shahih Tirmidzi)",
        status: "Hasan",
      },
      {
        text: "Nabi tidak tidur sebelum membaca As-Sajdah dan Al-Mulk.",
        source: "HR. Tirmidzi, disahihkan Al-Albani",
        status: "Shahih",
      },
    ],
  },
  {
    id: "ngaji",
    title: "Sudahkah Anda mengaji hari ini? Yuk kita ngaji walau satu ayat.",
    subtitle: "Setiap hari",
    schedule: "harian",
    scheduleLabel: "Setiap hari",
    icon: "book",
    href: "/quran/baca",
    actionLabel: "Mulai mengaji",
    doneLabel: "Sudah mengaji",
    dalil: [
      {
        text: "Bacalah Al-Qur'an, sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafaat bagi para pembacanya.",
        source: "HR. Muslim no. 804",
        status: "Shahih",
      },
      {
        text: "Amalan yang paling dicintai Allah adalah yang paling kontinu walaupun sedikit.",
        source: "HR. Bukhari no. 6464, Muslim no. 783",
        status: "Shahih",
      },
    ],
  },
  {
    id: "istighfar",
    title: "Sudahkah Anda beristighfar 100x hari ini?",
    subtitle: "Setiap hari · Dzikir: Astaghfirullah · Target 100x",
    schedule: "harian",
    scheduleLabel: "Setiap hari",
    icon: "beads",
    href: "/ibadah/tasbih",
    actionLabel: "Buka Tasbih Digital",
    doneLabel: "Sudah 100x",
    dalil: [
      {
        text: "Sesungguhnya aku beristighfar kepada Allah dalam sehari seratus kali.",
        source: "HR. Muslim no. 2702",
        status: "Shahih",
      },
      {
        text: "Demi Allah, aku beristighfar dan bertaubat kepada Allah lebih dari tujuh puluh kali dalam sehari.",
        source: "HR. Bukhari no. 6307",
        status: "Shahih",
      },
    ],
  },
  {
    id: "arrahman",
    title: "Surat Pilihan: Ar-Rahman — pengingat nikmat Allah.",
    subtitle: "Setiap Ahad · Surat Pilihan minggu ini",
    schedule: "mingguan",
    scheduleLabel: "Setiap Ahad",
    icon: "sun",
    href: "/quran/baca?surah=55",
    actionLabel: "Baca Ar-Rahman",
    doneLabel: "Sudah dibaca",
    dalil: [
      {
        text: "Saat Nabi membacakan Ar-Rahman, para jin menjawab: 'Kami tidak mendustakan nikmat-Mu sedikit pun, bagi-Mu segala puji.'",
        source: "HR. Tirmidzi, dari Jabir",
      },
      {
        text: "Hadis 'pengantin Al-Qur'an adalah Ar-Rahman' (HR. Al-Baihaqi) statusnya DHAIF — tidak dijadikan sandaran utama.",
        source: "HR. Al-Baihaqi (dhaif)",
        status: "Dhaif",
      },
    ],
  },
];

/** Semua id pengingat — dipakai untuk toggle default di store. */
export const PENGINGAT_IDS: string[] = PENGINGAT.map((p) => p.id);
