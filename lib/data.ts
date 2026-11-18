// Konten statis aplikasi. Semua teks Arab dan terjemahan adalah teks yang
// sudah dikenal luas (doa harian, dzikir, surah Juz 30). Tidak ada ayat yang
// dikarang — untuk surah di luar daftar ini, aplikasi mengambil dari
// AlQuran Cloud API saat runtime (lihat app/quran/baca).

export type Dua = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
};

export type IconName =
  | "hands"
  | "beads"
  | "mosque"
  | "moon"
  | "calendar"
  | "droplet"
  | "leaf"
  | "flame"
  | "pin"
  | "compass"
  | "check"
  | "star"
  | "book"
  | "book-open"
  | "headphones"
  | "target"
  | "users"
  | "play"
  | "home"
  | "search"
  | "settings"
  | "menu"
  | "close"
  | "chevron-right"
  | "arrow-left"
  | "clock"
  | "quote"
  | "bookmark"
  | "audio"
  | "eye"
  | "list"
  | "cap"
  | "trophy"
  | "medal"
  | "sun"
  | "half"
  | "alif";

export type MenuEntry = { slug: string; label: string; icon: IconName };

export const IBADAH_MENU: MenuEntry[] = [
  { slug: "doa", label: "Doa Harian", icon: "hands" },
  { slug: "yasin-tahlil", label: "Yasin & Tahlil", icon: "quote" },
  { slug: "tasbih", label: "Tasbih Digital", icon: "beads" },
  { slug: "jadwal", label: "Jadwal Shalat", icon: "mosque" },
  { slug: "ramadhan", label: "Road to Ramadhan", icon: "moon" },
  { slug: "kalender", label: "Kalender Hijriyah", icon: "calendar" },
  { slug: "shalat-wudhu", label: "Belajar Shalat & Wudhu", icon: "droplet" },
  { slug: "dzikir", label: "Dzikir Harian", icon: "leaf" },
  { slug: "tahlil", label: "Tahlil & Doa", icon: "flame" },
  { slug: "masjid", label: "Masjid Terdekat", icon: "pin" },
  { slug: "kiblat", label: "Arah Kiblat", icon: "compass" },
  { slug: "amal", label: "Amal Harian", icon: "check" },
  { slug: "asmaul-husna", label: "Asmaul Husna", icon: "star" },
];

export const QURAN_MENU: MenuEntry[] = [
  { slug: "hafalan", label: "Hafalan Juz 30", icon: "book" },
  { slug: "hijaiyah", label: "Huruf Hijaiyah", icon: "alif" },
  { slug: "qari", label: "Suara & Qari", icon: "headphones" },
  { slug: "baca", label: "Baca Al-Qur'an", icon: "book-open" },
  { slug: "khatam", label: "Khatam Planner", icon: "target" },
  { slug: "kelompok", label: "Kelompok Mengaji", icon: "users" },
  { slug: "video", label: "Video Quotes Ayat", icon: "play" },
];

export const DUAS: Dua[] = [
  {
    id: "bangun-tidur",
    title: "Doa Bangun Tidur",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur.",
    translation:
      "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.",
    source: "HR. Bukhari dan Muslim",
  },
  {
    id: "keluar-rumah",
    title: "Doa Keluar Rumah",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillaahi tawakkaltu 'alallaah, laa haula wa laa quwwata illaa billaah.",
    translation:
      "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
    source: "HR. Abu Dawud 5095, Tirmidzi 3426",
  },
  {
    id: "setelah-wudhu",
    title: "Doa Setelah Wudhu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    latin:
      "Asyhadu an laa ilaaha illallaah wahdahu laa syariika lah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allaahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin.",
    translation:
      "Aku bersaksi bahwa tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci.",
    source: "HR. Muslim 234, Tirmidzi 55",
  },
  {
    id: "qunut-subuh",
    title: "Doa Qunut Subuh",
    arabic:
      "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
    latin:
      "Allahummahdini fiman hadait, wa 'afini fiman 'afait, wa tawallani fiman tawallait, wa barik li fima a'thait, wa qini syarra ma qadhait, fa innaka taqdhi wa la yuqdha 'alaik, wa innahu la yadzillu man walait, wa la ya'izzu man 'adait, tabarakta rabbana wa ta'alait, fa lakal hamdu 'ala ma qadhait, wa astaghfiruka wa atubu ilaik, wa shallallahu 'ala sayyidina Muhammadin nabiyyil ummiyyi wa 'ala alihi wa shahbihi wa sallam.",
    translation:
      "Ya Allah, berilah aku petunjuk sebagaimana orang-orang yang telah Engkau beri petunjuk. Berilah aku kesehatan sebagaimana orang-orang yang telah Engkau beri kesehatan. Pimpinlah aku sebagaimana orang-orang yang telah Engkau pimpin. Berkahilah apa yang telah Engkau berikan kepadaku. Lindungilah aku dari keburukan yang telah Engkau tetapkan. Sungguh Engkau yang memutuskan dan tidak diputuskan atas-Mu. Tidak hina orang yang Engkau pimpin, dan tidak mulia orang yang Engkau musuhi. Maha Suci Engkau, Tuhan kami, dan Maha Tinggi. Segala puji bagi-Mu atas apa yang telah Engkau tetapkan. Aku memohon ampun dan bertaubat kepada-Mu. Semoga shalawat dan salam tercurah kepada Nabi Muhammad, nabi yang ummi, beserta keluarga dan sahabatnya.",
    source: "NU Online (Al-Adzkar Imam An-Nawawi); HR. Abu Dawud, Tirmidzi",
  },
  {
    id: "sebelum-makan",
    title: "Doa Sebelum Makan",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    latin: "Bismillaahi wa 'alaa barakatillaah.",
    translation: "Dengan nama Allah dan atas berkah Allah.",
    source: "HR. Abu Dawud, Tirmidzi",
  },
  {
    id: "sebelum-tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allaahumma amuutu wa ahyaa.",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    source: "HR. Bukhari",
  },
  {
    id: "masuk-masjid",
    title: "Doa Masuk Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allaahummaftah lii abwaaba rahmatik.",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    source: "HR. Muslim",
  },
];

export type Dzikir = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  count: number;
};

export const DZIKIR: Dzikir[] = [
  {
    id: "subhanallah",
    title: "Subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhaanallaah.",
    translation: "Maha Suci Allah.",
    count: 33,
  },
  {
    id: "alhamdulillah",
    title: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillaah.",
    translation: "Segala puji bagi Allah.",
    count: 33,
  },
  {
    id: "allahu-akbar",
    title: "Allahu Akbar",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allaahu Akbar.",
    translation: "Allah Maha Besar.",
    count: 33,
  },
  {
    id: "tahlil",
    title: "Laa ilaaha illallaah",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "Laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir.",
    translation:
      "Tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu.",
    count: 100,
  },
  {
    id: "subhanallah-bihamdih",
    title: "Subhanallah wa bihamdih",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    latin: "Subhaanallaahi wa bihamdih.",
    translation: "Maha Suci Allah dan segala puji bagi-Nya.",
    count: 100,
  },
  {
    id: "audzu-kalimatillah",
    title: "A'udzu bi kalimatillah",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "A'uudzu bi kalimaatillaahit taammaati min syarri maa khalaq.",
    translation:
      "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.",
    count: 3,
  },
];

export const TAHLIL_TEXT = {
  title: "Tahlil",
  arabic:
    "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  latin:
    "Laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa 'alaa kulli syai-in qadiir.",
  translation:
    "Tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya segala pujian. Dia menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.",
  note: "Tahlil dibaca berulang-ulang, umumnya 100 kali, sebagai dzikir dan doa untuk orang yang telah wafat.",
};

// ---------- Susunan bacaan tahlil (NU Online) ----------
// Sumber: NU Online, "Surat Yasin, Susunan Tahlil Singkat, dan Doa Arwah"
// (LBM PBNU, 11 Juni 2019) — dikutip lewat Telkomsel. Teks Arab disalin
// dari sumber tersebut; ejaan Latin disederhanakan mengikuti gaya aplikasi.
export type TahlilStep = {
  no: number;
  title: string;
  count?: string;
  arabic: string;
  latin: string;
  translation: string;
};

export const TAHLIL_STEPS: TahlilStep[] = [
  {
    no: 1,
    title: "Pengantar Al-Fatihah (Tawassul)",
    arabic:
      "إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَاٰلِهِ وَأَزْوَاجِهِ وَأَوْلَادِهِ وَذُرِّيَّاتِهِ الْفَاتِحَةُ\n\nثُمَّ إِلَى حَضْرَةِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالصَّحَابَةِ وَالتَّابِعِيْنَ وَالْعُلَمَاءِ الْعَامِلِيْنَ وَالْمُصَنِّفِيْنَ الْمُخْلِصِيْنَ وَجَمِيْعِ الْمَلَائِكَةِ الْمُقَرَّبِيْنَ، خُصُوْصًا إِلَى سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجِيْلَانِي وَخُصُوْصًا إِلَى مُؤَسِّسِيْ جَمْعِيَّةِ نَهْضَةِ الْعُلَمَاءِ الْفَاتِحَةُ\n\nثُمَّ إِلَى جَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ مِنْ مَشَارِقِ الْأَرْضِ إِلَى مَغَارِبِهَا بَرِّهَا وَبَحْرِهَا خُصُوْصًا إِلَى اٰبَائِنَا وَأُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا وَمَشَايِخِنَا وَمَشَايِخِ مَشَايِخِنَا وَأَسَاتِذَتِنَا وَأَسَاتِذَةِ أَسَاتِذَتِنَا وَلِمَنْ أَحْسَنَ إِلَيْنَا وَلِمَنِ اجْتَمَعْنَا هٰهُنَا بِسَبَبِهِ الْفَاتِحَةُ\n\nثُمَّ إِلَى جَمِيْعِ أَهْلِ الْقُبُوْرِ مِمَّنْ ذُكِرَتْ أَسْمَاؤُهُ فِيْ هٰذِهِ الرِّسَالَةِ حَضْرَةِ رُوْحِ … وَحَضْرَةِ رُوْحِ … وَحَضْرَةِ رُوْحِ … رَحِمَهُمُ اللهُ وَغَفَرَهُمْ، الْفَاتِحَةُ",
    latin:
      "Ila hadratin-nabiyyil-musthafa sayyidina Muhammadin shallallahu 'alaihi wa sallama wa alihi wa azwajihi wa awladihi wa dzurriyyatihi, al-Fatihah. Tsumma ila hadrati ikhwanihi minal-anbiya'i wal-mursalina wal-auliya'i wasy-syuhada'i wash-shalihina wash-shahabati wat-tabi'ina wal-'ulama'il-'amilina wal-mushannifinal-mukhlishina wa jami'il-malaikatil-muqarrabin, khushushan ila sayyidinasy-syaikh 'Abdil Qadir al-Jilani wa khushushan ila mu'assisi jam'iyyah Nahdlatil Ulama, al-Fatihah. Tsumma ila jami'i ahlil-quburi minal-muslimina wal-muslimati wal-mu'minina wal-mu'minati min masyariqil-ardhi ila magharibiha barriha wa bahriha, khushushan ila aba'ina wa ummahatina wa ajdadina wa jaddatina wa masyayikhina wa masyayikhi masyayikhina wa asatidzatina wa asatidzatina wa liman ahsana ilaina wa liman ijtama'na hahuna bisababihi, al-Fatihah. (Sebutkan nama arwah pada bagian keempat.)",
    translation:
      "Untuk yang terhormat Nabi Muhammad SAW, segenap keluarga, istri-istrinya, anak-anaknya, dan keturunannya; lalu kepada segenap saudara beliau dari kalangan para nabi, rasul, wali, syuhada, orang-orang saleh, sahabat, tabi'in, ulama yang mengamalkan ilmunya, ulama penulis yang ikhlas, dan semua malaikat Muqarrabin, terkhusus kepada Syekh Abdul Qadir al-Jilani dan para pendiri Nahdlatul Ulama; kemudian kepada semua ahli kubur Muslimin, Muslimat, Mukminin, Mukminat dari Timur ke Barat, baik di laut dan di darat, khususnya bapak kami, ibu kami, kakek kami, nenek kami, guru kami, pengajar dari guru kami, mereka yang telah berbuat baik kepada kami, dan bagi ahli kubur yang menjadi sebab kami berkumpul di sini; serta kepada arwah yang namanya disebutkan. Bacaan Al-Fatihah ini kami tujukan kepada Allah dan pahalanya untuk mereka semua. Al-Fatihah.",
  },
  {
    no: 2,
    title: "Surat Al-Fatihah",
    arabic:
      "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ. اَلْحَمْدُ لِلهِ رَبِّ الْعَالَمِيْنَ. اَلرَّحْمَنِ الرَّحِيْمِ. مَالِكِ يَوْمِ الدِّيْنِ. اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ. اِهْدِنَا الصِّرَاطَ الَّمُسْتَقِيْمَ. صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّالِّيْنَ. اَمِينْ",
    latin:
      "Bismillahirrahmanirrahim. Alhamdulillahi rabbil 'alamin. Ar-rahmanir-rahim. Maliki yaumiddin. Iyyaka na'budu wa iyyaka nasta'in. Ihdinash-shirathal-mustaqim. Shirathal-ladzina an'amta 'alaihim ghairil-maghdhubi 'alaihim wa ladh-dhallin. Amin.",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah. Hanya kepada-Mu pula kami memohon pertolongan. Tunjukkanlah kami ke jalan yang lurus, yaitu jalan orang-orang yang telah Kauanugerahi nikmat kepada mereka, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat. Semoga Kaukabulkan permohonan kami.",
  },
  {
    no: 3,
    title: "Surat Al-Ikhlas",
    count: "3x",
    arabic:
      "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ. قُلْ هُوَ اللهُ اَحَدٌ. اَللهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُوْلَدْ. وَلَمْ يَكٌنْ لَهُ كُفُوًا اَحَدٌ",
    latin:
      "Bismillahirrahmanirrahim. Qul huwallahu ahad, Allahush-shamad, lam yalid wa lam yulad, wa lam yakul lahu kufuwan ahad. (3 kali)",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Katakanlah, Dialah yang Maha Esa. Allah adalah Tuhan tempat bergantung oleh segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya. (3 kali)",
  },
  {
    no: 4,
    title: "Tahlil dan Takbir",
    arabic: "لاَ اِلَهَ اِلاَّ اللهُ وَاللهُ اَكْبَرُ",
    latin: "La ilaha illallah, Allahu Akbar.",
    translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah Maha Besar.",
  },
  {
    no: 5,
    title: "Surat Al-Falaq",
    count: "3x",
    arabic:
      "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ. قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِ. مِنْ شَرِّ مَا خَلَقَ. وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَ. وَمِنْ شَرِّ النَّفَاثاتِ فِى الْعُقَدِ. وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ",
    latin:
      "Bismillahirrahmanirrahim. Qul a'udzu bi rabbil-falaq. Min syarri ma khalaq. Wa min syarri ghasiqin idza waqab. Wa min syarrin-naffatsati fil-'uqad. Wa min syarri hasidin idza hasad. (3 kali)",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Katakanlah, 'Aku berlindung kepada Tuhan yang menguasai waktu subuh dari kejahatan makhluk-Nya. Dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang mengembus nafasnya pada buhul-buhul. Dan dari kejahatan orang-orang yang dengki apabila ia mendengki.' (3 kali)",
  },
  {
    no: 6,
    title: "Tahlil dan Takbir",
    arabic: "لاَ اِلَهَ اِلاَّ اللهُ وَاللهُ اَكْبَرُ",
    latin: "La ilaha illallah, Allahu Akbar.",
    translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah Maha Besar.",
  },
  {
    no: 7,
    title: "Surat An-Nas",
    count: "3x",
    arabic:
      "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ. قُلْ اَعُوْذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. اِلَهِ النَّاسِ. مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِى يُوَسْوِسُ فِى صُدُوْرِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ",
    latin:
      "Bismillahirrahmanirrahim. Qul a'udzu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min syarril-waswasil-khannas. Alladzi yuwaswisu fi shudurin-nas. Minal-jinnati wan-nas. (3 kali)",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Katakanlah, 'Aku berlindung kepada Tuhan manusia, Raja manusia, Sesembahan manusia, dari kejahatan bisikan setan yang biasa bersembunyi. Yang membisikkan kejahatan ke dalam dada manusia. Dari setan dan manusia.' (3 kali)",
  },
  {
    no: 8,
    title: "Tahlil dan Takbir",
    arabic: "لاَ اِلَهَ اِلاَّ اللهُ وَاللهُ اَكْبَرُ",
    latin: "La ilaha illallah, Allahu Akbar.",
    translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah Maha Besar.",
  },
  {
    no: 9,
    title: "Surat Al-Fatihah",
    arabic:
      "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ. اَلْحَمْدُ لِلهِ رَبِّ الْعَالَمِيْنَ. اَلرَّحْمَنِ الرَّحِيْمِ. مَالِكِ يَوْمِ الدِّيْنِ. اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ. اِهْدِنَا الصِّرَاطَ الَّمُسْتَقِيْمَ. صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّالِّيْنَ. اَمِينْ",
    latin:
      "Bismillahirrahmanirrahim. Alhamdulillahi rabbil 'alamin. Ar-rahmanir-rahim. Maliki yaumiddin. Iyyaka na'budu wa iyyaka nasta'in. Ihdinash-shirathal-mustaqim. Shirathal-ladzina an'amta 'alaihim ghairil-maghdhubi 'alaihim wa ladh-dhallin. Amin.",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah. Hanya kepada-Mu pula kami memohon pertolongan. Tunjukkanlah kami ke jalan yang lurus, yaitu jalan orang-orang yang telah Kauanugerahi nikmat kepada mereka, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat. Semoga Kaukabulkan permohonan kami.",
  },
  {
    no: 10,
    title: "Surat Al-Baqarah Ayat 1–5",
    arabic:
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، الۤمّۤ، ذٰلِكَ الْكِتٰبُ لَا رَيْبَ فِيْهِ هُدًى لِّلْمُتَّقِيْنَ، الَّذِيْنَ يُؤْمِنُوْنَ بِالْغَيْبِ وَيُقِيْمُوْنَ الصَّلٰوةَ وَمِمَّا رَزَقْنٰهُمْ يُنْفِقُوْنَ، وَالَّذِيْنَ يُؤْمِنُوْنَ بِمَآ اُنْزِلَ اِلَيْكَ وَمَآ اُنْزِلَ مِنْ قَبْلِكَ وَبِالْاٰخِرَةِ هُمْ يُوْقِنُوْنَ، اُولٰۤىِٕكَ عَلٰى هُدًى مِّنْ رَّبِّهِمْ وَاُولٰۤىِٕكَ هُمُ الْمُفْلِحُوْنَ",
    latin:
      "Bismillahirrahmanirrahim. Alif lam mim. Dzalikal-kitabu la raiba fihi, hudal-lilmuttaqin. Alladzina yu'minuna bil-ghaibi wa yuqimunash-shalata wa mimma razaqnahum yunfiqun. Wal-ladzina yu'minuna bima unzila ilaika wa ma unzila min qablika, wa bil-akhirati hum yuqinun. Ula'ika 'ala hudam-mir-rabbihim wa ula'ika humul-muflihun.",
    translation:
      "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang. Alif lam mim. Demikian itu kitab ini tidak ada keraguan padanya. Sebagai petunjuk bagi mereka yang bertakwa. Yaitu mereka yang beriman kepada yang gaib, yang mendirikan shalat, dan menafkahkan sebagian rezeki yang kami anugerahkan kepada mereka. Dan mereka yang beriman kepada kitab Al-Qur'an yang telah diturunkan kepadamu (Muhammad SAW) dan kitab-kitab yang telah diturunkan sebelumnya, serta mereka yakin akan adanya kehidupan akhirat. Mereka itulah yang tetap mendapat petunjuk dari Tuhannya. Merekalah orang-orang yang beruntung.",
  },
  {
    no: 11,
    title: "Surat Al-Baqarah Ayat 163",
    arabic: "وَاِلَهُكُمْ اِلَهٌ وَّاحِدٌ لاَ اِلَهَ اِلاَّ هُوَ الرَّحْمَنُ الرَّحِيْمُ",
    latin: "Wa ilahukum ilahun wahid, la ilaha illa huwar-rahmanur-rahim.",
    translation:
      "Dan Tuhan kalian adalah Tuhan yang Maha Esa. Tiada tuhan yang layak disembah kecuali Dia yang Maha Pengasih lagi Maha Penyayang.",
  },
  {
    no: 12,
    title: "Ayat Kursi (Surat Al-Baqarah Ayat 255)",
    arabic:
      "اللهُ لاَ اِلَهَ اِلاَّ هُوَ الْحَىُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَّهُ مَا فِى السَّمَوَاتِ وَمَا فِى الْاَرْضِ، مَنْ ذَا الَّذِى يَشْفَعُ عِنْدَهُ اِلاَّ بِاِذْنِهِ، يَعْلَمُ مَا بَينَ اَيْدِيْهِمِ وَمَا خَلْفَهُمْ، وَلاَ يُحِيْطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ اِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْاَرْضَ، وَلاَ يَئُودُهُ حِفْظُهُمُا، وَهُوَ الْعَلِىُّ الْعَظِيْمُ",
    latin:
      "Allahu la ilaha illa huwal-hayyul-qayyum, la ta'khudzuhu sinatun wa la naum, lahu ma fis-samawati wa ma fil-ardh, man dzal-ladzi yasyfa'u 'indahu illa bi idznih, ya'lamu ma baina aidihim wa ma khalfahum, wa la yuhithuna bi syai'im min 'ilmihi illa bima sya', wasi'a kursiyyuhus-samawati wal-ardh, wa la ya'uduhu hifzhuhuma, wa huwal-'aliyyul-'azhim.",
    translation:
      "Allah, tiada yang layak disembah kecuali Dia yang hidup kekal lagi berdiri sendiri. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi. Tiada yang dapat memberikan syafa'at di sisi-Nya kecuali dengan izin-Nya. Dia mengetahui apa yang ada di hadapan dan di belakang mereka. Mereka tidak mengetahui sesuatu dari ilmu-Nya kecuali apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat menjaga keduanya. Dia Maha Tinggi lagi Maha Agung.",
  },
  {
    no: 13,
    title: "Dzikir",
    arabic:
      "أَسْتَغْفِرُ اللهَ الْعَظِيْمَ ×٣\n\nأَفْضَلُ الذِّكْرِ فَاعْلَمْ أَنَّهُ لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَوْجُوْدٌ\n\nلَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَعْبُوْدٌ\n\nلَا إِلٰهَ إِلَّا اللهُ، حَيٌّ بَاقٍ\n\nلَا إِلٰهَ إِلَّا اللهُ ×١٠٠",
    latin:
      "Astaghfirullahal 'azhim (3 kali). Afdhaludz-dzikri fa'lam annahu la ilaha illallah, hayyun maujud. La ilaha illallah, hayyun ma'bud. La ilaha illallah, hayyun baqin. La ilaha illallah (100 kali).",
    translation:
      "Saya mohon ampun kepada Allah yang Maha Agung (3 kali). Sebaik-baik dzikir — ketahuilah — adalah lafal 'La ilaha illallah', tiada tuhan selain Allah, Dzat yang Mahahidup dan Wujud. Tiada tuhan selain Allah, Dzat yang Mahahidup dan disembah. Tiada tuhan selain Allah, Dzat yang Mahahidup dan kekal. Tiada tuhan selain Allah (100 kali).",
  },
  {
    no: 14,
    title: "Shalawat Nabi",
    count: "2x",
    arabic: "اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ اَللّٰهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ",
    latin: "Allahumma shalli 'ala sayyidina Muhammad, Allahumma shalli 'alaihi wa sallim. (2 kali)",
    translation:
      "Ya Allah, limpahkan rahmat takzim dan keselamatan kepada pemimpin kami, Nabi Muhammad. (2 kali)",
  },
  {
    no: 15,
    title: "Tasbih",
    arabic:
      "سُبْحَانَ اللهِ عَدَدَ مَا خَلَقَ اللهُ ×٧\n\nسُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيْمِ ×٣٣",
    latin:
      "Subhanallahi 'adada ma khalaqallah (7 kali). Subhanallahi wa bihamdihi, subhanallahil 'azhim (33 kali).",
    translation:
      "Mahasuci Allah sebanyak makhluk yang Allah ciptakan (7 kali). Mahasuci Allah dengan segala pujian untuk-Nya. Mahasuci Allah yang Mahaagung (33 kali).",
  },
  {
    no: 16,
    title: "Shalawat Nabi (Penutup)",
    count: "2x",
    arabic:
      "اَللّٰهُمَّ صَلِّ عَلَى حَبِيْبِكَ سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَسَلِّمْ ×٢\n\nاَللّٰهُمَّ صَلِّ عَلَى حَبِيْبِكَ سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَبَارِكْ وَسَلِّمْ أَجْمَعِيْنَ",
    latin:
      "Allahumma shalli 'ala habibika sayyidina Muhammadin wa 'ala alihi wa shahbihi wa sallim (2 kali). Allahumma shalli 'ala habibika sayyidina Muhammadin wa 'ala alihi wa shahbihi wa barik wa sallim ajma'in.",
    translation:
      "Ya Allah, limpahkan rahmat takzim dan keselamatan kepada kekasih-Mu, pemimpin kami, Nabi Muhammad, berikut keluarga dan sahabatnya (2 kali). Ya Allah, limpahkanlah rahmat kepada kekasih-Mu, pemimpin kami, Nabi Muhammad, berikut keluarga dan sahabatnya. Limpahkanlah pula berkah dan keselamatan kepada mereka semua.",
  },
];

// ---------- Doa Tahlil / Doa Arwah (NU Online) ----------
// Sumber: NU Online, "Surat Yasin, Susunan Tahlil Singkat, dan Doa Arwah"
// (LBM PBNU, 11 Juni 2019). Dibaca setelah rangkaian tahlil selesai.
export type DoaTahlilPart = {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
};

export const DOA_TAHLIL: DoaTahlilPart[] = [
  {
    title: "Pembuka: Ta'awudz, Basmalah, Hamdalah dan Shalawat",
    arabic:
      "أَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ، بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ، الْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ، حَمْدَ الشَّاكِرِيْنَ حَمْدَ النَّاعِمِيْنَ، حَمْدًا يُّوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيْدَهُ، يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِيْ لِجَلَالِ وَجْهِكَ وَعَظِيْمِ سُلْطَانِكَ، اللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَّعَلَى اٰلِ سَيِّدِنَا مُحَمَّدٍ",
    latin:
      "A'udzubillahi minasy-syaithanir-rajim, bismillahirrahmanirrahim, alhamdulillahi rabbil-'alamin, hamdasy-syakirin, hamdan-na'imin, hamdan yuwafi ni'amahu wa yukafi'u mazidah, ya rabbana lakal-hamdu kama yanbaghi li jalali wajhika wa 'azhimi sulthanik, Allahumma shalli 'ala sayyidina Muhammadin wa 'ala ali sayyidina Muhammadin.",
    translation:
      "Aku berlindung kepada Allah dari setan yang terkutuk. Dengan nama Allah yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam, sebagaimana orang-orang yang bersyukur dan orang yang memperoleh nikmat sama memuji, dengan pujian yang sesuai dengan nikmat-Nya dan memungkinkan ditambah nikmat-Nya. Tuhan kami, hanya bagi-Mu segala puji, sebagaimana yang patut terhadap kemuliaan-Mu dan keagungan-Mu. Ya Allah, limpahkanlah rahmat dan keselamatan kepada penghulu kami Nabi Muhammad dan kepada keluarganya.",
  },
  {
    title: "Mengirim Pahala Bacaan",
    arabic:
      "اَللّٰهُمَّ تَقَبَّلْ وَأَوْصِلْ ثَوَابَ مَا قَرَاْنَاهُ مِنَ الْقُرْآنِ الْعَظِيْمِ وَمَا هَلَّلْنَا وَمَا سَبَّحْنَا وَمَا اسْتَغْفَرْنَا وَمَا صَلَّيْنَا عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ هَدِيَّةً وَاصِلَةً وَرَحْمَةً نَازِلَةً وَبَرَكَةً شَامِلَةً إِلَى حَضَرَةِ حَبِيْبِنَا وَشَفِيْعِنَا وَقُرَّةِ أَعْيُنِنَا سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَإِلَى جَمِيْعِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالصَّحَابَةِ وَالتَّابِعِيْنَ وَالْعُلَمَاءِ الْعَامِلِيْنَ وَالْمُصَنِّفِيْنَ الْمُخْلِصِيْنَ وَجَمِيْعِ الْمُجَاهِدِيْنَ فِي سَبِيْلِ اللهِ رَبِّ الْعَلَمِيْنَ وَالْمَلَائِكَةِ الْمُقَرَّبِيْن، خُصُوْصًا إِلَى سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجِيْلَانِيّ، ثُمَّ إِلَى أَرْوَاحِ جَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ مِنْ مَشَارِقِ الْأَرْضِ وَمَغَارِبِهَا بَرِّهَا وَبَحْرِهَا خُصُوْصًا إِلَى آبَائِنَا وَاُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا، وَنَخَصُّ خَصُوْصًا إِلَى مَنِ اجْتَمَعْنَا هٰهُنَا بِسَبَبِهِ وَلِأَجْلِهِ",
    latin:
      "Allahumma taqabbal wa aushil tsawaba ma qara'nahu minal-qur'anil-'azhimi wa ma hallalna wa ma sabbahna wa mastaghfarna wa ma shallaina 'ala sayyidina Muhammadin shallallahu 'alaihi wa sallama hadiyyatan washilan wa rahmatan nazilan wa barakatan syamilatan ila hadrati habibina wa syafi'ina wa qurrati a'yunina sayyidina wa maulana Muhammadin shallallahu 'alaihi wa sallama, wa ila jami'i ikhwanihi minal-anbiya'i wal-mursalina wal-auliya'i wasy-syuhada'i wash-shalihina wash-shahabati wat-tabi'ina wal-'ulama'il-'amilina wal-mushannifinal-mukhlishina wa jami'il-mujahidina fi sabilillahi rabbil-'alamina wal-malaikatil-muqarrabin, khushushan ila sayyidinasy-syaikhi 'Abdil Qadir al-Jilani, tsumma ila arwahi jami'i ahlil-quburi minal-muslimina wal-muslimati wal-mu'minina wal-mu'minati min masyariqil-ardhi wa magharibiha barriha wa bahriha, khushushan ila aba'ina wa ummahatina wa ajdadina wa jaddatina, wa nakhushshu khushushan ila man ijtama'na hahuna bisababihi wa li ajlihi.",
    translation:
      "Ya Allah, terimalah dan sampaikanlah pahala ayat-ayat Al-Qur'an yang telah kami baca, tahlil kami, tasbih dan istighfar kami, dan bacaan shalawat kami kepada penghulu kami Nabi Muhammad SAW. Sebagai hadiah yang sampai, rahmat yang turun, dan berkah yang meliputi, kepada kekasih kami, penolong dan penyejuk mata kami, penghulu dan pemimpin kami, yaitu Nabi Muhammad SAW; kepada semua saudara beliau dari para nabi dan para utusan, kepada para wali, para syuhada, orang-orang saleh, para sahabat, dan tabi'in; kepada para ulama yang mengamalkan ilmunya, para penulis yang ikhlas, kepada semua pejuang di jalan Allah, Tuhan semesta alam; dan kepada para malaikat Muqarrabin, terutama Syekh Abdul Qadir al-Jilani; kemudian kepada arwah semua ahli kubur, Muslimin dan Muslimat, Mukminin dan Mukminat, dari Timur dan Barat, di darat dan di laut, terutama lagi kepada bapak-bapak kami, ibu-ibu kami, kakek-nenek kami, dan lebih terutama lagi kepada orang yang menyebabkan kami berkumpul di sini dan untuk keperluannya.",
  },
  {
    title: "Mohon Ampunan untuk Ahli Kubur",
    arabic:
      "اَللّٰهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ، اَللّٰهُمَّ أَنْزِلِ الرَّحْمَةَ وَالْمَغْفِرَةَ عَلَى أَهْلِ الْقُبُوْرِ مِنْ أَهْلِ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُوْلُ اللهِ",
    latin:
      "Allahummaghfir lahum warhamhum wa 'afihim wa'fu 'anhum, Allahumma anzilir-rahmata wal-maghfirata 'ala ahlil-quburi min ahli la ilaha illallahu Muhammadur-rasulullah.",
    translation:
      "Ya Allah, ampunilah mereka, kasihanilah mereka, sehatkanlah mereka, dan maafkanlah mereka. Ya Allah, turunkanlah rahmat dan ampunan kepada ahli kubur yang ahli mengucapkan 'La ilaha illallah, Muhammadur rasulullah' (Tidak ada tuhan selain Allah, Muhammad utusan Allah).",
  },
  {
    title: "Penutup",
    arabic:
      "رَبَّنَا أَرِنَا الْحَقَّ حَقًّا وَّارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَّارْزُقْنَا اجْتِنَابَهُ، رَبَّنَا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَّفِي الْآخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ، سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ وَسَلَامٌ عَلَى الْمُرْسَلِيْنَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَلَمِيْنَ، اَلْفَاتِحَة",
    latin:
      "Rabbana arinal-haqqa haqqan warzuqnat-tiba'ah, wa arinal-bathila bathilan warzuqnaj-tinabah. Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adzaban-nar. Subhana rabbika rabbil-'izzati 'amma yashifun, wa salamun 'alal-mursalin, wal-hamdulillahi rabbil-'alamin. Al-Fatihah.",
    translation:
      "Tuhan kami, tunjukkanlah kami kebenaran dengan jelas, jadikanlah kami pengikutnya; tunjukkanlah kami perkara batil dengan jelas, dan jadikanlah kami menjauhinya. Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan jagalah kami dari siksa api neraka. Maha Suci Tuhanmu, Tuhan yang Maha Mulia, dari sifat yang mereka berikan. Semoga keselamatan tetap tercurah kepada para utusan, dan segala puji bagi Allah, Tuhan semesta alam. Al-Fatihah.",
  },
];

export type AsmaulHusna = { no: number; arabic: string; latin: string; meaning: string };

export const ASMAUL_HUSNA: AsmaulHusna[] = [
  { no: 1, arabic: "اللَّهُ", latin: "Allah", meaning: "Nama Dzat yang disembah, Tuhan semesta alam" },
  { no: 2, arabic: "الرَّحْمَنُ", latin: "Ar-Rahman", meaning: "Yang Maha Pengasih" },
  { no: 3, arabic: "الرَّحِيمُ", latin: "Ar-Rahim", meaning: "Yang Maha Penyayang" },
  { no: 4, arabic: "الْمَلِكُ", latin: "Al-Malik", meaning: "Yang Maha Merajai" },
  { no: 5, arabic: "الْقُدُّوسُ", latin: "Al-Quddus", meaning: "Yang Maha Suci" },
  { no: 6, arabic: "السَّلَامُ", latin: "As-Salam", meaning: "Yang Maha Memberi Kesejahteraan" },
  { no: 7, arabic: "الْمُؤْمِنُ", latin: "Al-Mu'min", meaning: "Yang Maha Memberi Keamanan" },
  { no: 8, arabic: "الْمُهَيْمِنُ", latin: "Al-Muhaymin", meaning: "Yang Maha Memelihara" },
  { no: 9, arabic: "الْعَزِيزُ", latin: "Al-Aziz", meaning: "Yang Maha Perkasa" },
  { no: 10, arabic: "الْجَبَّارُ", latin: "Al-Jabbar", meaning: "Yang Maha Memaksa" },
  { no: 11, arabic: "الْمُتَكَبِّرُ", latin: "Al-Mutakabbir", meaning: "Yang Maha Megah" },
  { no: 12, arabic: "الْخَالِقُ", latin: "Al-Khaliq", meaning: "Yang Maha Pencipta" },
  { no: 13, arabic: "الْبَارِئُ", latin: "Al-Bari'", meaning: "Yang Maha Mengadakan" },
  { no: 14, arabic: "الْمُصَوِّرُ", latin: "Al-Mushawwir", meaning: "Yang Maha Membentuk Rupa" },
  { no: 15, arabic: "الْغَفَّارُ", latin: "Al-Ghaffar", meaning: "Yang Maha Pengampun" },
  { no: 16, arabic: "الْقَهَّارُ", latin: "Al-Qahhar", meaning: "Yang Maha Memaksa" },
  { no: 17, arabic: "الْوَهَّابُ", latin: "Al-Wahhab", meaning: "Yang Maha Pemberi Karunia" },
  { no: 18, arabic: "الرَّزَّاقُ", latin: "Ar-Razzaq", meaning: "Yang Maha Pemberi Rezeki" },
  { no: 19, arabic: "الْفَتَّاحُ", latin: "Al-Fattah", meaning: "Yang Maha Pembuka Rahmat" },
  { no: 20, arabic: "الْعَلِيمُ", latin: "Al-Alim", meaning: "Yang Maha Mengetahui" },
  { no: 21, arabic: "الْقَابِضُ", latin: "Al-Qabid", meaning: "Yang Maha Menyempitkan" },
  { no: 22, arabic: "الْبَاسِطُ", latin: "Al-Basit", meaning: "Yang Maha Melapangkan" },
  { no: 23, arabic: "الْخَافِضُ", latin: "Al-Khafid", meaning: "Yang Maha Merendahkan" },
  { no: 24, arabic: "الرَّافِعُ", latin: "Ar-Rafi'", meaning: "Yang Maha Meninggikan" },
  { no: 25, arabic: "الْمُعِزُّ", latin: "Al-Mu'izz", meaning: "Yang Maha Memuliakan" },
  { no: 26, arabic: "الْمُذِلُّ", latin: "Al-Mudhill", meaning: "Yang Maha Menghinakan" },
  { no: 27, arabic: "السَّمِيعُ", latin: "As-Sami'", meaning: "Yang Maha Mendengar" },
  { no: 28, arabic: "الْبَصِيرُ", latin: "Al-Bashir", meaning: "Yang Maha Melihat" },
  { no: 29, arabic: "الْحَكَمُ", latin: "Al-Hakam", meaning: "Yang Maha Menetapkan Hukum" },
  { no: 30, arabic: "الْعَدْلُ", latin: "Al-Adl", meaning: "Yang Maha Adil" },
  { no: 31, arabic: "اللَّطِيفُ", latin: "Al-Latif", meaning: "Yang Maha Lembut" },
  { no: 32, arabic: "الْخَبِيرُ", latin: "Al-Khabir", meaning: "Yang Maha Mengenal" },
  { no: 33, arabic: "الْحَلِيمُ", latin: "Al-Halim", meaning: "Yang Maha Penyantun" },
  { no: 34, arabic: "الْعَظِيمُ", latin: "Al-Azim", meaning: "Yang Maha Agung" },
  { no: 35, arabic: "الْغَفُورُ", latin: "Al-Ghafur", meaning: "Yang Maha Pengampun" },
  { no: 36, arabic: "الشَّكُورُ", latin: "Asy-Syakur", meaning: "Yang Maha Pembalas Budi" },
  { no: 37, arabic: "الْعَلِيُّ", latin: "Al-Aliyy", meaning: "Yang Maha Tinggi" },
  { no: 38, arabic: "الْكَبِيرُ", latin: "Al-Kabir", meaning: "Yang Maha Besar" },
  { no: 39, arabic: "الْحَفِيظُ", latin: "Al-Hafiz", meaning: "Yang Maha Memelihara" },
  { no: 40, arabic: "الْمُقِيتُ", latin: "Al-Muqit", meaning: "Yang Maha Pemberi Kecukupan" },
  { no: 41, arabic: "الْحَسِيبُ", latin: "Al-Hasib", meaning: "Yang Maha Membuat Perhitungan" },
  { no: 42, arabic: "الْجَلِيلُ", latin: "Al-Jalil", meaning: "Yang Maha Luhur" },
  { no: 43, arabic: "الْكَرِيمُ", latin: "Al-Karim", meaning: "Yang Maha Mulia" },
  { no: 44, arabic: "الرَّقِيبُ", latin: "Ar-Raqib", meaning: "Yang Maha Mengawasi" },
  { no: 45, arabic: "الْمُجِيبُ", latin: "Al-Mujib", meaning: "Yang Maha Mengabulkan" },
  { no: 46, arabic: "الْوَاسِعُ", latin: "Al-Wasi'", meaning: "Yang Maha Luas" },
  { no: 47, arabic: "الْحَكِيمُ", latin: "Al-Hakim", meaning: "Yang Maha Bijaksana" },
  { no: 48, arabic: "الْوَدُودُ", latin: "Al-Wadud", meaning: "Yang Maha Pencinta" },
  { no: 49, arabic: "الْمَجِيدُ", latin: "Al-Majid", meaning: "Yang Maha Mulia" },
  { no: 50, arabic: "الْبَاعِثُ", latin: "Al-Ba'ith", meaning: "Yang Maha Membangkitkan" },
  { no: 51, arabic: "الشَّهِيدُ", latin: "Asy-Syahid", meaning: "Yang Maha Menyaksikan" },
  { no: 52, arabic: "الْحَقُّ", latin: "Al-Haqq", meaning: "Yang Maha Benar" },
  { no: 53, arabic: "الْوَكِيلُ", latin: "Al-Wakil", meaning: "Yang Maha Memelihara" },
  { no: 54, arabic: "الْقَوِيُّ", latin: "Al-Qawiyy", meaning: "Yang Maha Kuat" },
  { no: 55, arabic: "الْمَتِينُ", latin: "Al-Matin", meaning: "Yang Maha Kokoh" },
  { no: 56, arabic: "الْوَلِيُّ", latin: "Al-Waliyy", meaning: "Yang Maha Melindungi" },
  { no: 57, arabic: "الْحَمِيدُ", latin: "Al-Hamid", meaning: "Yang Maha Terpuji" },
  { no: 58, arabic: "الْمُحْصِي", latin: "Al-Muhshi", meaning: "Yang Maha Menghitung" },
  { no: 59, arabic: "الْمُبْدِئُ", latin: "Al-Mubdi'", meaning: "Yang Maha Memulai" },
  { no: 60, arabic: "الْمُعِيدُ", latin: "Al-Mu'id", meaning: "Yang Maha Mengembalikan" },
  { no: 61, arabic: "الْمُحْيِي", latin: "Al-Muhyi", meaning: "Yang Maha Menghidupkan" },
  { no: 62, arabic: "الْمُمِيتُ", latin: "Al-Mumit", meaning: "Yang Maha Mematikan" },
  { no: 63, arabic: "الْحَيُّ", latin: "Al-Hayy", meaning: "Yang Maha Hidup" },
  { no: 64, arabic: "الْقَيُّومُ", latin: "Al-Qayyum", meaning: "Yang Maha Mandiri" },
  { no: 65, arabic: "الْوَاجِدُ", latin: "Al-Wajid", meaning: "Yang Maha Menemukan" },
  { no: 66, arabic: "الْمَاجِدُ", latin: "Al-Majid", meaning: "Yang Maha Mulia" },
  { no: 67, arabic: "الْوَاحِدُ", latin: "Al-Wahid", meaning: "Yang Maha Tunggal" },
  { no: 68, arabic: "الصَّمَدُ", latin: "As-Shamad", meaning: "Yang Maha Dibutuhkan" },
  { no: 69, arabic: "الْقَادِرُ", latin: "Al-Qadir", meaning: "Yang Maha Kuasa" },
  { no: 70, arabic: "الْمُقْتَدِرُ", latin: "Al-Muqtadir", meaning: "Yang Maha Berkuasa" },
  { no: 71, arabic: "الْمُقَدِّمُ", latin: "Al-Muqaddim", meaning: "Yang Maha Mendahulukan" },
  { no: 72, arabic: "الْمُؤَخِّرُ", latin: "Al-Mu'akhkhir", meaning: "Yang Maha Mengakhirkan" },
  { no: 73, arabic: "الْأَوَّلُ", latin: "Al-Awwal", meaning: "Yang Maha Awal" },
  { no: 74, arabic: "الْآخِرُ", latin: "Al-Akhir", meaning: "Yang Maha Akhir" },
  { no: 75, arabic: "الظَّاهِرُ", latin: "Az-Zahir", meaning: "Yang Maha Nyata" },
  { no: 76, arabic: "الْبَاطِنُ", latin: "Al-Batin", meaning: "Yang Maha Ghaib" },
  { no: 77, arabic: "الْوَالِي", latin: "Al-Wali", meaning: "Yang Maha Memerintah" },
  { no: 78, arabic: "الْمُتَعَالِي", latin: "Al-Muta'ali", meaning: "Yang Maha Tinggi" },
  { no: 79, arabic: "الْبَرُّ", latin: "Al-Barr", meaning: "Yang Maha Penderma" },
  { no: 80, arabic: "التَّوَّابُ", latin: "At-Tawwab", meaning: "Yang Maha Penerima Tobat" },
  { no: 81, arabic: "الْمُنْتَقِمُ", latin: "Al-Muntaqim", meaning: "Yang Maha Pemberi Balasan" },
  { no: 82, arabic: "الْعَفُوُّ", latin: "Al-Afuww", meaning: "Yang Maha Pemaaf" },
  { no: 83, arabic: "الرَّؤُوفُ", latin: "Ar-Ra'uf", meaning: "Yang Maha Pengasuh" },
  { no: 84, arabic: "مَالِكُ الْمُلْكِ", latin: "Malikul Mulk", meaning: "Yang Maha Menguasai Kerajaan" },
  { no: 85, arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ", latin: "Dzul Jalali wal Ikram", meaning: "Yang Maha Memiliki Keagungan dan Kemuliaan" },
  { no: 86, arabic: "الْمُقْسِطُ", latin: "Al-Muqsit", meaning: "Yang Maha Adil" },
  { no: 87, arabic: "الْجَامِعُ", latin: "Al-Jami'", meaning: "Yang Maha Mengumpulkan" },
  { no: 88, arabic: "الْغَنِيُّ", latin: "Al-Ghaniyy", meaning: "Yang Maha Kaya" },
  { no: 89, arabic: "الْمُغْنِي", latin: "Al-Mughni", meaning: "Yang Maha Memberi Kekayaan" },
  { no: 90, arabic: "الْمَانِعُ", latin: "Al-Mani'", meaning: "Yang Maha Mencegah" },
  { no: 91, arabic: "الضَّارُّ", latin: "Ad-Darr", meaning: "Yang Maha Pemberi Derita" },
  { no: 92, arabic: "النَّافِعُ", latin: "An-Nafi'", meaning: "Yang Maha Pemberi Manfaat" },
  { no: 93, arabic: "النُّورُ", latin: "An-Nur", meaning: "Yang Maha Bercahaya" },
  { no: 94, arabic: "الْهَادِي", latin: "Al-Hadi", meaning: "Yang Maha Memberi Petunjuk" },
  { no: 95, arabic: "الْبَدِيعُ", latin: "Al-Badi'", meaning: "Yang Maha Pencipta yang Tiada Banding" },
  { no: 96, arabic: "الْبَاقِي", latin: "Al-Baqi", meaning: "Yang Maha Kekal" },
  { no: 97, arabic: "الْوَارِثُ", latin: "Al-Warits", meaning: "Yang Maha Pewaris" },
  { no: 98, arabic: "الرَّشِيدُ", latin: "Ar-Rasyid", meaning: "Yang Maha Pandai" },
  { no: 99, arabic: "الصَّبُورُ", latin: "As-Shabur", meaning: "Yang Maha Penyabar" },
];

export type Hijaiyah = { arabic: string; name: string };

export const HIJAIYAH: Hijaiyah[] = [
  { arabic: "ا", name: "Alif" },
  { arabic: "ب", name: "Ba" },
  { arabic: "ت", name: "Ta" },
  { arabic: "ث", name: "Tsa" },
  { arabic: "ج", name: "Jim" },
  { arabic: "ح", name: "Ha" },
  { arabic: "خ", name: "Kha" },
  { arabic: "د", name: "Dal" },
  { arabic: "ذ", name: "Dzal" },
  { arabic: "ر", name: "Ra" },
  { arabic: "ز", name: "Zai" },
  { arabic: "س", name: "Sin" },
  { arabic: "ش", name: "Syin" },
  { arabic: "ص", name: "Shad" },
  { arabic: "ض", name: "Dhad" },
  { arabic: "ط", name: "Tha" },
  { arabic: "ظ", name: "Zha" },
  { arabic: "ع", name: "Ain" },
  { arabic: "غ", name: "Ghain" },
  { arabic: "ف", name: "Fa" },
  { arabic: "ق", name: "Qaf" },
  { arabic: "ك", name: "Kaf" },
  { arabic: "ل", name: "Lam" },
  { arabic: "م", name: "Mim" },
  { arabic: "ن", name: "Nun" },
  { arabic: "و", name: "Waw" },
  { arabic: "ه", name: "Ha" },
  { arabic: "ي", name: "Ya" },
];

export type SurahShort = {
  no: number;
  name: string;
  arabicName: string;
  ayahs: number;
  arabic: string[];
  translation: string[];
  video?: string;
};

export const JUZ30_SURAHS: SurahShort[] = [
  {
    no: 103,
    name: "Al-'Ashr",
    arabicName: "الْعَصْرِ",
    ayahs: 3,
    arabic: [
      "وَالْعَصْرِ",
      "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    ],
    translation: [
      "Demi masa.",
      "Sungguh, manusia berada dalam kerugian,",
      "kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.",
    ],
  },
  {
    no: 108,
    name: "Al-Kautsar",
    arabicName: "الْكَوْثَرِ",
    ayahs: 3,
    arabic: [
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    ],
    translation: [
      "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.",
      "Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah).",
      "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).",
    ],
  },
  {
    no: 109,
    name: "Al-Kafirun",
    arabicName: "الْكَافِرُونَ",
    ayahs: 6,
    arabic: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    ],
    translation: [
      "Katakanlah (Muhammad), \"Wahai orang-orang kafir!",
      "aku tidak akan menyembah apa yang kamu sembah,",
      "dan kamu bukan penyembah apa yang aku sembah,",
      "dan aku tidak pernah menjadi penyembah apa yang kamu sembah,",
      "dan kamu tidak pernah (pula) menjadi penyembah apa yang aku sembah.",
      "Untukmu agamamu, dan untukku agamaku.\"",
    ],
  },
  {
    no: 110,
    name: "An-Nasr",
    arabicName: "النَّصْرِ",
    ayahs: 3,
    arabic: [
      "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
      "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
      "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
    ],
    translation: [
      "Apabila telah datang pertolongan Allah dan kemenangan,",
      "dan engkau melihat manusia berbondong-bondong masuk agama Allah.",
      "maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat.",
    ],
    video: "https://youtube.com/shorts/3-FS1OiMGu4",
  },
  {
    no: 112,
    name: "Al-Ikhlas",
    arabicName: "الْإِخْلَاصِ",
    ayahs: 4,
    arabic: [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    ],
    translation: [
      "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.",
      "Allah tempat meminta segala sesuatu.",
      "(Allah) tidak beranak dan tidak pula diperanakkan.",
      "Dan tidak ada sesuatu yang setara dengan Dia.\"",
    ],
    video: "https://www.youtube.com/shorts/4Luw2oF6M-4",
  },
  {
    no: 113,
    name: "Al-Falaq",
    arabicName: "الْفَلَقِ",
    ayahs: 5,
    arabic: [
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مِن شَرِّ مَا خَلَقَ",
      "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    ],
    translation: [
      "Katakanlah, \"Aku berlindung kepada Tuhan yang menguasai subuh (fajar),",
      "dari kejahatan (makhluk yang) Dia ciptakan,",
      "dan dari kejahatan malam apabila telah gelap gulita,",
      "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),",
      "dan dari kejahatan orang yang dengki apabila dia dengki.\"",
    ],
    video: "https://youtube.com/shorts/mqCP5tvL2xo",
  },
  {
    no: 114,
    name: "An-Nas",
    arabicName: "النَّاسِ",
    ayahs: 6,
    arabic: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ",
    ],
    translation: [
      "Katakanlah, \"Aku berlindung kepada Tuhannya manusia,",
      "Raja manusia,",
      "sembahan manusia,",
      "dari kejahatan (bisikan) setan yang bersembunyi,",
      "yang membisikkan (kejahatan) ke dalam dada manusia,",
      "dari (golongan) jin dan manusia.\"",
    ],
    video: "https://youtube.com/shorts/JeNtPihTyXk",
  },
];

export type Qari = { id: string; name: string; edition: string };

export const QARIS: Qari[] = [
  { id: "alafasy", name: "Mishary Rashid Alafasy", edition: "ar.alafasy" },
  { id: "abdulbasit", name: "Abdul Basit", edition: "ar.abdulbasitmurattal" },
  { id: "ghamdi", name: "Saad Al-Ghamdi", edition: "ar.saoodshuraym" },
  { id: "muaiqly", name: "Maher Al-Muaiqly", edition: "ar.mahermuaiqly" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi", edition: "ar.minshawi" },
];

/** Audio satu surah penuh dari Islamic Network CDN. */
export function surahAudioUrl(edition: string, surahNo: number): string {
  return `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${surahNo}.mp3`;
}

export type Flashcard = { arabic: string; latin: string; en: string; id: string };

export const FLASHCARDS: Flashcard[] = [
  { arabic: "كِتَابٌ", latin: "Kitaabun", en: "Book", id: "Buku" },
  { arabic: "مَاءٌ", latin: "Maa-un", en: "Water", id: "Air" },
  { arabic: "شَمْسٌ", latin: "Syamsun", en: "Sun", id: "Matahari" },
  { arabic: "قَمَرٌ", latin: "Qamarun", en: "Moon", id: "Bulan" },
  { arabic: "بَيْتٌ", latin: "Baitun", en: "House", id: "Rumah" },
  { arabic: "مَسْجِدٌ", latin: "Masjidun", en: "Mosque", id: "Masjid" },
  { arabic: "قَلَمٌ", latin: "Qalamun", en: "Pen", id: "Pena" },
  { arabic: "سَيَّارَةٌ", latin: "Sayyaaratun", en: "Car", id: "Mobil" },
  { arabic: "شَجَرَةٌ", latin: "Syajaratun", en: "Tree", id: "Pohon" },
  { arabic: "طَائِرٌ", latin: "Thaa-irun", en: "Bird", id: "Burung" },
];

export const AMAL_HARIAN = [
  "Shalat Subuh berjamaah",
  "Shalat Dzuhur",
  "Shalat Ashar",
  "Shalat Maghrib",
  "Shalat Isya",
  "Baca Al-Qur'an",
  "Dzikir pagi / petang",
  "Sedekah hari ini",
  "Berbakti kepada orang tua",
  "Tidur lebih awal",
];

export const WUDHU_STEPS = [
  "Niat dalam hati, lalu membaca Bismillah.",
  "Membasuh kedua telapak tangan 3 kali.",
  "Berkumur-kumur 3 kali.",
  "Membersihkan hidung (istinsyaq) 3 kali.",
  "Membasuh wajah 3 kali, dari dahi sampai dagu.",
  "Membasuh kedua tangan sampai siku 3 kali, kanan dulu.",
  "Mengusap sebagian kepala 1 kali (cukup sebagian kepala, mis. ubun-ubun; mengusap seluruh kepala lebih utama).",
  "Membasuh kedua telinga 1 kali.",
  "Membasuh kedua kaki sampai mata kaki 3 kali, kanan dulu.",
  "Semua langkah dilakukan berurutan (tertib) — dalam mazhab Syafi'i, tertib termasuk rukun wudhu.",
];

export const SHALAT_STEPS = [
  "Berdiri menghadap kiblat, niat shalat dalam hati.",
  "Takbiratul ihram: mengangkat kedua tangan sambil mengucap Allahu Akbar.",
  "Membaca doa iftitah, lalu Al-Fatihah, lalu surah pendek.",
  "Ruku: membungkuk dengan punggung lurus, baca Subhana rabbiyal 'azhim 3 kali.",
  "I'tidal: berdiri tegak, baca Sami'allahu liman hamidah.",
  "Sujud: dahi, hidung, kedua tangan, lutut, dan ujung kaki menyentuh lantai. Baca Subhana rabbiyal a'la 3 kali.",
  "Duduk di antara dua sujud, lalu sujud kedua.",
  "Setelah sujud kedua rakaat kedua, duduk tasyahud awal (tahiyat awal), lalu berdiri untuk rakaat berikutnya.",
  "Pada shalat Subuh, setelah i'tidal rakaat kedua, membaca doa Qunut (sunnah muakkad menurut mazhab Syafi'i; lihat Doa Qunut di Doa Harian).",
  "Pada rakaat terakhir, duduk tasyahud akhir (tawarruk) lalu salam ke kanan dan ke kiri.",
];

// ---------- Mutiara Hari Ini ----------
// Kutipan-kutipan hadits yang dikenal luas. Diputar berdasarkan hari.
export const MUTIARA: { text: string; source: string }[] = [
  {
    text: "Kebaikan Islam seseorang tercermin dari kemampuannya meninggalkan hal-hal yang tidak berguna baginya.",
    source: "HR. Tirmidzi",
  },
  {
    text: "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya.",
    source: "HR. Bukhari",
  },
  {
    text: "Barang siapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju surga.",
    source: "HR. Muslim",
  },
  {
    text: "Kebersihan adalah sebagian dari iman.",
    source: "HR. Muslim",
  },
  {
    text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.",
    source: "HR. Ahmad",
  },
  {
    text: "Sesungguhnya Allah itu indah dan menyukai keindahan.",
    source: "HR. Muslim",
  },
  {
    text: "Barang siapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.",
    source: "HR. Bukhari dan Muslim",
  },
];

export function mutiaraHariIni(now = new Date()): { text: string; source: string } {
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return MUTIARA[day % MUTIARA.length];
}

// ---------- Fitur Utama (foto) ----------
// Foto dari Wikimedia Commons (sudah diverifikasi dapat diakses).
// Fallback: gradasi zamrud + pola geometris SVG (di komponen PhotoCard).
export type FiturUtama = { href: string; label: string; photo: string; credit: string };

export const FITUR_UTAMA: FiturUtama[] = [
  {
    href: "/quran/baca",
    label: "Al-Qur'an",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/The_Holy_Qur%27an_placed_on_a_Rehal_at_the_Abuja_National_Mosque.jpg/960px-The_Holy_Qur%27an_placed_on_a_Rehal_at_the_Abuja_National_Mosque.jpg",
    credit: "Al-Qur'an di atas rehal — Wikimedia Commons",
  },
  {
    href: "/ibadah/yasin-tahlil",
    label: "Yasin & Tahlil",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/A_Man_Reading_Holy_Quran_inside_the_Mosque.jpg/960px-A_Man_Reading_Holy_Quran_inside_the_Mosque.jpg",
    credit: "Membaca Al-Qur'an di masjid — Wikimedia Commons",
  },
  {
    href: "/ibadah/doa",
    label: "Doa Harian",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/A_Muslim_worshipper_raises_his_hands_in_sincere_supplication_%28du%E2%80%98a.jpg/960px-A_Muslim_worshipper_raises_his_hands_in_sincere_supplication_%28du%E2%80%98a.jpg",
    credit: "Tangan menengadah berdoa — Wikimedia Commons",
  },
  {
    href: "/ibadah/dzikir",
    label: "Dzikir",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/A_Qur%E2%80%99anic_teacher_sits_on_a_carpet_holding_a_tasbih_%28prayer_beads%29_while_teaching_the_Holy_Qur%E2%80%99an.jpg/960px-A_Qur%E2%80%99anic_teacher_sits_on_a_carpet_holding_a_tasbih_%28prayer_beads%29_while_teaching_the_Holy_Qur%E2%80%99an.jpg",
    credit: "Guru memegang tasbih — Wikimedia Commons",
  },
  {
    href: "/ibadah/tasbih",
    label: "Tasbih Digital",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Tasbih_or_prayer_beads.jpg/960px-Tasbih_or_prayer_beads.jpg",
    credit: "Tasbih — Wikimedia Commons",
  },
  {
    href: "/ibadah/jadwal",
    label: "Jadwal Shalat",
    photo:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Hassan_II_Mosque_and_Its_Minaret_at_Sunset_%E2%80%93_Casablanca%2C_Morocco.jpg/960px-Hassan_II_Mosque_and_Its_Minaret_at_Sunset_%E2%80%93_Casablanca%2C_Morocco.jpg",
    credit: "Masjid Hassan II saat senja — Wikimedia Commons",
  },
];

// ---------- Pembagian Juz & halaman mushaf ----------
// Batas awal setiap juz (surah:ayat) — pembagian standar mushaf Madinah.
export const JUZ_STARTS: { juz: number; surah: number; ayah: number }[] = [
  { juz: 1, surah: 1, ayah: 1 },
  { juz: 2, surah: 2, ayah: 142 },
  { juz: 3, surah: 2, ayah: 253 },
  { juz: 4, surah: 3, ayah: 93 },
  { juz: 5, surah: 4, ayah: 24 },
  { juz: 6, surah: 4, ayah: 148 },
  { juz: 7, surah: 5, ayah: 82 },
  { juz: 8, surah: 6, ayah: 111 },
  { juz: 9, surah: 7, ayah: 88 },
  { juz: 10, surah: 8, ayah: 41 },
  { juz: 11, surah: 9, ayah: 93 },
  { juz: 12, surah: 11, ayah: 6 },
  { juz: 13, surah: 12, ayah: 53 },
  { juz: 14, surah: 15, ayah: 1 },
  { juz: 15, surah: 17, ayah: 1 },
  { juz: 16, surah: 18, ayah: 75 },
  { juz: 17, surah: 21, ayah: 1 },
  { juz: 18, surah: 23, ayah: 1 },
  { juz: 19, surah: 25, ayah: 21 },
  { juz: 20, surah: 27, ayah: 56 },
  { juz: 21, surah: 29, ayah: 46 },
  { juz: 22, surah: 33, ayah: 31 },
  { juz: 23, surah: 36, ayah: 28 },
  { juz: 24, surah: 39, ayah: 32 },
  { juz: 25, surah: 41, ayah: 47 },
  { juz: 26, surah: 46, ayah: 1 },
  { juz: 27, surah: 51, ayah: 31 },
  { juz: 28, surah: 58, ayah: 1 },
  { juz: 29, surah: 67, ayah: 1 },
  { juz: 30, surah: 78, ayah: 1 },
];

// Halaman awal setiap juz pada mushaf Madinah (604 halaman).
export const JUZ_PAGE_STARTS: number[] = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322,
  342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

/** Juz tempat awal sebuah surah berada. */
export function juzOfSurah(surahNo: number): number {
  let juz = 1;
  for (const s of JUZ_STARTS) {
    if (s.surah <= surahNo) juz = s.juz;
    else break;
  }
  return juz;
}

/** Rentang nomor surah yang tercakup dalam satu juz (awal–akhir). */
export function surahsInJuz(juz: number): [number, number] {
  const start = JUZ_STARTS[juz - 1];
  if (juz >= 30) return [start.surah, 114];
  const next = JUZ_STARTS[juz];
  const end = next.ayah === 1 ? next.surah - 1 : next.surah;
  return [start.surah, Math.max(start.surah, end)];
}

/** Juz tempat sebuah halaman mushaf berada (1–604). */
export function juzForPage(page: number): number {
  const p = Math.min(604, Math.max(1, page));
  let juz = 1;
  for (let i = 0; i < JUZ_PAGE_STARTS.length; i++) {
    if (JUZ_PAGE_STARTS[i] <= p) juz = i + 1;
    else break;
  }
  return juz;
}

/** Rentang halaman mushaf untuk satu juz. */
export function pageRangeOfJuz(juz: number): [number, number] {
  const start = JUZ_PAGE_STARTS[juz - 1];
  const end = juz >= 30 ? 604 : JUZ_PAGE_STARTS[juz] - 1;
  return [start, end];
}
