import type { Dua } from "./dua-type";

// Katalog doa kematian, jenazah, dan pemakaman untuk aplikasi ABEE Muslim.
// Setiap teks Arab diverifikasi ke sumber tepercaya (sunnah.com, quran.com,
// Al-Adzkar Imam An-Nawawi, islamqa.info). Doa yang tidak bersumber dari
// riwayat khusus Rasulullah ﷺ diberi status "Doa umum" dan dijelaskan di note.
// Item "ahli-kubur" TIDAK dibuat entri terpisah: tidak ada teks khusus yang
// berbeda dari doa ziarah kubur, jadi digabung ke "ziarah-kubur".

export const DUAS_KEMATIAN: Dua[] = [
  {
    id: "kabar-kematian",
    title: "Doa Ketika Mendengar Berita Kematian",
    arabic:
      "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ\nأَعْظَمَ اللهُ أَجْرَكَ وَأَحْسَنَ عَزَاءَكَ وَغَفَرَ لِمَيِّتِكَ",
    latin:
      "Innaa lillaahi wa innaa ilaihi raaji'uun. A'zhomallaahu ajraka wa ahsana 'azaa'aka wa ghafara li mayyitika.",
    translation:
      "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Semoga Allah membesarkan pahalamu, membaguskan ketabahanmu, dan mengampuni orang yang meninggal darimu.",
    source:
      "QS Al-Baqarah: 156 (istirja'); ucapan takziah: Al-Adzkar Imam An-Nawawi, Bab Takziah",
    category: "kematian",
    status: "Shahih",
    note: "Dibaca saat mendengar kabar duka. Istirja' (Inna lillahi...) adalah ayat Al-Qur'an; sedangkan kalimat takziah 'A'zhomallahu ajraka...' bukan sabda Nabi ﷺ, melainkan ucapan yang dianjurkan Imam An-Nawawi dalam Al-Adzkar. Ucapan takziah terbaik yang shahih adalah: 'Inna lillahi ma akhadza wa lahu ma a'tha wa kullu syai'in 'indahu bi ajalim musamma, famurha faltashbir waltahtasib' (HR. Bukhari 1284, Muslim 923).",
  },
  {
    id: "sakaratul-maut",
    title: "Doa untuk Orang yang Sedang Sakaratul Maut",
    arabic: "لَا إِلَهَ إِلَّا اللهُ",
    latin: "Laa ilaaha illallaah.",
    translation: "Tidak ada Tuhan yang berhak disembah selain Allah.",
    source: "HR. Muslim 916",
    category: "kematian",
    status: "Shahih",
    note: "Talqin saat sakaratul maut: bisikkan kalimat 'Laa ilaaha illallaah' dengan lembut di dekat orang yang sedang menghadapi kematian, agar itu menjadi ucapan terakhirnya. Rasulullah ﷺ bersabda: 'Laqqinu mautakum laa ilaaha illallaah' (Talqinkanlah orang yang sedang menghadapi kematian di antara kalian dengan 'Laa ilaaha illallaah'). Jangan memaksa atau mengulang-ulang dengan keras; cukup sekali, lalu ulangi pelan bila ia berbicara lagi.",
  },
  {
    id: "talqin-mayit",
    title: "Doa Talqin Mayit (Setelah Pemakaman)",
    arabic:
      "يَا فُلَانَ بْنَ فُلَانَةَ، اذْكُرْ مَا خَرَجْتَ عَلَيْهِ مِنَ الدُّنْيَا شَهَادَةَ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، وَأَنَّكَ رَضِيتَ بِاللهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا وَبِالْقُرْآنِ إِمَامًا",
    latin:
      "Ya fulaan ibn fulaanah, udzkur maa kharajta 'alaihi minad dunyaa syahaadata an laa ilaaha illallaah, wa anna Muhammadan 'abduhu wa rasuuluhu, wa annaka radhiita billaahi rabban, wa bil islaami diinan, wa bi Muhammadin nabiyyan, wa bil qur'aani imaaman.",
    translation:
      "Wahai Fulan bin Fulanah, ingatlah (jawaban) yang engkau bawa keluar dari dunia: bersaksi bahwa tidak ada Tuhan selain Allah dan bahwa Muhammad adalah hamba dan utusan-Nya, dan bahwa engkau ridha Allah sebagai Tuhan, Islam sebagai agama, Muhammad sebagai Nabi, dan Al-Qur'an sebagai pedoman.",
    source: "HR. Ath-Thabarani, Al-Mu'jam Al-Kabir 7979",
    category: "kematian",
    status: "Dhaif",
    note: "Talqin SETELAH pemakaman ini berbeda dengan talqin saat sakaratul maut (Muslim 916) yang shahih. Hadis talqin setelah pemakaman ini dinilai dhaif oleh kebanyakan ulama (Syekh Al-Albani menilainya munkar; Al-Haitsami menyebut ada perawi yang tidak dikenal), meski sebagian ulama seperti Adh-Dhiya' Al-Maqdisi menguatkannya dan Ibnu Hajar menilainya layak diamalkan. Karena perselisihan ini, amalan ini tidak diwajibkan; yang disepakati sunnah setelah pemakaman adalah mendoakan ampunan dan keteguhan bagi mayit (lihat 'Doa Setelah Pemakaman').",
  },
  {
    id: "seseorang-meninggal",
    title: "Doa Ketika Seseorang Meninggal Dunia",
    arabic:
      "اللَّهُمَّ اغْفِرْ لِأَبِي سَلَمَةَ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّينَ وَاخْلُفْهُ فِي عَقِبِهِ فِي الْغَابِرِينَ وَاغْفِرْ لَنَا وَلَهُ يَا رَبَّ الْعَالَمِينَ وَافْسَحْ لَهُ فِي قَبْرِهِ وَنَوِّرْ لَهُ فِيهِ",
    latin:
      "Allaahummaghfir li [nama almarhum] warfa' darajatahu fil mahdiyyin, wakhlufhu fi 'aqibihi fil ghaabiriin, waghfir lanaa wa lahu yaa rabbal 'aalamiin, wafsah lahu fi qabrihi wa nawwir lahu fiihi.",
    translation:
      "Ya Allah, ampunilah [nama almarhum], angkatlah derajatnya di antara orang-orang yang mendapat petunjuk, gantikanlah ia bagi keturunannya yang ditinggalkan, ampunilah kami dan dia wahai Tuhan semesta alam, lapangkanlah kuburnya dan terangilah kuburnya.",
    source: "HR. Muslim 920",
    category: "kematian",
    status: "Shahih",
    note: "Doa yang dibaca Rasulullah ﷺ ketika Abu Salamah wafat, setelah beliau menutup kedua matanya. Ganti [nama almarhum] dengan nama orang yang meninggal; untuk perempuan, ganti dhamir -hu menjadi -ha (mis. 'laghfiri laha... darajataha...'). Dibaca saat seseorang baru saja meninggal, sambil menutup matanya dan hanya mengucapkan kebaikan, karena malaikat mengaminkan apa yang diucapkan.",
  },
  {
    id: "memandikan-mengafani-jenazah",
    title: "Doa Memandikan & Mengafani Jenazah",
    arabic:
      "أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    latin:
      "Astaghfirullaahal 'azhiim, alladzii laa ilaaha illaa huwal hayyul qayyuum, wa atuubu ilaih.",
    translation:
      "Aku memohon ampun kepada Allah Yang Maha Agung, yang tidak ada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.",
    source:
      "Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ",
    category: "kematian",
    status: "Doa umum",
    note: "Tidak ada bacaan khusus yang ditetapkan dari Rasulullah ﷺ untuk dibaca saat memandikan atau mengafani jenazah. Yang disyariatkan adalah tata caranya: memandikan dengan air (tiga, lima, atau tujuh kali, bilangan ganjil, diakhiri kapur barus) dan mengafani dengan kain putih bersih (HR. Bukhari 1253, 1264). Selama proses itu, yang dibaca adalah istighfar dan doa kebaikan umum untuk jenazah, seperti lafaz di atas.",
  },
  {
    id: "jenazah-takbir-pertama",
    title: "Bacaan Salat Jenazah Takbir Pertama",
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    latin:
      "Bismillaahir rahmaanir rahiim. Alhamdulillaahi rabbil 'aalamiin. Arrahmaanir rahiim. Maaliki yaumid diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinash shiraathal mustaqiim. Shiraathal ladziina an'amta 'alaihim ghairil maghdhuubi 'alaihim wa ladh dhaalliin.",
    translation:
      "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus. (Yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.",
    source: "QS Al-Fatihah: 1-7; HR. Bukhari 1335",
    category: "kematian",
    status: "Shahih",
    note: "Setelah takbir pertama, dibaca ta'awudz lalu surah Al-Fatihah (dibaca pelan/sir). Ibnu Abbas radhiyallahu 'anhuma membaca Al-Fatihah dengan suara agak keras dalam salat jenazah agar orang tahu bahwa itu sunnah (HR. Bukhari 1335). Niat salat jenazah cukup di dalam hati (salat fardhu kifayah untuk jenazah yang hadir di hadapan). Catatan mazhab: dalam mazhab Hanafi, setelah takbir pertama dibaca doa iftitah (Subhanakallahumma...) sebagai pengganti Al-Fatihah.",
  },
  {
    id: "jenazah-takbir-kedua",
    title: "Bacaan Salat Jenazah Takbir Kedua",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    latin:
      "Allaahumma shalli 'alaa Muhammad wa 'alaa aali Muhammad kamaa shallaita 'alaa Ibraahiim wa 'alaa aali Ibraahiim innaka hamiidum majiid. Allaahumma baarik 'alaa Muhammad wa 'alaa aali Muhammad kamaa baarakta 'alaa Ibraahiim wa 'alaa aali Ibraahiim innaka hamiidum majiid.",
    translation:
      "Ya Allah, limpahkanlah salawat kepada Muhammad dan keluarga Muhammad, sebagaimana Engkau telah melimpahkan salawat kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Muhammad dan keluarga Muhammad, sebagaimana Engkau telah memberkahi Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
    source: "HR. Bukhari 3370, Muslim 406",
    category: "kematian",
    status: "Shahih",
    note: "Setelah takbir kedua, dibaca salawat Ibrahimiyyah — salawat yang sama seperti dalam tasyahud salat biasa. Tidak ada rukuk dan sujud dalam salat jenazah; seluruhnya dilakukan sambil berdiri.",
  },
  {
    id: "jenazah-takbir-ketiga",
    title: "Bacaan Salat Jenazah Takbir Ketiga",
    arabic:
      "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ وَأَدْخِلْهُ الْجَنَّةَ وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ النَّارِ",
    latin:
      "Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu wa akrim nuzulahu wa wassi' madkhalahu waghsilhu bil maa'i wats tsalji wal barad, wa naqqihi minal khathaayaa kamaa naqqaitats tsaubal abyadha minad danas, wa abdilhu daaran khairan min daarihi, wa ahlan khairan min ahlihi, wa zaujan khairan min zaujihi, wa adkhilhul jannata wa a'idzhu min 'adzaabil qabri wa min 'adzaabin naar.",
    translation:
      "Ya Allah, ampunilah dia, rahmatilah dia, selamatkanlah dia, maafkanlah dia, muliakanlah tempat singgahnya, lapangkanlah kuburnya, cucilah dia dengan air, salju, dan embun beku, bersihkanlah dia dari kesalahan sebagaimana Engkau membersihkan pakaian putih dari kotoran, gantikanlah rumahnya dengan rumah yang lebih baik, keluarganya dengan keluarga yang lebih baik, pasangannya dengan pasangan yang lebih baik, masukkanlah dia ke dalam surga, dan lindungilah dia dari azab kubur dan azab neraka.",
    source: "HR. Muslim 963",
    category: "kematian",
    status: "Shahih",
    note: "Setelah takbir ketiga, dibaca doa untuk jenazah — ini adalah inti salat jenazah. Doa di atas adalah doa yang dihafal 'Auf bin Malik dari Rasulullah ﷺ. Untuk jenazah perempuan, ganti dhamir -hu menjadi -ha (mis. 'laghfiri laha warhamha...'). Bila belum hafal doa panjang ini, cukup membaca 'Allaahummaghfir lahu warhamhu' dengan ikhlas.",
  },
  {
    id: "jenazah-takbir-keempat",
    title: "Bacaan Salat Jenazah Takbir Keempat",
    arabic:
      "اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ وَاغْفِرْ لَنَا وَلَهُ",
    latin:
      "Allaahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lahu.",
    translation:
      "Ya Allah, janganlah Engkau halangi kami dari pahalanya (pahala mendoakannya dan bersabar atas kepergiannya), janganlah Engkau timpakan fitnah kepada kami setelahnya, dan ampunilah kami dan dia.",
    source: "HR. Abu Dawud 3201, Tirmidzi 1024, Ibnu Majah 1498",
    category: "kematian",
    status: "Shahih",
    note: "Kalimat 'Allaahumma laa tahrimna ajrahu wa laa taftinna ba'dahu' adalah bagian akhir doa jenazah riwayat Abu Hurairah (HR. Abu Dawud 3201, Tirmidzi 1024), dishahihkan Al-Albani; tambahan 'waghfir lana wa lahu' terdapat dalam lafaz Hisnul Muslim. Apakah ada doa setelah takbir keempat diperselisihkan mazhab: mazhab Syafi'i dan Maliki menganjurkan berdoa setelah takbir keempat (Imam Syafi'i menukil lafaz ini), sedangkan mazhab Hanafi dan Hanbali berpendapat tidak ada doa setelah takbir keempat, langsung salam. Setelah itu salam satu kali ke kanan (menurut sebagian ulama dua kali).",
  },
  {
    id: "mengantar-jenazah",
    title: "Doa Mengantar Jenazah",
    arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ",
    latin: "Allaahummaghfir lahu warhamhu.",
    translation: "Ya Allah, ampunilah dia dan rahmatilah dia.",
    source:
      "Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ",
    category: "kematian",
    status: "Doa umum",
    note: "Tidak ada bacaan khusus yang ditetapkan dari Rasulullah ﷺ untuk dibaca sambil mengantar/mengusung jenazah. Yang disyariatkan adalah mengantar jenazah dengan segera dan tenang, berjalan di belakang atau di samping usungan, serta tidak berbicara urusan dunia dan tidak membaca doa atau ayat dengan suara keras (makruh menurut sebagian ulama). Yang dibaca selama mengantar adalah istighfar dan doa kebaikan untuk jenazah secara pelan, seperti lafaz di atas (rangkaian awal doa Muslim 963, dipakai di sini sebagai doa umum, bukan sebagai bacaan khusus mengantar). Mengantar jenazah hingga pemakaman berpahala dua qirath (HR. Bukhari, Muslim).",
  },
  {
    id: "liang-lahat",
    title: "Doa Ketika Memasukkan Jenazah ke Liang Lahat",
    arabic: "بِسْمِ اللَّهِ وَعَلَى مِلَّةِ رَسُولِ اللَّهِ",
    latin: "Bismillaahi wa 'alaa millati rasulillaah.",
    translation:
      "Dengan nama Allah dan di atas agama (jalan) Rasulullah.",
    source: "HR. Ibnu Majah 1550; Abu Dawud 3213; Tirmidzi 1046",
    category: "kematian",
    status: "Shahih",
    note: "Dibaca oleh orang yang menurunkan jenazah ke dalam liang lahat, saat jenazah dibaringkan miring ke kanan menghadap kiblat. Ada dua riwayat lafaz yang sama-sama shahih menurut Al-Albani: 'wa 'alaa millati rasulillaah' (Ibnu Majah 1550, Tirmidzi 1046) dan 'wa 'alaa sunnati rasulillaah' (Abu Dawud 3213). Keduanya boleh dipakai.",
  },
  {
    id: "setelah-pemakaman",
    title: "Doa Setelah Pemakaman",
    arabic: "اللَّهُمَّ اغْفِرْ لَهُ، اللَّهُمَّ ثَبِّتْهُ",
    latin: "Allaahummaghfir lahu, Allaahumma tsabbithu.",
    translation:
      "Ya Allah, ampunilah dia. Ya Allah, teguhkanlah dia.",
    source: "HR. Abu Dawud 3221",
    category: "kematian",
    status: "Shahih",
    note: "Dibaca setelah pemakaman selesai, dengan berdiri di sisi kubur. Rasulullah ﷺ bila selesai menguburkan jenazah, beliau berdiri di kuburnya dan bersabda: 'Mohonkanlah ampunan untuk saudaramu dan mintakanlah keteguhan untuknya, karena sesungguhnya ia sekarang sedang ditanya (oleh malaikat).' (HR. Abu Dawud 3221, dishahihkan Al-Hakim dan disepakati Adz-Dzahabi, serta dishahihkan Al-Albani). Doa ini juga dibaca setelah salat jenazah bila tidak sempat dibaca di kubur. Inilah doa setelah pemakaman yang disepakati sunnah — berbeda dengan talqin setelah pemakaman yang diperselisihkan (lihat 'Doa Talqin Mayit').",
  },
  {
    id: "ziarah-kubur",
    title: "Doa Ziarah Kubur",
    arabic:
      "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ",
    latin:
      "Assalaamu 'alaikum ahlad diyaari minal mu'miniina wal muslimiin, wa innaa in syaa' Allaahu bikum laahiquun, as'alullaaha lanaa wa lakumul 'aafiyah.",
    translation:
      "Salam sejahtera atas kalian, wahai penghuni kampung (kubur) dari kalangan orang-orang mukmin dan muslim. Sesungguhnya kami — insya Allah — akan menyusul kalian. Aku memohon kepada Allah keselamatan untuk kami dan untuk kalian.",
    source: "HR. Muslim 975 (riwayat Buraidah); varian HR. Muslim 974 (riwayat 'Aisyah)",
    category: "kematian",
    status: "Shahih",
    note: "Dibaca saat memasuki pemakaman atau melewati kuburan kaum muslimin, sebagai salam kepada penghuni kubur sekaligus pengingat kematian bagi yang berziarah. Lafaz di atas adalah yang diajarkan Rasulullah ﷺ kepada para sahabat (Muslim 975); varian yang diajarkan kepada 'Aisyah (Muslim 974) menambah 'wa yarhamullaahul mustaqdimiina minnaa wal musta'khiriin' (semoga Allah merahmati orang-orang yang telah mendahului kami dan yang datang kemudian). Doa untuk ahli kubur tidak dibuat entri terpisah karena tidak ada teks khusus yang berbeda dari doa ziarah kubur ini — doa yang sama inilah yang dibaca untuk mendoakan ahli kubur, ditambah istighfar umum.",
  },
  {
    id: "kirim-doa-meninggal",
    title: "Doa Kirim Doa untuk Orang Meninggal",
    arabic:
      "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ",
    latin:
      "Rabbanaghfir lanaa wa li ikhwaninalladziina sabaquunaa bil iimaan, wa laa taj'al fii quluubinaa ghillal lilladziina aamanuu, rabbanaa innaka ra'uufur rahiim.",
    translation:
      "Ya Tuhan kami, ampunilah kami dan saudara-saudara kami yang telah mendahului kami dengan keimanan, dan janganlah Engkau jadikan dalam hati kami kedengkian terhadap orang-orang yang beriman. Ya Tuhan kami, sesungguhnya Engkau Maha Penyantun lagi Maha Penyayang.",
    source: "QS Al-Hasyr: 10",
    category: "kematian",
    status: "Shahih",
    note: "Doa Al-Qur'an yang dibaca untuk mengirim doa kepada orang yang telah meninggal, kapan saja dan di mana saja — bukan terikat waktu tertentu. Ayat ini adalah doa generasi yang datang sesudahnya untuk saudara seiman yang telah wafat mendahului mereka. Sangat cocok dibaca setelah salat, saat tahlilan, atau saat teringat kepada almarhum/almarhumah.",
  },
  {
    id: "ampunan-meninggal",
    title: "Doa Memohon Ampunan bagi Orang yang Telah Meninggal",
    arabic: "وَاسْتَغْفِرْ لِذَنْبِكَ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    latin: "Wastaghfir li dzambika wa lil mu'miniina wal mu'minaat.",
    translation:
      "Dan mohonlah ampunan atas dosamu dan (dosa) orang-orang mukmin laki-laki dan perempuan.",
    source: "QS Muhammad: 19",
    category: "kematian",
    status: "Shahih",
    note: "Ayat Al-Qur'an yang memerintahkan memohonkan ampunan bagi kaum mukminin dan mukminat — termasuk yang telah meninggal. Dibaca sebagai doa memohon ampunan bagi almarhum/almarhumah dan seluruh kaum mukminin. Dipilih ayat ini agar tidak duplikasi dengan 'Doa Kirim Doa untuk Orang Meninggal' (QS Al-Hasyr: 10); untuk doa istighfar umum bagi mukminin dengan lafaz hadis, lihat juga lafaz 'Allaahummaghfir lil mu'miniina wal mu'minaat...' (HR. Ath-Thabarani, dinilai hasan oleh Al-Albani) yang dipakai dalam selamatan 40 hari.",
  },
  {
    id: "selamatan-tujuh-hari",
    title: "Doa Selamatan Tujuh Hari",
    arabic:
      "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مَدْخَلَهُ",
    latin:
      "Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu wa akrim nuzulahu wa wassi' madkhalahu.",
    translation:
      "Ya Allah, ampunilah dia, rahmatilah dia, selamatkanlah dia, maafkanlah dia, muliakanlah tempat singgahnya, dan lapangkanlah kuburnya.",
    source:
      "Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ",
    category: "kematian",
    status: "Doa umum",
    note: "Doa yang biasa dibaca pada tahlilan 7 harian. Lafaz Arabnya adalah rangkaian awal doa jenazah (HR. Muslim 963) yang dipakai di sini sebagai doa umum dalam acara tahlilan, bukan sebagai bacaan yang ditetapkan khusus untuk hari ketujuh. Peringatan 7 hari adalah tradisi masyarakat (biasa dirangkai dengan pembacaan Yasin, tahlil, dan sedekah untuk almarhum); waktunya sendiri bukan ketentuan syariat, yang disyariatkan adalah mendoakan dan bersedekah untuk almarhum kapan saja.",
  },
  {
    id: "selamatan-empat-puluh-hari",
    title: "Doa Selamatan Empat Puluh Hari",
    arabic:
      "اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ",
    latin:
      "Allaahummaghfir lil muslimiina wal muslimaat, wal mu'miniina wal mu'minaat, al ahyaa'i minhum wal amwaat.",
    translation:
      "Ya Allah, ampunilah kaum muslimin dan muslimat, kaum mukminin dan mukminat, baik yang masih hidup maupun yang telah meninggal.",
    source:
      "HR. Ath-Thabarani, Musnad Asy-Syamiyyin 2118 (dinilai hasan oleh Al-Albani) — dipakai sebagai doa umum dalam tahlilan 40 harian",
    category: "kematian",
    status: "Doa umum",
    note: "Doa yang biasa dibaca pada tahlilan 40 harian. Lafaz istighfar untuk seluruh mukminin ini berasal dari hadis (Ath-Thabarani; Al-Albani menilainya hasan, Al-Haitsami menyebut sanadnya jayyid): siapa yang memohonkan ampunan bagi mukminin dan mukminat, Allah mencatat satu kebaikan untuk setiap mukmin. Namun peringatan 40 hari itu sendiri adalah tradisi masyarakat, bukan ketentuan syariat tentang waktunya — karena itu entri ini berstatus 'Doa umum'.",
  },
  {
    id: "selamatan-seratus-hari",
    title: "Doa Selamatan Seratus Hari",
    arabic:
      "اللَّهُمَّ اجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الْجَنَّةِ وَلَا تَجْعَلْ قَبْرَهُ حُفْرَةً مِنْ حُفَرِ النَّارِ",
    latin:
      "Allaahummaj'al qabrahu raudhatan min riyaadhil jannati wa laa taj'al qabrahu hufratan min hufarin naar.",
    translation:
      "Ya Allah, jadikanlah kuburnya taman dari taman-taman surga, dan janganlah Engkau jadikan kuburnya lubang dari lubang-lubang neraka.",
    source:
      "Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ",
    category: "kematian",
    status: "Doa umum",
    note: "Doa yang biasa dibaca pada tahlilan 100 harian. Peringatan 100 hari adalah tradisi masyarakat, bukan ketentuan syariat tentang waktunya; yang disyariatkan adalah mendoakan dan bersedekah untuk almarhum kapan saja. Lafaznya adalah permohonan umum yang dirangkai dari ungkapan yang dikenal luas tentang kubur sebagai taman surga atau lubang neraka.",
  },
  {
    id: "haul",
    title: "Doa Haul / Peringatan Wafat",
    arabic:
      "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَأَدْخِلْهُ الْجَنَّةَ بِغَيْرِ حِسَابٍ وَنَوِّرْ قَبْرَهُ وَوَسِّعْ قَبْرَهُ",
    latin:
      "Allaahummaghfir lahu warhamhu wa adkhilhul jannata bi ghairi hisaab, wa nawwir qabrahu wa wassi' qabrahu.",
    translation:
      "Ya Allah, ampunilah dia, rahmatilah dia, masukkanlah dia ke dalam surga tanpa hisab, terangilah kuburnya dan lapangkanlah kuburnya.",
    source:
      "Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ",
    category: "kematian",
    status: "Doa umum",
    note: "Doa yang biasa dibaca pada haul (peringatan wafat tahunan). Haul adalah tradisi masyarakat untuk mengenang dan mendoakan almarhum, biasa dirangkai dengan tahlilan, pembacaan Al-Qur'an, dan sedekah; tidak ada ketentuan syariat tentang peringatan tahunan tertentu. Lafaznya adalah rangkaian permohonan umum untuk almarhum, bukan riwayat khusus dari Rasulullah ﷺ.",
  },
];
