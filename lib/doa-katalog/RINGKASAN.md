# RINGKASAN — Katalog Doa ABEE Muslim

Katalog doa lengkap untuk aplikasi ABEE Muslim. Ditulis 2026-11-20 oleh 12 peneliti kategori paralel, dikoordinasi dan divalidasi oleh koordinator riset. **Validasi akhir: `npx tsc --noEmit lib/doa-katalog/*.ts` lolos tanpa error; tidak ada id duplikat antar file; tidak ada judul duplikat.**

## Konvensi yang dipakai

- **Doa dari ayat Al-Qur'an dilabel "Shahih"** — teksnya otentik dari mushaf (bukan penilaian hadis), dengan penjelasan di `note`. Label "Doa umum" untuk ayat Qur'an akan salah, karena menyamakannya dengan doa susunan manusia.
- **"Doa umum"** hanya untuk doa yang TIDAK punya teks khusus dari Rasulullah ﷺ. `source`-nya memakai kalimat baku: *"Doa umum — disusun untuk memohon kebaikan, bukan riwayat khusus dari Rasulullah ﷺ"*. Jangan pernah mengklaim doa umum sebagai sunnah khusus (permintaan eksplisit Adam).
- Teks Arab TIDAK BOLEH dikarang — semua diverifikasi ke sunnah.com, quran.com, NU Online, Al-Adzkar, islamqa.info, dan kitab standar. Bila teks khusus tidak terverifikasi, dipakai teks terdekat yang terverifikasi dengan label jujur, atau dilabel "Doa umum".

## Jumlah per kategori

| Kategori | File | Total | Shahih | Hasan | Dhaif | Doa umum |
|---|---|---:|---:|---:|---:|---:|
| Doa sehari-hari | sehari-hari.ts | 26 | 12 | 9 | 3 | 2 |
| Doa setelah ibadah dan salat | ibadah.ts | 17 | 13 | 1 | 2 | 1 |
| Doa khusus bulan dan hari tertentu | bulan-hari.ts | 15 | 4 | 3 | 3 | 5 |
| Doa keluarga dan rumah tangga | keluarga.ts | 15 | 8 | 0 | 2 | 5 |
| Doa acara keagamaan dan tradisi masyarakat | tradisi.ts | 22 | 3 | 0 | 2 | 17 |
| Doa untuk orang sakit dan kesehatan | sakit.ts | 9 | 5 | 2 | 1 | 1 |
| Doa kematian, jenazah dan pemakaman | kematian.ts | 19 | 12 | 0 | 1 | 6 |
| Doa rezeki, pekerjaan dan usaha | rezeki.ts | 12 | 9 | 3 | 0 | 0 |
| Doa perlindungan dan keselamatan | perlindungan.ts | 13 | 12 | 1 | 0 | 0 |
| Doa hati, akhlak dan keimanan | hati.ts | 17 | 10 | 3 | 1 | 3 |
| Doa perjalanan dan haji umrah | perjalanan.ts | 13 | 6 | 2 | 2 | 3 |
| Doa dunia dan akhirat | akhirat.ts | 9 | 6 | 2 | 0 | 1 |
| **TOTAL** | | **187** | **100** | **26** | **17** | **44** |

Catatan jumlah: target awal ~190 item. Selisih 3 item karena 2 penggabungan yang didokumentasikan (lihat "Keputusan deduplikasi") dan 1 item yang tidak dibuat entri terpisah (niat salat jenazah hanya disebut di note takbir pertama).

## Pemetaan 17 doa tambahan Adam

| Doa tambahan | Masuk kategori | id | Status |
|---|---|---|---|
| Masuk pasar | sehari-hari | masuk-pasar | Hasan (diperselisihkan, lihat bawah) |
| Bercermin | sehari-hari | bercermin | Dhaif |
| Menakjubkan (melihat sesuatu yang menakjubkan) | sehari-hari | melihat-menakjubkan | Shahih (QS) |
| Musibah | perlindungan | musibah-bencana | Shahih (HR. Muslim 918) |
| Kehilangan barang | sehari-hari | kehilangan-barang | Shahih (HR. Muslim 918) |
| Ujian | hati | menghadapi-ujian | Shahih |
| Dimudahkan urusan | hati | dimudahkan-urusan | Shahih (QS Thaha: 25–28) |
| Kegagalan | hati | mengalami-kegagalan | Shahih (HR. Muslim 2664) |
| Tetangga | keluarga | tetangga | Doa umum |
| Muslimin-muslimat | hati | muslimin-muslimat | Hasan |
| Anak yatim | keluarga | anak-yatim | Doa umum |
| Gempa | perlindungan | gempa-bumi | Shahih (teks diganti, lihat bawah) |
| Pelangi | sehari-hari | melihat-pelangi | Doa umum |
| Kabar duka | kematian | kabar-kematian | Shahih (istirja' QS 2:156) |
| Nikmat (mendapat nikmat) | sehari-hari | mendapat-nikmat | Hasan |
| Fitnah dunia | perlindungan | dari-fitnah | Shahih |
| Husnul khatimah | akhirat | husnul-khatimah | Doa umum |

## Daftar "Doa umum" (44 item) + alasan

### sehari-hari (2)
- **menguap** — Tidak ada lafaz khusus dari Nabi ﷺ untuk menguap. Sunnah yang pasti hanya menahan + menutup mulut (Bukhari 6226, Muslim 2995). Ta'awwudz boleh dibaca kadang-kadang, tapi bukan sunnah khusus (Ibnu 'Utsaimin).
- **melihat-pelangi** — Tidak ditemukan teks khusus yang terverifikasi untuk melihat pelangi. Diisi tasbih umum yang sahih (Bukhari 6406, Muslim 2694) dengan note jelas bahwa ini doa umum.

### ibadah (1)
- **setelah-tarawih** — Tidak ada doa khusus setelah Tarawih dari hadis shahih (IslamQA 50718, Islamweb). Teks yang dipakai adalah doa yang umum dibaca umat Islam Indonesia setelah Tarawih; bagian keduanya mirip doa Aisyah (Ibnu Majah 3846, shahih) tetapi rangkaian ini sebagai "doa Tarawih" bukan riwayat khusus.

### bulan-hari (5)
- **awal-tahun-hijriah** — Tradisi; sumber Kanzun Najah / Maslakul Akhyar, bukan riwayat khusus dari Nabi ﷺ.
- **akhir-tahun-hijriah** — Tradisi; sumber yang sama seperti awal tahun.
- **sahur** — Niat sahur adalah formula fikih mazhab Syafi'i, bukan hadis.
- **hari-jumat** — Tidak ada doa khusus hari Jumat yang terverifikasi dari Nabi ﷺ; note menjelaskan waktu mustajab (Muslim 853, Abu Dawud 1048).
- **gerhana** — Tidak ada teks doa khusus dalam hadis saat gerhana; yang ada anjuran takbir + salat. Diisi panduan takbir + doa umum.

### keluarga (5)
- **untuk-suami, untuk-istri, untuk-anak, tetangga, anak-yatim** — Tidak ada teks khusus dari Nabi ﷺ untuk masing-masing; diisi doa umum memohon kebaikan untuk mereka.

### tradisi (17)
- **tingkepan, pemberian-nama-anak, selamatan-syukuran, selamatan-rumah-baru, selamatan-kelahiran, selamatan-kehamilan, selamatan-pernikahan, walimatul-safar, syukuran-kendaraan-baru, syukuran-usaha-baru, syukuran-panen, syukuran-kelulusan, syukuran-ulang-tahun, pembukaan-acara, sebelum-belajar, sesudah-belajar, memulai-pengajian** — Semua tradisi masyarakat / acara; tidak ada riwayat marfu' khusus. Sebelum/sesudah belajar: doa sesudah-belajar adalah ijazah KH. Ali Maksum Krapyak. Khotmil Quran TIDAK termasuk di sini sebagai Doa umum — ia dilabel Dhaif (lihat bawah).

### sakit (1)
- **operasi** — Tidak ada doa khusus dari Nabi ﷺ untuk operasi; diisi doa umum memohon kesembuhan dan kelancaran.

### kematian (6)
- **memandikan-mengafani-jenazah** — Tidak ada bacaan khusus dari Rasulullah ﷺ untuk memandikan/mengafani; yang ada hanya tata caranya (Bukhari 1253, 1264). Teks diisi istighfar umum.
- **mengantar-jenazah** — Tidak ada bacaan khusus saat mengusung jenazah (yang ada: anjuran mengantar segera, tenang, tidak membaca dengan suara keras). Teks diisi rangkaian awal doa Muslim 963 sebagai doa umum.
- **selamatan-tujuh-hari, selamatan-empat-puluh-hari, selamatan-seratus-hari, haul** — Tradisi tahlilan 7/40/100 harian dan peringatan tahunan; lafaznya rangkaian doa umum (istighfar mukminin, permohonan kubur sebagai taman surga).

### hati (3)
- **dijauhkan-sombong, dijauhkan-iri-dengki** — Tidak ada teks khusus yang terverifikasi.
- **menghafal-quran** — Teks populer "fahman nabiyyin…" TIDAK punya dasar dalam sunnah per IslamQA / Lajnah Daimah — bukan sekadar dhaif, tapi tidak berdasar. Diisi doa umum.

### perjalanan (3)
- **masuk-makkah** — Tidak ada doa khusus dari Nabi ﷺ untuk masuk kota Makkah (yang ada hanya doa masuk masjid, HR. Muslim 713, saat masuk Masjidil Haram).
- **multazam** — Tidak ada doa khusus dari Nabi ﷺ di Multazam (IslamQA: riwayat dari sahabat lebih kuat daripada yang dinisbatkan kepada Nabi). Note menjelaskan Multazam tempat mustajab (atsar Ibnu Abbas RA) dan adab tidak berdesakan.
- **muzdalifah** — Tidak ada lafaz khusus yang diriwayatkan; hadis Jabir (Muslim 1218) hanya menyebut Nabi ﷺ berdoa, bertakbir, dan bertahlil di Masy'aril Haram. Diisi empat kata zikir (takbir, tahlil, tahmid, tasbih).

### akhirat (1)
- **husnul-khatimah** — Lafaz panjang populer "Allaahummaj'al khaira 'umrii aakhirahu..." sebagai hadis marfu' dari Anas adalah **dhaif jiddan** (Al-Haythami: ada Abu Malik An-Nakha'i yang dhaif; takhrij Tariq Hijazi merinci tiga cacat). Dipakai lafaz umum "Allaahumma innii as-aluka husnal khaatimah" dengan source jujur "Doa umum".

## Item yang statusnya diperselisihkan (semua dijelaskan di `note` masing-masing)

- **masuk-pasar (Hasan)** — Al-Albani/Mundziri/Hakim hasan–sahih vs Abu Hatim/Ibnu al-Madini munkar, Darussalam dhaif; janji "sejuta kebaikan" juga diperselisihkan.
- **masuk-rumah (Dhaif)** — Al-Albani dhaif (mursal) vs Ibnu Baz & Ibnu Muflih hasan; sunnah yang pasti: Bismillah + salam (Muslim 2018).
- **bercermin (Dhaif)** — Lafaznya sendiri sahih sebagai doa umum (Ahmad 24392; Shahih al-Jami' 1307), tetapi kaitan khususnya dengan cermin dhaif di semua jalur (Al-Albani, Irwa' 74).
- **keluar-kamar-mandi (Hasan)** — Tirmidzi hasan gharib vs Al-Albani/An-Nawawi sahih.
- **sebelum-wudu (Hasan)** — Al-Albani hasan/sahih vs Imam Ahmad ("tidak ada hadits yang kuat dalam bab ini"); jumhur: sunnah, bukan wajib.
- **melepas-pakaian (Hasan)** — Lafaz Tirmidzi 606 hanya "Bismillah"; penilaian terbelah (dhaif Darussalam, sahih Al-Albani).
- **mendapat-nikmat (Hasan)** — Nawawi/Al-Albani/Arna'uth hasan vs Darussalam dhaif, Hakim sahih.
- **kabar-baik (Hasan)** — Sujud syukur hasan (Tirmidzi 1578).
- **setelah-magrib (Dhaif)** — Al-Albani dhaif (Silsilah ad-Da'ifah 1624); IslamQA fatwa 6544 menyatakan tidak disunnahkan sebagai ritual khusus; tetapi Imam An-Nawawi memasukkannya dalam Al-Adzkar. Alternatif shahih (Tirmidzi 2572, 3x) dicantumkan.
- **setelah-hajat (Dhaif)** — At-Tirmidzi sendiri menyebutnya gharib dan bermasalah sanadnya; Al-Albani menilainya dhaif jiddan.
- **rumah-baru (Dhaif)** — Al-Albani dhaif vs Ibnu Baz/Ibnu Muflih hasan; note mengarahkan ke amalan yang pasti sunnah: bismillah + salam (Muslim 2018).
- **bayi-baru-lahir (Dhaif)** — Lafaz dari Hasan Al-Bashri di Al-Adzkar, sanad dhaif/sangat lemah (Haytham ibn Jammaz).
- **anak-pintar-akhlak** — Bukhari 143 hanya memuat "Allahumma faqqihhu fid din"; tambahan "wa 'allimhut ta'wil" dari Musnad Ahmad 2397/2879.
- **memasuki-ramadan (Dhaif)** dan **menyambut-ramadan (Dhaif)** — Dua entri terpisah (teks & momen berbeda); lafaz memasuki memakai "wa tasallamhu minni mutaqabbala" (Thabrani 912).
- **rajab-syakban (Dhaif)** — Doa Rajab–Syakban.
- **berbuka-puasa (Hasan)** — Versi "Allahumma laka shumtu..." adalah Dhaif/mursal; yang dipakai versi hasan.
- **menjelang-idulfitri / menjelang-iduladha (Shahih)** — Lafaz takbirnya atsar sahabat (Ibnu Mas'ud; Salman Al-Farisi), bukan sabda Nabi ﷺ.
- **penutup-majelis (Shahih)** — Tirmidzi hasan shahih gharib, Al-Albani shahih; Bukhari mengkritik satu jalur sebagai ma'lul — dicatat di note.
- **khotmil-quran (Dhaif)** — "Allahummarhamna bil Qur'an" TIDAK tsabit sebagai doa khatam Nabi ﷺ (mu'dhal); yang tsabit hanya doa umum setelah khatam (atsar Anas).
- **aqiqah (Dhaif)** — Doa aqiqah.
- **memohon-kesehatan (Hasan)** — Al-Albani hasan vs sebagian ulama mendhaifkan (Ja'far bin Maimun).
- **menjenguk (Hasan)** — Tirmidzi hasan gharib vs Al-Albani Shahih.
- **sakit-parah** — Lafaz diperbaiki ke "idza kanatil wafatu" (Bukhari 5671 / Muslim 2680).
- **talqin-mayit (Dhaif)** — Hadis Thabrani 7979 dinilai dhaif oleh kebanyakan ulama (Al-Albani: munkar; Al-Haitsami: ada perawi tak dikenal), tapi Adh-Dhiya' Al-Maqdisi menguatkannya dan Ibnu Hajar menilainya layak. Dibedakan tegas dari talqin sakaratul maut (Muslim 916, shahih).
- **jenazah-takbir-keempat (Shahih)** — Lafaznya shahih (Abu Dawud 3201 / Tirmidzi 1024), tapi apakah ada doa setelah takbir keempat diperselisihkan mazhab: Syafi'i/Maliki menganjurkan, Hanafi/Hanbali tidak.
- **liang-lahat (Shahih)** — Dua lafaz sama-sama shahih menurut Al-Albani: "wa 'alaa millati rasulillaah" (Ibnu Majah 1550, Tirmidzi 1046 — dipakai sebagai teks utama) dan "wa 'alaa sunnati rasulillaah" (Abu Dawud 3213 — disebut di note).
- **muslimin-muslimat (Hasan)** — Nomor "Shahih al-Jami' 6026" dari brief TIDAK bisa dikonfirmasi — dihapus; status Hasan (Al-Albani), sumber Thabrani Musnad asy-Syamiyyin 2118.
- **hati-istiqamah (Hasan)** — Darussalam hasan vs Al-Albani Shahih.
- **iman-dikuatkan (Hasan)** — Lafaznya formulasi dari hadis, bukan lafaz literal.
- **menghilangkan-kesedihan (Dhaif)** — Abu Dawud 1555 dinilai Dhaif oleh Al-Albani (Ghassan bin 'Auf dilemahkan); lafaz serupa yang shahih ada di Bukhari 6369.
- **melunasi-utang (Hasan)** — At-Tirmidzi "hasan gharib", Al-Albani hasan, tetapi Al-Hakim mensahihkannya.
- **terhindar-kemiskinan (Hasan)** — Al-Albani menilai sanad Abu Dawud hasan; riwayat An-Nasa'i di dubur salat dinilai sahih isnadnya oleh Al-Albani.
- **usaha-berkembang (Hasan)** — At-Tirmidzi hasan, An-Nawawi "hasan sahih", Al-Albani mensahihkan lafaz doanya; tetapi Ibnul Jauzi menilainya tidak sahih (perawi 'Umarah bin Hadid majhul).
- **merasa-takut (Hasan)** — Lafaz dengan "wa 'iqabihi" (Tirmidzi 3528): At-Tirmidzi hasan gharib, Al-Albani hasan, sebagian ulama menilai dhaif; riwayat Abu Dawud 3893 tanpa kata itu dinilai dhaif oleh Darussalam. Larangan menggantungkan tulisan doa sebagai jimat (bagian itu dinilai dhaif) dicatat di note.
- **dari-setan (Shahih)** — Kandidat lafaz panjang "as-sami'il 'alim" (Tirmidzi 2922) diperselisihkan (hasan gharib vs dhaif, perawi Khalid bin Tahman) — diganti dengan lafaz yang disepakati: A'udzu billahi minasy syaithanir rajim (QS An-Nahl: 98; Tirmidzi 3452, shahih).
- **wabah-penyakit (Shahih)** — At-Tirmidzi hasan shahih gharib, Al-Albani shahih via Abu Dawud 5088.
- **kejahatan-manusia (Shahih)** — Abu Dawud 5094: Al-Albani shahih, At-Tirmidzi hasan shahih.
- **dari-fitnah (Shahih)** — Teks lengkap empat perlindungan dipakai dari Muslim 588; kandidat di brief menghilangkan 'adzab jahannam, jadi dilengkapi sesuai riwayat.
- **tiba-tujuan (Hasan)** — Al-Hakim shahih (disetujui Adz-Dzahabi), Ibnu Hajar hasan, Ibnu Baz menyebut sanad An-Nasa'i baik. Dipakai lafaz LENGKAP (Nasa'i al-Kubra 8775), bukan hanya potongan ekor.
- **melihat-kabah (Dhaif)** — Lafaz ini atsar Umar RA; riwayat marfu' kepada Nabi ﷺ dinilai dhaif; tidak ada hadis shahih tentang doa khusus saat melihat Ka'bah (Islamweb).
- **melempar-jumrah (Dhaif)** — Takbir tiap lemparan tsabit (Bukhari 1750; Muslim 1218) dan berdiri lama berdoa tanpa lafaz khusus setelah jumrah 1–2 tsabit (Nasa'i 3083, shahih). Lafaz panjang "Allaahummaj'alhu…" dari atsar Ibnu Umar/Ibnu Mas'ud yang sanadnya diperselisihkan (ada perawi dhaif).
- **mina (Shahih, dengan catatan)** — Lafaz takbir tasyrik adalah atsar Ibnu Mas'ud RA dengan sanad shahih, tetapi TIDAK ada lafaz takbir yang tsabit langsung dari Nabi ﷺ (Ibnu Hajar, Fath al-Bari).
- **tawaf (Hasan)** — Empat kalimat pertama ada dalam Muslim 2137; gabungan lima kalimat dinilai hasan oleh At-Tirmidzi dan Al-Albani.
- **melepas-bepergian (Shahih)** — At-Tirmidzi sendiri menilai "hasan shahih" (Tirmidzi 3443; Abu Dawud 2600).
- **sakaratul-maut-sendiri (Hasan)** — Imam Tirmidzi menyebut hadis ini gharib, tetapi Darussalam dan Syaikh Al-Arnaut menilainya hasan.
- **keselamatan-kiamat (Hasan)** — Ibnu Katsir: hasan; Al-Haythami: perawinya tsiqat — tetapi Al-Albani mendhaifkannya dalam Silsilah adh-Dha'ifah.

## Item yang tidak bisa diverifikasi / diganti — dan apa yang dilakukan

- **kehilangan-barang** — Kandidat "Allahumma ya jami'an naas..." BUKAN hadis (amalan dari pengalaman orang saleh, Ibnu 'Allan); riwayat Ath-Thabarani "radda adh-dhallah" dhaif. Dipakai doa sahih untuk musibah/kehilangan dari Muslim 918, dijelaskan di note.
- **sesudah-makan** — Lafaz yang diminta ("ath'amana wa saqana wa ja'alana minal muslimin", Abu Dawud 3850) Dhaif menurut Al-Albani (islamqa 25824). Lafaz tetap ditulis sesuai permintaan, status jujur Dhaif, note mencantumkan alternatif yang sahih (Abu Dawud 3851).
- **sesudah-minum** — Lafaz "saqana 'adzban furatan..." hanya terlacak ke Al-Bayhaqi Syu'ab al-Iman (satu sumber menyebutnya Hasan); status Hasan, note menegaskan yang pasti dari sunnah adalah "Alhamdulillah" (Tirmidzi 1885).
- **gempa-bumi** — Kandidat "Allahumma la taqtulna bighadhabika..." ternyata doa saat mendengar **petir** (Tirmidzi 3450) dan dinilai **dhaif** oleh Al-Albani (juga Darussalam). IslamQA menegaskan tidak ada doa khusus gempa dalam sunnah. Diganti dengan doa shahih yang relevan: perlindungan dari reruntuhan bangunan dan jatuh (Abu Dawud 1552, shahih menurut Al-Albani dan Al-Hakim). Fakta tentang doa petir yang dhaif dijelaskan lengkap di note.
- **melancarkan-rezeki** — Kandidat "Allahumma barik lana fima razaqtana wa qina 'adzaban nar" DITOLAK: lafaz lengkapnya dinilai **munkar** (Irsyad al-Hadith 575; riwayat Ibnus Sunni 457 melalui perawi munkar); bagian pertamanya saja adalah ucapan Ali bin Abi Thalib (Musnad Ahmad 1313, dhaif) dan itu doa sebelum makan, bukan doa rezeki. Diganti dengan QS Al-Mu'minun: 29 (doa Nabi Nuh AS).
- **dagangan-berkah** — Lafaz "Allahumma barik li fi bay'i" tidak terkonfirmasi bersih (yang ada hanya riwayat Nabi "mendoakan keberkahan dalam jual-belinya" tanpa lafaz persis). Diganti dengan penutup QS Al-Ma'idah: 114 ("Warzuqna wa anta khairur raziqin", doa Nabi Isa AS).
- **doa duha panjang** — "Allaahumma innadh dhuhaa'a dhuhaa'uka..." tidak ditemukan sanad shahih yang terverifikasi → TIDAK dijadikan teks utama. Teks utama diganti dengan yang shahih: "Allaahummaghfirlii wa tub 'alayya..." 100x (Al-Adab al-Mufrad 619, sahih Al-Albani); doa panjang itu disebut di note sebagai tidak terverifikasi.
- **zuhur / asar / isya (setelah salat)** — Riset mengonfirmasi tidak ada doa khusus setelah ketiganya → masing-masing memakai bagian berbeda dari zikir umum setelah salat fardu yang shahih (Zuhur: tahlil Muslim 594; Asar: tasbih 33x + tahlil Muslim 597; Isya: "Allaahumma a'innii 'alaa dzikrika..." Abu Dawud 1522), dengan note jujur "tidak ada doa khusus".
- **setelah-taubat** — Hadis Abu Dawud 1517 shahih, tetapi note jujur menyatakan hadis itu tidak mengaitkan istighfar ini secara khusus dengan salat Taubat.
- **kabar-kematian (ucapan takziah)** — "A'zhomallahu ajraka wa ahsana 'azaaka wa ghafara li mayyitika" TIDAK ditemukan sebagai hadis di sumber mana pun (bukan hadis, tidak ada di sunnah.com; hanya anjuran Imam An-Nawawi di Al-Adzkar). Tetap ditulis karena diminta, tapi note menjelaskan statusnya dengan jujur dan memberi alternatif shahih (Bukhari 1284 / Muslim 923).
- **doa setelah pemakaman** — "Allahummaghfir lahu wa tsabbithu" TERVERIFIKASI: Hisnul Muslim 164, berdasarkan Abu Dawud 3221 (dishahihkan Al-Hakim + Adz-Dzahabi dan Al-Albani; islamqa.info 157114). Status Shahih.
- **muslimin-muslimat** — Nomor "Shahih al-Jami' 6026" dari brief TIDAK bisa dikonfirmasi — dihapus dari source.
- **sai (perjalanan)** — Tahlil di Shafa/Marwah dalam Muslim 1218 TIDAK memuat "yuhyii wa yumiit" — dipakai versi Hisn al-Muslim/Muslim 1218 tanpa frasa itu.

### Koreksi nomor hadis yang ditemukan saat verifikasi
- Doa Anas (keberkahan rezeki): "Bukhari 1982" di brief tidak tepat → **Bukhari 6344** (juga 6334/6378 pada penomoran lain); Muslim 2480.
- Doa safar lengkap: **Muslim 1342** (bukan 1343 seperti di brief; 1342 juga mencakup tambahan "Aayibuuna…" saat pulang). Pulang-perjalanan juga 1342 (+ Bukhari 1797).
- Doa memohon surga (akhirat): "Ibnu Majah 3846" di brief ternyata hadis lain (doa panjang Aisyah) → doa singkat ini ada di **Ibnu Majah 910** (dan 3847 menurut alhadiths.com). Source ditulis "Abu Dawud 792; juga Ibnu Majah 910".
- Doa setelah salat Subuh: "ilman nafi'an" — Ibnu Majah 925, Shahih.
- Doa syafaat (akhirat): tambahan populer "innaka laa tukhliful mii'aad" TIDAK ada dalam Bukhari 614 (teks sunnah.com diverifikasi langsung) — tidak dipakai, dicatat di note.
- Doa keselamatan dunia-akhirat (perlindungan): Abu Dawud 5074 — kalimat pertama berbunyi "as'alukal 'afiyah" (tanpa 'afwa); varian dengan 'afwa dicatat di note.

## Keputusan deduplikasi

- **kematian: ahli-kubur DIGABUNG ke ziarah-kubur** — tidak ada teks khusus untuk ahli kubur yang berbeda dari doa ziarah kubur (Muslim 974/975). Didokumentasikan di note entri ziarah-kubur dan komentar kepala file. (Kategori kematian jadi 19 item, bukan 20.)
- **ibadah: zikir-setelah-salat DIGABUNG ke setelah-salat-fardu** — keduanya rangkaian yang sama persis (istighfar 3x + "Allaahumma antas salaam..." + Ayat Kursi + tasbih/tahmid/takbir 33x, HR. Muslim). ID `zikir-setelah-salat` tidak dibuat. (Kategori ibadah jadi 17 item, bukan 18.)
- **khotmil Quran** hanya di tradisi (bukan di ibadah). **Naik kendaraan** hanya di sehari-hari. **Hilal** hanya di bulan-hari. **Talqin sakaratul maut** (shahih, Muslim 916) vs **talqin mayit** (dhaif) dibedakan tegas.
- **"Doa tahlil arwah"** tidak ditulis — sudah ada di menu Yasin & Tahlil aplikasi.
- **Qunut Witir** hanya disebut di note witir, bukan entri sendiri (dibaca di dalam Witir sebelum salam, bukan setelahnya).
- **Niat salat jenazah** disebut di note takbir pertama, bukan entri terpisah.
- **Kehilangan-barang** (sehari-hari) dan **musibah-bencana** (perlindungan) sama-sama memakai teks Muslim 918 — ini pemakaian ulang yang disengaja untuk dua momen berbeda (kehilangan barang vs musibah umum), bukan duplikasi yang terlewat.

## 7 doa yang sudah ada di aplikasi (lib/data.ts) — TIDAK ditulis ulang

| id | Kategori | Status terverifikasi | Catatan |
|---|---|---|---|
| bangun-tidur | sehari-hari | Shahih (Bukhari–Muslim) | — |
| keluar-rumah | sehari-hari | Shahih | — |
| setelah-wudhu | sehari-hari | Shahih (Muslim) | — |
| qunut-subuh | ibadah | Hasan + tambahan Syafi'i | — |
| sebelum-makan | sehari-hari | **TIDAK TERVERIFIKASI sebagai lafaz khusus — atribusi sumbernya tidak akurat** | Lafaz persis "Bismillahi wa 'ala barakatillah" tidak ditemukan dalam kitab-kitab hadis; yang ada di Mustadrak Al-Hakim adalah "Bismillahi wa barakatillah" (tanpa 'alaa), dari Ibnu Abbas. Yang sahih dan pasti adalah cukup "Bismillah" sebelum makan (Tirmidzi 1858, sahih; Abu Dawud 3767; bila lupa: "Bismillahi fi awwalihi wa akhirihi"). **Rekomendasi: ganti teks di lib/data.ts menjadi "Bismillah" (بِسْمِ اللَّهِ) dengan source "HR. Tirmidzi 1858, Abu Dawud 3767" — atau pertahankan lafaznya tapi ubah source menjadi "Mustadrak Al-Hakim (lafaz 'Bismillahi wa barakatillah')" dan hapus klaim Abu Dawud/Tirmidzi.** |
| sebelum-tidur | sehari-hari | Shahih (Bukhari) | — |
| masuk-masjid | sehari-hari | Shahih (Muslim) | — |

## File yang dihasilkan

- `lib/doa-katalog/dua-type.ts` — tipe `Dua` (dipakai semua file, tidak didefinisikan ulang).
- `lib/doa-katalog/sehari-hari.ts` — `DUAS_SEHARI_HARI` (26)
- `lib/doa-katalog/ibadah.ts` — `DUAS_IBADAH` (17)
- `lib/doa-katalog/bulan-hari.ts` — `DUAS_BULAN_HARI` (15)
- `lib/doa-katalog/keluarga.ts` — `DUAS_KELUARGA` (15)
- `lib/doa-katalog/tradisi.ts` — `DUAS_TRADISI` (22)
- `lib/doa-katalog/sakit.ts` — `DUAS_SAKIT` (9)
- `lib/doa-katalog/kematian.ts` — `DUAS_KEMATIAN` (19)
- `lib/doa-katalog/rezeki.ts` — `DUAS_REZEKI` (12)
- `lib/doa-katalog/perlindungan.ts` — `DUAS_PERLINDUNGAN` (13)
- `lib/doa-katalog/hati.ts` — `DUAS_HATI` (17)
- `lib/doa-katalog/perjalanan.ts` — `DUAS_PERJALANAN` (13)
- `lib/doa-katalog/akhirat.ts` — `DUAS_AKHIRAT` (9)
- `lib/doa-katalog/RINGKASAN.md` — file ini.

**Tidak diubah:** `lib/data.ts` dan `components/ibadah.tsx` — penggabungan katalog ke aplikasi adalah tugas terpisah.
