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

export type MenuEntry = { slug: string; label: string; icon: string; bg: string };

export const IBADAH_MENU: MenuEntry[] = [
  { slug: "doa", label: "Doa Harian", icon: "🤲", bg: "bg-amber-500" },
  { slug: "tasbih", label: "Tasbih Digital", icon: "📿", bg: "bg-teal-500" },
  { slug: "jadwal", label: "Jadwal Shalat", icon: "🕋", bg: "bg-indigo-500" },
  { slug: "ramadhan", label: "Road to Ramadhan", icon: "🌙", bg: "bg-pink-500" },
  { slug: "kalender", label: "Kalender Hijriyah", icon: "📅", bg: "bg-violet-500" },
  { slug: "shalat-wudhu", label: "Belajar Shalat & Wudhu", icon: "🕌", bg: "bg-emerald-500" },
  { slug: "dzikir", label: "Dzikir Harian", icon: "🌿", bg: "bg-green-500" },
  { slug: "tahlil", label: "Tahlil & Doa", icon: "🕯️", bg: "bg-yellow-500" },
  { slug: "masjid", label: "Masjid Terdekat", icon: "📍", bg: "bg-orange-500" },
  { slug: "kiblat", label: "Arah Kiblat", icon: "🧭", bg: "bg-sky-500" },
  { slug: "amal", label: "Amal Harian", icon: "✅", bg: "bg-lime-500" },
  { slug: "asmaul-husna", label: "Asmaul Husna", icon: "✨", bg: "bg-fuchsia-500" },
];

export const QURAN_MENU: MenuEntry[] = [
  { slug: "hafalan", label: "Hafalan Juz 30", icon: "📖", bg: "bg-emerald-500" },
  { slug: "hijaiyah", label: "Huruf Hijaiyah", icon: "ب", bg: "bg-teal-500" },
  { slug: "qari", label: "Suara & Qari", icon: "🎧", bg: "bg-sky-500" },
  { slug: "baca", label: "Baca Al-Qur'an", icon: "📗", bg: "bg-green-600" },
  { slug: "khatam", label: "Khatam Planner", icon: "🎯", bg: "bg-red-500" },
  { slug: "kelompok", label: "Kelompok Mengaji", icon: "👥", bg: "bg-violet-500" },
  { slug: "video", label: "Video Quotes Ayat", icon: "🎬", bg: "bg-amber-500" },
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
      "Sesungguhnya manusia benar-benar dalam kerugian,",
      "kecuali orang-orang yang beriman dan mengerjakan amal saleh serta saling menasihati dalam kebenaran dan kesabaran.",
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
      "Sesungguhnya Kami telah memberimu (Muhammad) nikmat yang banyak.",
      "Maka dirikanlah shalat karena Tuhanmu dan berkurbanlah.",
      "Sesungguhnya orang yang membencimu, dialah yang terputus (dari rahmat Allah).",
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
      "Katakanlah (Muhammad), 'Wahai orang-orang kafir,",
      "Aku tidak akan menyembah apa yang kamu sembah,",
      "dan kamu bukan penyembah Tuhan yang aku sembah,",
      "dan aku tidak pernah menjadi penyembah apa yang kamu sembah,",
      "dan kamu tidak pernah (pula) menjadi penyembah Tuhan yang aku sembah.",
      "Untukmu agamamu, dan untukku agamaku.'",
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
      "dan engkau melihat manusia berbondong-bondong masuk agama Allah,",
      "maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sesungguhnya Dia Maha Penerima tobat.",
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
      "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.",
      "Allah tempat meminta segala sesuatu.",
      "Dia tidak beranak dan tidak pula diperanakkan.",
      "Dan tidak ada sesuatu yang setara dengan Dia.'",
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
      "Katakanlah, 'Aku berlindung kepada Tuhan yang menguasai subuh (fajar),",
      "dari kejahatan makhluk yang Dia ciptakan,",
      "dari kejahatan malam apabila telah gelap gulita,",
      "dari kejahatan perempuan-perempuan (penyihir) yang meniup pada buhul-buhul (talinya),",
      "dan dari kejahatan orang yang dengki apabila dia dengki.'",
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
      "Katakanlah, 'Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia,",
      "Raja manusia,",
      "sembahan manusia,",
      "dari kejahatan (bisikan) setan yang bersembunyi,",
      "yang membisikkan (kejahatan) ke dalam dada manusia,",
      "dari (golongan) jin dan manusia.'",
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
  "Mengusap kepala 1 kali.",
  "Membasuh kedua telinga 1 kali.",
  "Membasuh kedua kaki sampai mata kaki 3 kali, kanan dulu.",
];

export const SHALAT_STEPS = [
  "Berdiri menghadap kiblat, niat shalat dalam hati.",
  "Takbiratul ihram: mengangkat kedua tangan sambil mengucap Allahu Akbar.",
  "Membaca doa iftitah, lalu Al-Fatihah, lalu surah pendek.",
  "Ruku: membungkuk dengan punggung lurus, baca Subhana rabbiyal 'azhim 3 kali.",
  "I'tidal: berdiri tegak, baca Sami'allahu liman hamidah.",
  "Sujud: dahi, hidung, kedua tangan, lutut, dan ujung kaki menyentuh lantai. Baca Subhana rabbiyal a'la 3 kali.",
  "Duduk di antara dua sujud, lalu sujud kedua.",
  "Berdiri untuk rakaat berikutnya. Pada rakaat terakhir, duduk tasyahud akhir lalu salam ke kanan dan ke kiri.",
];
