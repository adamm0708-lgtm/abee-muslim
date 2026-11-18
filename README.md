# ABEE Muslim — Belajar Islam & Ibadah

Aplikasi web belajar Islam dan ibadah untuk semua orang, oleh **ABEE MotionVerse**.
Terinspirasi dari aplikasi belajar Islam anak, tapi dibuat orisinal: nama, merek,
dan konten sendiri.

## Fitur

- **Beranda** — sapaan + profil (level dari poin), tanggal Hijriah (dihitung otomatis),
  jadwal shalat berikutnya dengan hitung mundur live, cuaca, hitung mundur Ramadhan,
  dan 3 misi harian dengan poin.
- **Ibadah (12 menu)** — Doa Harian, Tasbih Digital, Jadwal Shalat, Road to Ramadhan,
  Kalender Hijriyah, Belajar Shalat & Wudhu, Dzikir Harian, Tahlil & Doa, Masjid
  Terdekat (Google Maps), Arah Kiblat (kompas perangkat), Amal Harian, Asmaul Husna (99).
- **Al-Qur'an (7 menu)** — Hafalan Juz 30, Huruf Hijaiyah, Suara & Qari (audio murattal),
  Baca Al-Qur'an, Khatam Planner, Kelompok Mengaji, Video Quotes Ayat.
- **Belajar** — kuis soal hitung (10 soal) dan kartu kata Inggris/Arab.
- **Peringkat / Lencana / Atur** — papan peringkat (demo lokal), lencana dari poin &
  streak, pengaturan nama & kota, reset progres.

## Data live (asli, bukan karangan)

| Data | Sumber |
| --- | --- |
| Jadwal shalat | Aladhan API (`api.aladhan.com`), metode 20 (Kemenag RI) |
| Cuaca | Open-Meteo (`api.open-meteo.com`), gratis tanpa API key |
| Tanggal Hijriah | `Intl.DateTimeFormat` kalender islamic |
| Teks & terjemahan surah | Tertanam untuk 7 surah Juz 30; surah lain diambil dari AlQuran Cloud API (`api.alquran.cloud`) |
| Audio murattal | Islamic Network CDN (`cdn.islamic.network`) |

## Menjalankan lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

## Variabel lingkungan (opsional)

Tanpa ini aplikasi tetap jalan penuh — progres tersimpan di `localStorage`
perangkat. Dengan Supabase, progres juga disinkronkan ke cloud.

```bash
cp .env.example .env.local
# isi:
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Lalu jalankan `supabase/schema.sql` di Supabase Dashboard → SQL Editor
(membuat tabel `user_progress` + policy anon + view `leaderboard_top10`).

## Tema otomatis siang/malam

- **Otomatis (default):** tema terang dipakai antara Terbit dan Maghrib,
  tema gelap antara Maghrib dan Terbit — waktu matahari diambil dari API
  Aladhan (kota yang dipilih). Kalau API belum termuat, fallback ke jam lokal
  (terang 05:00–18:00, gelap 18:00–05:00). Diperiksa ulang tiap menit.
- **Gelap:** latar hijau zamrud gelap `#0B2E26`, kartu `#14382E`, aksen emas
  `#D4AF37`, teks putih/krem `#F7F2E7`.
- **Terang:** latar putih bersih + hijau zamrud + aksen emas (bukan krem/beige).
- Pilihan di **Atur → Tema tampilan**: Otomatis / Terang / Gelap — tersimpan di
  localStorage dan mengalahkan mode otomatis. Logika di `lib/theme.tsx`,
  skrip anti-kedip di `<head>` pada `app/layout.tsx`.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di [vercel.com](https://vercel.com) → Add New → Project → import repo GitHub ini.
3. (Opsional) isi Environment Variables `NEXT_PUBLIC_SUPABASE_URL` dan
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy — Vercel mendeteksi Next.js otomatis (`vercel.json` sudah disertakan).

Atau via CLI:

```bash
npx vercel
```

## Struktur

```
app/                  # Next.js App Router (page.tsx per layar)
  page.tsx            # Beranda
  ibadah/page.tsx     # Menu Ibadah
  ibadah/[slug]/      # 12 fitur ibadah
  quran/page.tsx      # Menu Al-Qur'an
  quran/[slug]/       # 7 fitur Al-Qur'an
  belajar/            # Kuis hitung + kartu kata
  peringkat/ lencana/ atur/
components/           # ui.tsx (Card, MenuGrid, BottomNav), ibadah.tsx, quran.tsx
lib/                  # api.ts (Aladhan/Open-Meteo/Hijriah), data.ts (konten),
                      # store.tsx (progres + localStorage + sync Supabase),
                      # supabase.ts (client opsional)
supabase/schema.sql   # Skema tabel user_progress
```

## Catatan

- Peringkat memakai nama contoh yang ditandai jelas sebagai demo lokal sampai
  Supabase Auth diaktifkan.
- Arah kiblat butuh izin lokasi + sensor kompas perangkat; kalau tidak ada,
  aplikasi menampilkan patokan umum (barat laut ±295° dari Jawa).
- Audio qari dimuat dari CDN eksternal; kalau gagal, aplikasi menampilkan pesan
  jelas (tidak ada pemutar palsu).
