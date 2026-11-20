// ---------- Belajar Shalat & Wudhu: bacaan + sunnah rawatib ----------
// Ditambahkan atas permintaan Adam (2026-11-20 20:45 WIB):
// "Belajar wudhu dan shalat juga dikasih bacaan wudhu, bacaan shalat,
// sekalian sunnat rowatib juga".
//
// ATURAN REDAKSI (sama dengan katalog doa — lihat lib/doa-katalog/RINGKASAN.md):
// - Tidak ada teks Arab yang dikarang. Setiap teks diverifikasi silang dari
//   kitab hadis / sumber tepercaya. Bila tidak terverifikasi, tidak dicantumkan.
// - Bedakan jujur antara yang bersumber hadis sahih vs tradisi/umum.
// - Doa per anggota wudhu (doa saat membasuh wajah/tangan/dst.) TIDAK punya
//   dasar yang sahih — TIDAK dicantumkan sebagai bacaan; hanya dijelaskan
//   dalam catatan (Ibnul Qayyim, Zad al-Ma'ad 1/195: semua hadis tentang
//   dzikir di tengah wudhu adalah dusta dan dibuat-buat; Imam An-Nawawi,
//   Al-Adzkar hlm. 30: tidak ada satu pun riwayat dari Nabi ﷺ tentang itu).
// - Niat rawatib: lafaz menurut tuntunan fikih mazhab Syafi'i (bukan riwayat
//   hadis). Niat tempatnya di hati — lafaz hanya alat bantu belajar.

export type BacaanStatus = "Shahih" | "Hasan" | "Dhaif" | "Doa umum" | "Al-Qur'an" | "Fikih Syafi'i";

export type BacaanShalat = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  status: BacaanStatus;
  note: string;
  // Untuk ayat Al-Qur'an: tiap ayat satu baris (teks Simple, sama dengan reader).
  verses?: string[];
  // Rujukan ke halaman lain (mis. Baca Al-Qur'an / Doa Harian).
  link?: { href: string; label: string };
};

export type RawatibItem = {
  id: string;
  title: string;
  shalat: string;
  waktu: string; // "Sebelum Subuh" / "Sesudah Dzuhur" dst.
  rakaat: number;
  muakkad: boolean; // true = muakkad, false = ghairu muakkad
  niatArab: string;
  niatLatin: string;
  niatArti: string;
  keutamaan: string;
  source: string;
  status: BacaanStatus;
  note?: string;
};

// ---------- 1. BACAAN WUDHU ----------
// Bismillah + Doa Setelah Wudhu dipakai ulang persis dari katalog yang ada
// (lib/doa-katalog/sehari-hari.ts "sebelum-wudu" dan lib/data.ts
// "setelah-wudhu") — tidak diubah redaksinya.

export const WUDHU_READINGS: BacaanShalat[] = [
  {
    id: "niat-wudhu",
    title: "Niat Wudhu",
    arabic: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul wudhu'a liraf'il hadatsil ashghari fardhan lillaahi ta'aalaa.",
    translation: "Aku berniat wudhu untuk menghilangkan hadats kecil, fardhu karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i (Minhajut Thalibin; Fathul Qarib)",
    status: "Fikih Syafi'i",
    note: "Niat adalah rukun pertama wudhu menurut mazhab Syafi'i — tempatnya di hati, dihadirkan saat air pertama mengenai wajah. Lafaz Arab ini susunan ulama mengikuti unsur niat dalam kitab fikih Syafi'i (bukan lafaz dari Nabi ﷺ); niat tetap sah dengan bahasa apa pun yang dipahami. Bentuk ringkasnya: \"Nawaitul wudhu'a\" (aku berniat wudhu).",
  },
  {
    id: "bismillah-wudhu",
    title: "Bismillah di Awal Wudhu",
    arabic: "بِسْمِ اللَّهِ",
    latin: "Bismillaah.",
    translation: "Dengan nama Allah.",
    source: "HR. Abu Dawud 101, Tirmidzi 25, Ibnu Majah 397",
    status: "Hasan",
    note: "Dibaca di awal wudhu sebelum membasuh anggota wudhu. Al-Albani menilainya hasan (Tirmidzi 25) dan sahih (Abu Dawud 101); Imam Ahmad berpendapat tidak ada hadits yang kuat dalam bab ini, dan jumhur ulama memandang basmalah dalam wudhu sebagai sunnah, bukan wajib.",
  },
  {
    id: "doa-setelah-wudhu",
    title: "Doa Setelah Wudhu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    latin:
      "Asyhadu an laa ilaaha illallaah wahdahu laa syariika lah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allaahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin.",
    translation:
      "Aku bersaksi bahwa tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci.",
    source: "HR. Muslim 234, Tirmidzi 55",
    status: "Shahih",
    note: "Dibaca setelah selesai berwudhu. Bagian syahadatnya dari HR. Muslim 234 (sahih). Tambahan \"Allahummaj'alni minat tawwabin...\" dari HR. Tirmidzi 55 — dinilai sahih oleh Al-Albani dan Ahmad Syakir, namun Ibnu Hajar menilai tambahan ini tidak kuat. Menengadah ke langit saat membacanya tidak diajarkan sebagai sunnah (riwayat Abu Dawud 170 dinilai dhaif oleh Al-Albani).",
  },
  {
    id: "doa-setelah-wudhu-nasai",
    title: "Doa Setelah Wudhu (Riwayat An-Nasa'i)",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    latin:
      "Subhanakallahumma wa bihamdika, asyhadu an la ilaha illa anta, astaghfiruka wa atubu ilaik.",
    translation:
      "Mahasuci Engkau, ya Allah, dan dengan memuji-Mu (aku bersaksi) bahwa tiada Tuhan yang berhak disembah selain Engkau. Aku memohon ampun kepada-Mu dan bertobat kepada-Mu.",
    source: "HR. An-Nasa'i (dishahihkan Al-Albani)",
    status: "Shahih",
    note: "Doa lain yang juga dibaca setelah wudhu — boleh dibaca sebagai tambahan setelah doa di atas.",
  },
];

// ---------- 2. BACAAN SHALAT ----------

export const SHALAT_READINGS: BacaanShalat[] = [
  {
    id: "iftitah",
    title: "Doa Iftitah",
    arabic:
      "اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا",
    latin: "Allahu akbar kabira, walhamdulillahi katsira, wa subhanallahi bukrataw wa ashila.",
    translation:
      "Allah Mahabesar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, dan Mahasuci Allah pada pagi dan petang hari.",
    source: "HR. Muslim 601",
    status: "Shahih",
    note: "Dibaca sekali setelah takbiratul ihram, sebelum membaca Al-Fatihah. Ini versi yang biasa diajarkan di Indonesia. Ada versi lain yang juga sahih, mis. \"Subhanakallahumma wa bihamdika...\" (HR. Abu Dawud 776) dan \"Allahumma ba'id baini wa baina khathayaya...\" (HR. Bukhari 744, Muslim 598).",
  },
  {
    id: "fatihah",
    title: "Al-Fatihah",
    arabic: "",
    latin:
      "Bismillahirrahmanirrahim. Alhamdulillahi rabbil 'alamin. Ar-rahmanir rahim. Maliki yaumid din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinash shirathal mustaqim. Shirathalladzina an'amta 'alaihim, ghairil maghdhubi 'alaihim wa ladh-dhallin.",
    translation:
      "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih, Maha Penyayang. Pemilik hari Pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
    source: "Al-Qur'an, surah Al-Fatihah (1): 1–7",
    status: "Al-Qur'an",
    note: "Wajib dibaca di setiap rakaat. Teks di bawah ini ejaan Simple (Imla'i), sama dengan yang dipakai di Baca Al-Qur'an.",
    verses: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    ],
    link: { href: "/quran/baca?surah=1", label: "Buka Al-Fatihah di Baca Al-Qur'an" },
  },
  {
    id: "al-ikhlas",
    title: "Surah Pendek — Contoh: Al-Ikhlas",
    arabic: "",
    latin:
      "Qul huwallahu ahad. Allahush-shamad. Lam yalid wa lam yulad. Wa lam yakul lahu kufuwan ahad.",
    translation:
      "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. (Allah) tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.\"",
    source: "Al-Qur'an, surah Al-Ikhlas (112): 1–4",
    status: "Al-Qur'an",
    note: "Setelah Al-Fatihah, dibaca satu surah pendek — contohnya Al-Ikhlas di bawah ini. Boleh diganti surah pendek lain (mis. Al-Kautsar, An-Nas, Al-Falaq) yang ada di Surat Pilihan.",
    verses: [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    ],
    link: { href: "/quran/baca?surah=112", label: "Buka Al-Ikhlas di Baca Al-Qur'an" },
  },
  {
    id: "ruku",
    title: "Bacaan Ruku'",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    latin: "Subhana rabbiyal 'azhim.",
    translation: "Mahasuci Tuhanku Yang Mahaagung.",
    source: "HR. Muslim 772",
    status: "Shahih",
    note: "Dibaca 3 kali (kebiasaan yang diajarkan; minimal 1 kali sudah sah).",
  },
  {
    id: "itidal",
    title: "Bacaan I'tidal (Bangkit dari Ruku')",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا لَكَ الْحَمْدُ",
    latin: "Sami'allahu liman hamidah. Rabbana lakal hamd.",
    translation:
      "Allah mendengar orang yang memuji-Nya. Wahai Tuhan kami, bagi-Mu segala puji.",
    source: "HR. Bukhari 799, Muslim 772; HR. Bukhari 796",
    status: "Shahih",
    note: "\"Sami'allahu liman hamidah\" dibaca saat bangkit dari ruku', lalu \"Rabbana lakal hamd\" setelah berdiri tegak. Ada versi panjangnya: \"Allahumma Rabbana lakal hamd, mil'as samawati wa mil'al ardhi wa ma bainahuma wa mil'a ma syi'ta min syai'in ba'du\" (HR. Muslim 477).",
  },
  {
    id: "sujud",
    title: "Bacaan Sujud",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    latin: "Subhana rabbiyal a'la.",
    translation: "Mahasuci Tuhanku Yang Mahatinggi.",
    source: "HR. Muslim 772",
    status: "Shahih",
    note: "Dibaca 3 kali (kebiasaan yang diajarkan; minimal 1 kali sudah sah). Sujud adalah posisi paling dekat seorang hamba dengan Tuhannya — perbanyaklah doa di dalamnya (HR. Muslim 482).",
  },
  {
    id: "duduk-dua-sujud",
    title: "Doa Duduk di Antara Dua Sujud",
    arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي",
    latin: "Allahummaghfirli warhamni wa 'afini wahdini warzuqni.",
    translation:
      "Ya Allah, ampunilah aku, rahmatilah aku, sehatkanlah aku, berilah aku petunjuk, dan berilah aku rezeki.",
    source: "HR. Abu Dawud 850; Tirmidzi 284 (hasan menurut Al-Albani)",
    status: "Hasan",
    note: "Versi pendeknya: \"Rabbighfirli, Rabbighfirli\" (HR. An-Nasa'i 1145, Ibnu Majah 897 — sahih menurut Al-Albani). Versi gabungan 7 kalimat menurut An-Nawawi (Al-Majmu' 3/414) menambah \"wajburni warfa'ni\": \"Allahummaghfirli warhamni wa 'afini wajburni warfa'ni wahdini warzuqni\".",
  },
  {
    id: "tasyahud-awal",
    title: "Tasyahud Awal",
    arabic:
      "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    latin:
      "Attahiyyatu lillah, wash-shalawatu wath-thayyibatu. Assalamu 'alaika ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. Assalamu 'alaina wa 'ala 'ibadillahish-shalihin. Asyhadu an la ilaha illallah, wa asyhadu anna Muhammadan 'abduhu wa rasuluh.",
    translation:
      "Segala penghormatan, salawat, dan kebaikan hanya milik Allah. Semoga keselamatan tercurah atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan tercurah atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada Tuhan yang berhak disembah selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    source: "HR. Muslim 402, Bukhari 831 (riwayat Ibnu Mas'ud)",
    status: "Shahih",
    note: "Dalam mazhab Syafi'i, tasyahud awal cukup sampai kalimat syahadat; shalawat dibaca pada tasyahud akhir.",
  },
  {
    id: "tasyahud-akhir",
    title: "Tasyahud Akhir + Shalawat",
    arabic:
      "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    latin:
      "Attahiyyatu lillah, wash-shalawatu wath-thayyibatu. Assalamu 'alaika ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. Assalamu 'alaina wa 'ala 'ibadillahish-shalihin. Asyhadu an la ilaha illallah, wa asyhadu anna Muhammadan 'abduhu wa rasuluh. Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad kama shallaita 'ala Ibrahim wa 'ala ali Ibrahim, innaka hamidun majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka hamidun majid.",
    translation:
      "Segala penghormatan, salawat, dan kebaikan hanya milik Allah. Semoga keselamatan tercurah atasmu, wahai Nabi, beserta rahmat Allah dan berkah-Nya. Semoga keselamatan tercurah atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tiada Tuhan yang berhak disembah selain Allah, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, limpahkanlah salawat kepada Muhammad dan kepada keluarga Muhammad, sebagaimana Engkau telah melimpahkan salawat kepada Ibrahim dan kepada keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkanlah berkah kepada Muhammad dan kepada keluarga Muhammad, sebagaimana Engkau telah melimpahkan berkah kepada Ibrahim dan kepada keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    source: "HR. Muslim 402; Bukhari 3370, Muslim 406 (shalawat Ibrahimiyah)",
    status: "Shahih",
    note: "Tasyahud akhir = bacaan tasyahud di atas ditambah shalawat Ibrahimiyah. Setelah itu dibaca doa sebelum salam.",
  },
  {
    id: "doa-sebelum-salam",
    title: "Doa Sebelum Salam",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    latin:
      "Allahumma inni a'udzu bika min 'adzabi jahannam, wa min 'adzabil qabri, wa min fitnatil mahya wal mamat, wa min syarri fitnatil masihid dajjal.",
    translation:
      "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari azab Jahanam, dari azab kubur, dari fitnah kehidupan dan kematian, dan dari keburukan fitnah Al-Masih Ad-Dajjal.",
    source: "HR. Muslim 588",
    status: "Shahih",
    note: "Dibaca setelah tasyahud akhir, sebelum mengucapkan salam.",
  },
  {
    id: "salam",
    title: "Salam",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    latin: "Assalamu 'alaikum wa rahmatullah.",
    translation: "Semoga keselamatan dan rahmat Allah tercurah atas kalian.",
    source: "HR. Muslim 582",
    status: "Shahih",
    note: "Diucapkan dua kali: menoleh ke kanan, lalu ke kiri.",
  },
];

// ---------- 2b. NIAT SHALAT FARDHU (USHOLLI) ----------
// Ditambahkan atas permintaan Adam (2026-11-20 21:36 WIB):
// "Shalat fardhu belum usolli." Lafaz niat ini susunan ulama mazhab
// Syafi'i (bukan riwayat hadis) — niat tempatnya di hati dan dihadirkan
// bersamaan dengan takbiratul ihram. Redaksi Arab + Latin + arti
// diverifikasi silang dari beberapa sumber (NU Online, niyatapp,
// lensahukum, theasianparent) — kelimanya konsisten.

export const FARDHU_NIAT: BacaanShalat[] = [
  {
    id: "niat-subuh",
    title: "Niat Shalat Subuh",
    arabic: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushallii fardhash-shubhi rak'ataini mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    translation: "Aku berniat shalat fardu Subuh dua rakaat menghadap kiblat, tunai, karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat dihadirkan di hati bersamaan dengan takbiratul ihram. Bila menjadi makmum, tambahkan \"ma'muman\" setelah \"mustaqbilal qiblati\"; bila menjadi imam, \"imaman\". Bila meng-qadha shalat yang terlewat, ganti \"adaa'an\" dengan \"qadhaa'an\".",
  },
  {
    id: "niat-dzuhur",
    title: "Niat Shalat Dzuhur",
    arabic: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushallii fardhazh-zhuhri arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    translation: "Aku berniat shalat fardu Dzuhur empat rakaat menghadap kiblat, tunai, karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat dihadirkan di hati bersamaan dengan takbiratul ihram. Bila menjadi makmum, tambahkan \"ma'muman\" setelah \"mustaqbilal qiblati\"; bila menjadi imam, \"imaman\". Bila meng-qadha shalat yang terlewat, ganti \"adaa'an\" dengan \"qadhaa'an\".",
  },
  {
    id: "niat-ashar",
    title: "Niat Shalat Ashar",
    arabic: "أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushallii fardhal-'ashri arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    translation: "Aku berniat shalat fardu Ashar empat rakaat menghadap kiblat, tunai, karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat dihadirkan di hati bersamaan dengan takbiratul ihram. Bila menjadi makmum, tambahkan \"ma'muman\" setelah \"mustaqbilal qiblati\"; bila menjadi imam, \"imaman\". Bila meng-qadha shalat yang terlewat, ganti \"adaa'an\" dengan \"qadhaa'an\".",
  },
  {
    id: "niat-maghrib",
    title: "Niat Shalat Maghrib",
    arabic: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushallii fardhal-maghribi tsalaatsa raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    translation: "Aku berniat shalat fardu Maghrib tiga rakaat menghadap kiblat, tunai, karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat dihadirkan di hati bersamaan dengan takbiratul ihram. Bila menjadi makmum, tambahkan \"ma'muman\" setelah \"mustaqbilal qiblati\"; bila menjadi imam, \"imaman\". Bila meng-qadha shalat yang terlewat, ganti \"adaa'an\" dengan \"qadhaa'an\".",
  },
  {
    id: "niat-isya",
    title: "Niat Shalat Isya",
    arabic: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushallii fardhal-'isyaa'i arba'a raka'aatin mustaqbilal qiblati adaa'an lillaahi ta'aalaa.",
    translation: "Aku berniat shalat fardu Isya empat rakaat menghadap kiblat, tunai, karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat dihadirkan di hati bersamaan dengan takbiratul ihram. Bila menjadi makmum, tambahkan \"ma'muman\" setelah \"mustaqbilal qiblati\"; bila menjadi imam, \"imaman\". Bila meng-qadha shalat yang terlewat, ganti \"adaa'an\" dengan \"qadhaa'an\".",
  },
];

// ---------- 3. SUNNAH RAWATIB ----------
// Keutamaan 12 rakaat (HR. Muslim 728): "Barangsiapa shalat 12 rakaat dalam
// sehari semalam, dibangunkan baginya sebuah rumah di surga." Rinciannya
// (HR. Tirmidzi 415, hasan sahih menurut Al-Albani): 4 sebelum Dzuhur,
// 2 sesudah Dzuhur, 2 sesudah Maghrib, 2 sesudah Isya, 2 sebelum Subuh.
// Muakkad 10 rakaat (HR. Bukhari 1187, Muslim 729 — riwayat Ibnu Umar):
// 2 sebelum Subuh, 2 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib,
// 2 sesudah Isya. Ghairu muakkad: 2 tambahan sebelum Dzuhur (menjadi 4),
// 2 tambahan sesudah Dzuhur (menjadi 4), 4 sebelum Ashar, 2 sebelum
// Maghrib, 2 sebelum Isya — total rawatib 22 rakaat (Fathul Qarib).

export const RAWATIB_KEUTAMAAN = {
  arabic:
    "مَنْ صَلَّى اثْنَتَىْ عَشْرَةَ رَكْعَةً فِي يَوْمٍ وَلَيْلَةٍ بُنِيَ لَهُ بِهِنَّ بَيْتٌ فِي الْجَنَّةِ",
  latin:
    "Man shallaa itsnatai 'asyrata rak'atan fii yaumin wa lailatin buniya lahu bihinna baitun fil jannah.",
  translation:
    "Barangsiapa shalat 12 rakaat dalam sehari semalam, dibangunkan baginya sebuah rumah di surga.",
  source: "HR. Muslim 728",
  note: "Rincian 12 rakaat itu (HR. Tirmidzi 415): 4 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib, 2 sesudah Isya, 2 sebelum Subuh. Yang muakkad (sangat ditekankan) 10 rakaat (HR. Bukhari 1187, Muslim 729): 2 sebelum Subuh, 2 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib, 2 sesudah Isya. Selebihnya ghairu muakkad — tetap sunnah dan berpahala, tapi tidak setegas yang muakkad.",
};

export const RAWATIB: RawatibItem[] = [
  {
    id: "qabliyah-subuh",
    title: "Qabliyah Subuh",
    shalat: "Subuh",
    waktu: "Sebelum Subuh",
    rakaat: 2,
    muakkad: true,
    niatArab: "أُصَلِّي سُنَّةَ الصُّبْحِ رَكْعَتَيْنِ قَبْلِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatash-shubhi rak'ataini qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Subuh dua rakaat sebelum (Subuh), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Dua rakaat sebelum Subuh lebih baik daripada dunia dan seisinya.",
    source: "HR. Muslim 725",
    status: "Shahih",
    note: "Shalat sunnah yang paling ditekankan di antara semua rawatib — Nabi ﷺ tidak pernah meninggalkannya, bahkan saat safar.",
  },
  {
    id: "qabliyah-dzuhur",
    title: "Qabliyah Dzuhur",
    shalat: "Dzuhur",
    waktu: "Sebelum Dzuhur",
    rakaat: 2,
    muakkad: true,
    niatArab: "أُصَلِّي سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ قَبْلِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatazh-zhuhri rak'ataini qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Dzuhur dua rakaat sebelum (Dzuhur), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan:
      "Barangsiapa menjaga 4 rakaat sebelum Dzuhur dan 4 rakaat sesudahnya, Allah mengharamkannya atas api neraka.",
    source: "HR. Tirmidzi 428 (dishahihkan Al-Albani)",
    status: "Shahih",
    note: "Boleh ditambah 2 rakaat lagi menjadi 4 rakaat (ghairu muakkad) — niatnya: \"Ushalli sunnatazh-zhuhri arba'a raka'atin qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.\"",
  },
  {
    id: "badiyah-dzuhur",
    title: "Ba'diyah Dzuhur",
    shalat: "Dzuhur",
    waktu: "Sesudah Dzuhur",
    rakaat: 2,
    muakkad: true,
    niatArab: "أُصَلِّي سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ بَعْدِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatazh-zhuhri rak'ataini ba'diyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Dzuhur dua rakaat sesudah (Dzuhur), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan:
      "Barangsiapa menjaga 4 rakaat sebelum Dzuhur dan 4 rakaat sesudahnya, Allah mengharamkannya atas api neraka.",
    source: "HR. Tirmidzi 428 (dishahihkan Al-Albani)",
    status: "Shahih",
    note: "Boleh ditambah 2 rakaat lagi menjadi 4 rakaat (ghairu muakkad) — niatnya: \"Ushalli sunnatazh-zhuhri arba'a raka'atin ba'diyyatan mustaqbilal qiblati lillaahi ta'aalaa.\"",
  },
  {
    id: "qabliyah-ashar",
    title: "Qabliyah Ashar",
    shalat: "Ashar",
    waktu: "Sebelum Ashar",
    rakaat: 4,
    muakkad: false,
    niatArab: "أُصَلِّي سُنَّةَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ قَبْلِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatal 'ashri arba'a raka'atin qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Ashar empat rakaat sebelum (Ashar), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Semoga Allah merahmati orang yang shalat 4 rakaat sebelum Ashar.",
    source: "HR. Abu Dawud 1271, Tirmidzi 430 (hasan menurut Al-Albani)",
    status: "Hasan",
    note: "Dikerjakan 2 rakaat + 2 rakaat, masing-masing dengan salam. Tidak ada ba'diyah Ashar — setelah Ashar adalah waktu terlarang shalat sunnah.",
  },
  {
    id: "qabliyah-maghrib",
    title: "Qabliyah Maghrib",
    shalat: "Maghrib",
    waktu: "Sebelum Maghrib",
    rakaat: 2,
    muakkad: false,
    niatArab: "أُصَلِّي سُنَّةَ الْمَغْرِبِ رَكْعَتَيْنِ قَبْلِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatal maghribi rak'ataini qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Maghrib dua rakaat sebelum (Maghrib), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Di antara setiap azan dan iqamah ada shalat (sunnah).",
    source: "HR. Bukhari 627, Muslim 838",
    status: "Shahih",
    note: "Waktunya singkat — antara azan dan iqamah Maghrib.",
  },
  {
    id: "badiyah-maghrib",
    title: "Ba'diyah Maghrib",
    shalat: "Maghrib",
    waktu: "Sesudah Maghrib",
    rakaat: 2,
    muakkad: true,
    niatArab: "أُصَلِّي سُنَّةَ الْمَغْرِبِ رَكْعَتَيْنِ بَعْدِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatal maghribi rak'ataini ba'diyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Maghrib dua rakaat sesudah (Maghrib), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Termasuk 12 rakaat yang dijanjikan sebuah rumah di surga.",
    source: "HR. Muslim 728",
    status: "Shahih",
  },
  {
    id: "qabliyah-isya",
    title: "Qabliyah Isya",
    shalat: "Isya",
    waktu: "Sebelum Isya",
    rakaat: 2,
    muakkad: false,
    niatArab: "أُصَلِّي سُنَّةَ الْعِشَاءِ رَكْعَتَيْنِ قَبْلِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatal 'isyaa'i rak'ataini qabliyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Isya dua rakaat sebelum (Isya), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Di antara setiap azan dan iqamah ada shalat (sunnah).",
    source: "HR. Bukhari 627, Muslim 838",
    status: "Shahih",
  },
  {
    id: "badiyah-isya",
    title: "Ba'diyah Isya",
    shalat: "Isya",
    waktu: "Sesudah Isya",
    rakaat: 2,
    muakkad: true,
    niatArab: "أُصَلِّي سُنَّةَ الْعِشَاءِ رَكْعَتَيْنِ بَعْدِيَّةً مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    niatLatin: "Ushalli sunnatal 'isyaa'i rak'ataini ba'diyyatan mustaqbilal qiblati lillaahi ta'aalaa.",
    niatArti: "Aku berniat shalat sunnah Isya dua rakaat sesudah (Isya), menghadap kiblat, karena Allah Ta'ala.",
    keutamaan: "Termasuk 12 rakaat yang dijanjikan sebuah rumah di surga.",
    source: "HR. Muslim 728",
    status: "Shahih",
  },
];

// ---------- 4. MANDI BESAR (GHUSL / MANDI WAJIB) ----------
// Ditambahkan atas permintaan Adam (2026-11-20 21:36 WIB):
// "Mandi besar juga."
//
// Rukun dan sebab-sebabnya dari kitab Safinatun Najah (Syekh Salim bin
// Sumair Al-Hadhrami); tata cara sempurnanya mengikuti sunnah Nabi ﷺ
// sebagaimana dirinci dalam kitab-kitab fikih Syafi'i (Taqrirat
// as-Sadidah; Fiqh al-'Ibadat Syafi'i). Lafaz niat susunan ulama
// mazhab Syafi'i (bukan riwayat hadis) — niat tempatnya di hati.

export const MANDI_RUKUN = {
  arabic: "فُرُوضُ الْغُسْلِ اثْنَانِ: النِّيَّةُ وَتَعْمِيمُ الْبَدَنِ بِالْمَاءِ",
  latin: "Furuudhul ghusli itsnaani: an-niyyatu wa ta'miimul badani bil maa'i.",
  translation: "Fardhu (rukun) mandi ada dua: niat dan meratakan air ke seluruh tubuh.",
  source: "Safinatun Najah (Syekh Salim bin Sumair Al-Hadhrami)",
  note: "Niat dihadirkan di hati bersamaan dengan air pertama yang menyentuh tubuh. Meratakan air berarti seluruh kulit dan rambut harus terkena air — termasuk lipatan tubuh, ketiak, pusar, telinga, sela-sela jari, dan pangkal rambut. Bila dua rukun ini terpenuhi, mandinya sah.",
};

// 6 perkara yang mewajibkan mandi (Safinatun Najah).
export const MANDI_CAUSES = {
  arabic:
    "مُوجِبَاتُ الْغُسْلِ سِتَّةٌ: إِيْلَاجُ الْحَشَفَةِ فِي الْفَرْجِ، وَخُرُوجُ الْمَنِيِّ، وَالْحَيْضُ، وَالنِّفَاسُ، وَالْوِلَادَةُ، وَالْمَوْتُ",
  latin:
    "Muujibaatul ghusli sittatun: iilaajul hasyafati fil farji, wa khuruujul maniyyi, wal haidhu, wan nifaasu, wal wilaadatu, wal mautu.",
  translation:
    "Perkara yang mewajibkan mandi ada enam: bertemunya dua kemaluan, keluar mani, haid, nifas, melahirkan, dan mati.",
  source: "Safinatun Najah — fasal yang mewajibkan mandi",
  items: [
    "Hubungan suami istri (bertemunya dua kemaluan) — wajib mandi bagi keduanya, baik keluar mani maupun tidak.",
    "Keluar mani — baik karena mimpi basah maupun sebab lain, dalam keadaan sadar atau tidak.",
    "Haid — mandi setelah darah haid berhenti dan telah suci.",
    "Nifas — mandi setelah darah nifas berhenti dan telah suci.",
    "Melahirkan (wiladah) — walaupun tidak keluar darah.",
    "Meninggal dunia — mandi jenazah (kecuali mati syahid).",
  ],
};

// Tata cara mandi yang sempurna (sunnah-sunnahnya).
export const MANDI_STEPS = [
  "Hilangkan dulu kotoran dan najis yang menempel di tubuh — bersihkan kemaluan dengan tangan kiri.",
  "Membaca basmalah, lalu membasuh kedua telapak tangan 3 kali, berkumur, dan membersihkan hidung (istinsyaq) 3 kali.",
  "Berwudhu seperti wudhu untuk shalat (boleh menunda membasuh kaki sampai akhir mandi).",
  "Hadirkan niat mandi wajib di hati bersamaan dengan air pertama yang menyentuh tubuh.",
  "Guyur kepala 3 kali sambil menyela-nyela rambut, pastikan air sampai ke kulit kepala.",
  "Siram tubuh bagian kanan (depan dan belakang), lalu bagian kiri (depan dan belakang), sambil menggosok tubuh.",
  "Pastikan air merata ke seluruh tubuh — ketiak, lipatan perut, pusar, telinga, sela-sela jari, dan semua lipatan kulit.",
];

// Niat mandi besar — lafaz menurut tuntunan fikih mazhab Syafi'i.
export const MANDI_NIAT: BacaanShalat[] = [
  {
    id: "niat-mandi-umum",
    title: "Niat Mandi Besar (Umum)",
    arabic: "نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul ghusla liraf'il hadatsil akbari fardhan lillaahi ta'aalaa.",
    translation: "Aku berniat mandi untuk menghilangkan hadats besar, fardhu karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Niat umum ini bisa dipakai untuk semua sebab mandi wajib — junub, mimpi basah, haid, maupun nifas.",
  },
  {
    id: "niat-mandi-junub",
    title: "Niat Mandi Junub",
    arabic: "نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْجِنَابَةِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul ghusla liraf'il hadatsil akbari minal jinaabati fardhan lillaahi ta'aalaa.",
    translation: "Aku berniat mandi untuk menghilangkan hadats besar dari janabah, fardhu karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i (lafaz junub — NU Online)",
    status: "Fikih Syafi'i",
    note: "Untuk mandi karena junub — keluar mani atau hubungan suami istri.",
  },
  {
    id: "niat-mandi-haid",
    title: "Niat Mandi Setelah Haid",
    arabic: "نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul ghusla liraf'il hadatsil akbari minal haidhi fardhan lillaahi ta'aalaa.",
    translation: "Aku berniat mandi untuk menghilangkan hadats besar dari haid, fardhu karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Untuk mandi setelah suci dari haid. Lafaznya mengikuti pola niat mandi yang sama, dengan menyebut sebabnya (haid).",
  },
  {
    id: "niat-mandi-nifas",
    title: "Niat Mandi Setelah Nifas",
    arabic: "نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ النِّفَاسِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul ghusla liraf'il hadatsil akbari minan nifaasi fardhan lillaahi ta'aalaa.",
    translation: "Aku berniat mandi untuk menghilangkan hadats besar dari nifas, fardhu karena Allah Ta'ala.",
    source: "Tuntunan fikih mazhab Syafi'i",
    status: "Fikih Syafi'i",
    note: "Untuk mandi setelah suci dari nifas (darah setelah melahirkan). Lafaznya mengikuti pola niat mandi yang sama, dengan menyebut sebabnya (nifas).",
  },
];
