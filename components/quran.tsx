"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, Chip, Icon, Note, PageHeader, ProgressBar, StarBadge, toArabicIndic } from "@/components/ui";
import { useProgress } from "@/lib/store";
import {
  HIJAIYAH,
  JUZ30_LIST,
  JUZ30_SURAHS,
  QARIS,
  SURAT_PILIHAN,
  juzForPage,
  juzOfSurah,
  pageRangeOfJuz,
  surahAudioUrl,
  surahsInJuz,
} from "@/lib/data";
import {
  QURAN_SOURCE_NOTE,
  embeddedSurahMeta,
  fetchSurahMsi,
  fetchSurahText,
  fetchSurahTajweed,
  fetchSurahUthmani,
  getSurahList,
  type SurahMeta,
} from "@/lib/api";
import { JUZ_SAJDAH_LEGEND, SIFIR_LEGEND, TAJWEED_LEGEND, WAQAF_LEGEND } from "@/lib/tajweed";
import { mapTajweedSurah } from "@/lib/tajweed-map";
import {
  CSS_FULLSCREEN_CLASS,
  normalizeArabicText,
  READER_FONT_SIZES,
  READER_FONT_SIZE_LABELS,
  useFullscreen,
  useReaderFontSize,
} from "@/lib/reading";

// ---------- Hafalan Juz 30 ----------
export function HafalanPage() {
  const { progress, toggleHafalan, addPoints, setMissionProgress } = useProgress();
  const doneCount = Object.values(progress.hafalanDone).filter(Boolean).length;
  return (
    <div>
      <PageHeader title="Hafalan Juz 30" subtitle={`${doneCount}/${JUZ30_SURAHS.length} surah ditandai hafal`} backHref="/quran" />
      <div className="mb-3">
        <ProgressBar value={doneCount} max={JUZ30_SURAHS.length} />
      </div>
      <div className="flex flex-col gap-3">
        {JUZ30_SURAHS.map((s) => {
          const done = !!progress.hafalanDone[s.no];
          return (
            <Card key={s.no}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-neutral-900 dark:text-neutral-100">
                    {s.no}. {s.name} <span className="font-normal text-neutral-500 dark:text-neutral-400">({s.ayahs} ayat)</span>
                  </p>
                  <p className="arabic text-xl text-[#0B3D39] dark:text-[#D4AF37]">{s.arabicName}</p>
                </div>
                <button
                  onClick={() => {
                    const was = !!progress.hafalanDone[s.no];
                    toggleHafalan(s.no);
                    if (!was) {
                      addPoints(10);
                      setMissionProgress("hafalan-count", doneCount + 1);
                    }
                  }}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-sm font-bold ${done ? "bg-[#0B3D39] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
                >
                  {done && <Icon name="check" className="h-4 w-4" />}
                  {done ? "Hafal" : "Tandai Hafal"}
                </button>
              </div>
              <p className="mushaf mt-2 border-t border-black/5 pt-2 text-right text-lg leading-loose text-neutral-700 dark:border-white/10 dark:text-neutral-300">
                {normalizeArabicText(s.arabic[0])}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{s.translation[0]}</p>
            </Card>
          );
        })}
      </div>
      <div className="mt-3">
        <Note>Menandai satu surah sebagai hafal memberi +10 poin.</Note>
      </div>
    </div>
  );
}

// ---------- Huruf Hijaiyah ----------
export function HijaiyahPage() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div>
      <PageHeader title="Huruf Hijaiyah" subtitle="Ketuk huruf untuk melihat namanya" backHref="/quran" />
      <div className="grid grid-cols-4 gap-3">
        {HIJAIYAH.map((h, i) => (
          <button
            key={h.arabic + i}
            onClick={() => setSelected(i)}
            className={`rounded-2xl bg-white p-4 text-center shadow-sm ring-1 transition active:scale-95 dark:bg-[#171717] ${selected === i ? "ring-2 ring-[#0A0A0A] dark:ring-[#D4AF37]" : "ring-black/5 dark:ring-white/10"}`}
          >
            <span className="arabic block text-3xl text-neutral-900 dark:text-neutral-100">{h.arabic}</span>
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">{selected === i ? h.name : "?"}</span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <Card className="mt-4 text-center">
          <p className="arabic text-5xl text-[#0B3D39] dark:text-[#D4AF37]">{HIJAIYAH[selected].arabic}</p>
          <p className="mt-2 text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{HIJAIYAH[selected].name}</p>
        </Card>
      )}
    </div>
  );
}

// ---------- Suara & Qari ----------
export function QariPage() {
  const [qari, setQari] = useState(QARIS[0]);
  const [surahNo, setSurahNo] = useState(112);
  const [audioError, setAudioError] = useState(false);
  const url = surahAudioUrl(qari.edition, surahNo);
  const surah = JUZ30_SURAHS.find((s) => s.no === surahNo);
  return (
    <div>
      <PageHeader title="Suara & Qari" subtitle="Dengarkan murattal surah pendek" backHref="/quran" />
      <Card>
        <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">Pilih qari</p>
        <div className="flex flex-wrap gap-2">
          {QARIS.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setQari(q);
                setAudioError(false);
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold ${qari.id === q.id ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
            >
              {q.name}
            </button>
          ))}
        </div>
        <p className="mb-2 mt-4 text-sm font-bold text-neutral-900 dark:text-neutral-100">Pilih surah</p>
        <div className="flex flex-wrap gap-2">
          {JUZ30_SURAHS.map((s) => (
            <button
              key={s.no}
              onClick={() => {
                setSurahNo(s.no);
                setAudioError(false);
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold ${surahNo === s.no ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {surah?.name} — {qari.name}
          </p>
          <audio
            key={url}
            controls
            preload="none"
            className="w-full"
            onError={() => setAudioError(true)}
            src={url}
          />
          {audioError && (
            <p className="mt-2 text-xs leading-relaxed text-red-600 dark:text-red-400">
              Audio tidak bisa dimuat dari server (periksa koneksi internet atau coba qari lain).
              Tidak ada audio palsu di sini — pemutar hanya memutar rekaman asli dari CDN.
            </p>
          )}
        </div>
      </Card>
      <div className="mt-3">
        <Note>
          Audio diambil dari Islamic Network CDN (cdn.islamic.network), rekaman qari asli. Untuk
          surah di luar Juz 30, gunakan menu Baca Al-Qur&apos;an.
        </Note>
      </div>
    </div>
  );
}

// ---------- Surat Pilihan ----------
export function SuratPilihanPage() {
  const [showJuz30, setShowJuz30] = useState(false);

  if (showJuz30) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={() => setShowJuz30(false)}
            className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0B3D39] dark:text-[#D4AF37]"
          >
            <Icon name="arrow-left" className="h-4 w-4" /> Kembali
          </button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Juz Amma</h1>
          <span className="mt-2 block h-0.5 w-10 rounded-full bg-[#C9A227]" aria-hidden />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Juz 30 · 37 surah · ketuk surah untuk membacanya
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {JUZ30_LIST.map((s) => (
            <Link key={s.no} href={`/quran/baca?surah=${s.no}`}>
              <Card>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F4] text-sm font-extrabold text-[#0B3D39] dark:bg-white/10 dark:text-[#D4AF37]">
                      {s.no}
                    </span>
                    <div>
                      <p className="font-extrabold text-neutral-900 dark:text-neutral-100">{s.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.ayahs} ayat</p>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="arabic text-xl text-[#0B3D39] dark:text-[#D4AF37]">{s.arabicName}</span>
                    <Icon name="chevron-right" className="h-4 w-4 opacity-40" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-3">
          <Note>{QURAN_SOURCE_NOTE}</Note>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Surat Pilihan" subtitle="Surat-surat pilihan untuk dibaca setiap hari" backHref="/quran" />
      <div className="flex flex-col gap-3">
        {SURAT_PILIHAN.map((e) => {
          const inner = (
            <Card>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-neutral-900 dark:text-neutral-100">{e.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{e.desc}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="arabic text-2xl text-[#0B3D39] dark:text-[#D4AF37]">{e.arabic}</span>
                  <Icon name="chevron-right" className="h-4 w-4 opacity-40" />
                </span>
              </div>
            </Card>
          );
          if (e.juz != null) {
            return (
              <div key={e.slug} onClick={() => setShowJuz30(true)} className="cursor-pointer">
                {inner}
              </div>
            );
          }
          return (
            <Link key={e.slug} href={`/quran/baca?surah=${e.surah}`}>
              {inner}
            </Link>
          );
        })}
      </div>
      <div className="mt-3">
        <Note>
          Dibuka di Baca Al-Qur&apos;an — teks Arab, terjemahan Kemenag, dan warna tajwid
          mengikuti pengaturan bacaanmu.
        </Note>
      </div>
    </div>
  );
}

// ---------- Baca Al-Qur'an ----------
type ApiSurah = {
  number: number;
  englishName: string;
  name: string;
  ayahs: { numberInSurah: number; text: string }[];
};

type Tab = "sura" | "page" | "juz" | "hizb";

export function BacaPage() {
  const { progress, setLastRead } = useProgress();

  // ----- Daftar surah -----
  const [surahs, setSurahs] = useState<SurahMeta[] | null>(null);
  const [listError, setListError] = useState(false);
  const [tab, setTab] = useState<Tab>("sura");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [juzFilter, setJuzFilter] = useState<number | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [pageInfo, setPageInfo] = useState<{ page: number; juz: number; surah: number } | null>(null);

  // ----- Mode baca -----
  const [readerSurah, setReaderSurah] = useState<number | null>(null);
  const [apiSurah, setApiSurah] = useState<ApiSurah | null>(null);
  const [apiTrans, setApiTrans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTajweed, setShowTajweed] = useState(true);
  const [tajweedLines, setTajweedLines] = useState<string[] | null>(null);
  const [uthmaniLines, setUthmaniLines] = useState<string[] | null>(null);
  const [msiLines, setMsiLines] = useState<string[] | null>(null);
  // Ukuran teks baca bersama (A- A A+ A++, tersimpan di localStorage).
  const { size: fontSize, setSize: setFontSize, arabicClass: fontSizeClass } =
    useReaderFontSize();
  const fs = useFullscreen();
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Gulir otomatis pelan di mode baca (14 px/detik — kira-kira 1 baris
  // tiap 4 detik di ukuran teks sedang), supaya pengguna tidak perlu
  // sering menggulir sendiri.
  const [autoScroll, setAutoScroll] = useState(false);
  const [ayahJumpOpen, setAyahJumpOpen] = useState(false);
  const [ayahInput, setAyahInput] = useState("");
  const [qari, setQari] = useState(QARIS[0]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    getSurahList()
      .then((list) => alive && setSurahs(list))
      .catch(() => {
        if (!alive) return;
        setSurahs(embeddedSurahMeta());
        setListError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Gulir otomatis pelan di mode baca: menggulir halaman ~14 px/detik,
  // berhenti sendiri di ujung halaman, dan berhenti begitu pengguna
  // menggulir sendiri (roda mouse / sentuhan) supaya tidak berebut.
  useEffect(() => {
    if (!autoScroll || readerSurah == null) return;
    const SPEED_PX_PER_SEC = 14;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setAutoScroll(false);
        return;
      }
      window.scrollBy(0, SPEED_PX_PER_SEC * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const stop = () => setAutoScroll(false);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [autoScroll, readerSurah]);

  // Buka surah langsung dari menu Surat Pilihan (?surah=N). Query dibersihkan
  // setelah dibaca supaya refresh tidak membuka surah lama.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("surah"));
    if (Number.isInteger(n) && n >= 1 && n <= 114) {
      setReaderSurah(n);
      window.history.replaceState(null, "", "/quran/baca");
      window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const embedded = readerSurah != null ? JUZ30_SURAHS.find((s) => s.no === readerSurah) : undefined;

  useEffect(() => {
    if (readerSurah == null) return;
    if (embedded) {
      setApiSurah(null);
      setApiTrans([]);
      setError("");
      return;
    }
    let alive = true;
    setLoading(true);
    setError("");
    fetchSurahText(readerSurah)
      .then(({ arabic, translation }) => {
        if (!alive) return;
        setApiSurah({ ayahs: arabic.map((text) => ({ text })) } as never);
        setApiTrans(translation);
      })
      .catch(
        () =>
          alive &&
          setError(
            "Tidak bisa memuat surah dari Quran.com API (cadangan AlQuran Cloud juga gagal). Periksa koneksi internet."
          )
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [readerSurah, embedded]);

  // Warna tajwid + tanda maddah + tanda waqaf + sifir: dimuat terpisah
  // dari teks polos (sumber sama, Quran.com), untuk semua surah termasuk
  // yang tertanam di Juz 30. Dimuat setiap kali surah dibuka — BUKAN
  // hanya saat toggle Warna Tajwid ON — karena pemetaan yang sama juga
  // mengembalikan tanda maddah (mad panjang), saktah, dan sifir ke teks,
  // dan tanda-tanda itu harus tampil juga saat warna dimatikan.
  // Teks Uthmani polos = sumber sifir (teks tajwid HTML membuang hampir
  // semua sifir). Teks MSI (equran.id) = sumber tanda waqaf MSI,
  // termasuk yang di AKHIR ayat (teks Uthmani/Madinah tidak memilikinya).
  // Gagal = teks polos (tanpa sifir/waqaf MSI, waqaf Madinah yang sudah
  // ada di teks Simple + maddah tetap dari jalur Simple bila tersedia).
  useEffect(() => {
    if (readerSurah == null) {
      setTajweedLines(null);
      setUthmaniLines(null);
      setMsiLines(null);
      return;
    }
    let alive = true;
    fetchSurahTajweed(readerSurah)
      .then((lines) => alive && setTajweedLines(lines))
      .catch(() => alive && setTajweedLines(null));
    fetchSurahUthmani(readerSurah)
      .then((lines) => alive && setUthmaniLines(lines))
      .catch(() => alive && setUthmaniLines(null));
    fetchSurahMsi(readerSurah)
      .then((lines) => alive && setMsiLines(lines))
      .catch(() => alive && setMsiLines(null));
    return () => {
      alive = false;
    };
  }, [readerSurah]);

  const arabicLines = useMemo(
    () => (embedded ? embedded.arabic : apiSurah?.ayahs.map((a) => a.text) ?? []),
    [embedded, apiSurah]
  );
  const tajweedAvailable =
    tajweedLines != null && tajweedLines.length === arabicLines.length;
  const tajweedOn = showTajweed && tajweedAvailable;
  // Warna tajwid dipetakan dari teks Uthmani sumber ke ejaan Simple yang
  // ditampilkan — ejaan TIDAK berubah saat toggle tajwid dimatikan atau
  // dinyalakan. Dihitung sekali per surah (memo, bukan per render).
  // mapTajweedSurah mengembalikan per ayat: html (warna + maddah + sifir
  // + saktah + waqaf MSI) dan plain (teks Simple + tanda yang
  // dikembalikan, tanpa warna — dipakai saat toggle OFF, supaya tanda
  // mad panjang, saktah, sifir, dan waqaf MSI tetap tampil).
  const mappedTajweedLines = useMemo(() => {
    if (!tajweedAvailable || tajweedLines == null) return null;
    return mapTajweedSurah(
      tajweedLines,
      arabicLines,
      uthmaniLines ?? undefined,
      msiLines ?? undefined,
      readerSurah ?? undefined
    );
  }, [tajweedAvailable, tajweedLines, arabicLines, uthmaniLines, msiLines, readerSurah]);
  const transLines = embedded ? embedded.translation : apiTrans;
  const readerMeta =
    surahs?.find((s) => s.number === readerSurah) ??
    embeddedSurahMeta().find((s) => s.number === readerSurah);
  const readerJuz = readerSurah != null ? juzOfSurah(readerSurah) : 30;
  const audioUrl = readerSurah != null ? surahAudioUrl(qari.edition, readerSurah) : "";
  const lastReadAyah = progress.lastRead?.surahNo === readerSurah ? progress.lastRead.ayah : null;

  useEffect(() => {
    setAudioPlaying(false);
  }, [audioUrl]);

  const openReader = (no: number) => {
    setReaderSurah(no);
    setSettingsOpen(false);
    setAyahJumpOpen(false);
    setAyahInput("");
    window.scrollTo({ top: 0 });
  };

  const markAyah = (ayah: number) => {
    if (readerSurah == null) return;
    const name = readerMeta?.englishName ?? `Surah ${readerSurah}`;
    setLastRead({ surahNo: readerSurah, surahName: name, ayah, at: new Date().toISOString() });
  };

  const jumpToAyah = (ayah: number) => {
    markAyah(ayah);
    const el = document.getElementById(`ayah-${ayah}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (audioPlaying) {
      el.pause();
      setAudioPlaying(false);
    } else {
      void el.play().catch(() => setAudioPlaying(false));
      setAudioPlaying(true);
    }
  };

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];
    let list = surahs;
    if (juzFilter != null) {
      const [from, to] = surahsInJuz(juzFilter);
      list = list.filter((s) => s.number >= from && s.number <= to);
    }
    const s = search.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (m) =>
        m.englishName.toLowerCase().includes(s) ||
        m.name.includes(search.trim()) ||
        String(m.number) === s
    );
  }, [surahs, search, juzFilter]);

  const lastRead = progress.lastRead;

  // ================= MODE BACA (mushaf) =================
  if (readerSurah != null) {
    const [chipFrom, chipTo] = surahsInJuz(readerJuz);
    const chipSurahs: { no: number; name: string }[] = [];
    for (let n = chipTo; n >= chipFrom; n--) {
      const m = surahs?.find((s) => s.number === n) ?? embeddedSurahMeta().find((s) => s.number === n);
      if (m) chipSurahs.push({ no: n, name: m.englishName });
    }
    const surahTitle = readerMeta
      ? `${readerMeta.number}. ${readerMeta.englishName}`
      : `Surah ${readerSurah}`;

    return (
      <div ref={fs.ref} className={fs.cssActive ? CSS_FULLSCREEN_CLASS : undefined}>
        {/* Header hitam ala mushaf */}
        <div
          className={`sticky z-30 mb-3 rounded-2xl bg-[#0A0A0A] px-3 py-2.5 text-white shadow-md ${
            fs.active ? "top-0" : "top-16"
          }`}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => setReaderSurah(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
              aria-label="Kembali ke daftar surah"
            >
              <Icon name="arrow-left" className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-base font-extrabold">Juz {readerJuz}</p>
              <p className="truncate text-xs text-white/60">{surahTitle}</p>
            </div>
            <button
              onClick={toggleAudio}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 ${audioPlaying ? "text-[#D4AF37]" : "text-white/85"}`}
              aria-label={audioPlaying ? "Jeda audio" : "Putar audio"}
            >
              <Icon name="audio" className="h-5 w-5" />
              {audioPlaying && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D4AF37]" />}
            </button>
            <button
              onClick={() => setAyahJumpOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
              aria-label="Cari ayat"
            >
              <Icon name="search" className="h-5 w-5" />
            </button>
            <button
              onClick={() => lastReadAyah != null && jumpToAyah(lastReadAyah)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
              aria-label="Ke ayat terakhir dibaca"
            >
              <Icon name="bookmark" className="h-5 w-5" />
            </button>
            <button
              onClick={fs.toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
              aria-label={fs.active ? "Keluar dari layar penuh" : "Layar penuh"}
            >
              <Icon name={fs.active ? "minimize" : "maximize"} className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setSettingsOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
                aria-label="Pengaturan tampilan"
              >
                <Icon name="settings" className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 top-11 w-56 rounded-2xl bg-white p-3 text-neutral-900 shadow-xl ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-100 dark:ring-white/10">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Tampilan baca
                  </p>
                  <button
                    onClick={() => setShowTranslation((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="eye" className="h-4 w-4" /> Terjemahan
                    </span>
                    <span className="text-xs text-[#0B3D39] dark:text-[#D4AF37]">
                      {showTranslation ? "Tampil" : "Sembunyi"}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowTajweed((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="droplet" className="h-4 w-4" /> Warna Tajwid
                    </span>
                    <span className="text-xs text-[#0B3D39] dark:text-[#D4AF37]">
                      {showTajweed ? "Tampil" : "Sembunyi"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setAutoScroll((v) => !v);
                      setSettingsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="play" className="h-4 w-4" /> Gulir Otomatis
                    </span>
                    <span className="text-xs text-[#0B3D39] dark:text-[#D4AF37]">
                      {autoScroll ? "Aktif (pelan)" : "Mati"}
                    </span>
                  </button>
                  <div className="mt-1 flex items-center justify-between rounded-xl px-2 py-2">
                    <span className="text-sm font-bold">Ukuran teks</span>
                    <span className="flex gap-1">
                      {READER_FONT_SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFontSize(s)}
                          aria-label={`Ukuran teks ${READER_FONT_SIZE_LABELS[s]}`}
                          className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                            fontSize === s
                              ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                              : "bg-black/5 dark:bg-white/10"
                          }`}
                        >
                          {READER_FONT_SIZE_LABELS[s]}
                        </button>
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chip surah dalam juz yang sama */}
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {chipSurahs.map((c) => (
            <button
              key={c.no}
              onClick={() => openReader(c.no)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${
                c.no === readerSurah
                  ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
                  : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/10"
              }`}
            >
              {c.no}. {c.name}
            </button>
          ))}
        </div>

        {/* Pencarian ayat */}
        {ayahJumpOpen && (
          <div className="mb-3 flex gap-2">
            <input
              type="number"
              min={1}
              max={arabicLines.length || 114}
              value={ayahInput}
              onChange={(e) => setAyahInput(e.target.value)}
              placeholder={`Nomor ayat 1–${arabicLines.length || "…"}`}
              className="flex-1 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold ring-1 ring-black/10 outline-none dark:bg-[#171717] dark:ring-white/15"
              aria-label="Nomor ayat"
            />
            <button
              onClick={() => {
                const n = Number(ayahInput);
                if (n >= 1 && n <= arabicLines.length) jumpToAyah(n);
              }}
              className="rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
            >
              Buka ayat
            </button>
          </div>
        )}

        {/* Pemutar audio (rekaman qari asli, CDN yang sama) */}
        <Card className="mb-3">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            <Icon name="audio" className="h-4 w-4 text-[#0B3D39] dark:text-[#D4AF37]" />
            Dengarkan — {qari.name}
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {QARIS.map((q) => (
              <button
                key={q.id}
                onClick={() => setQari(q)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${qari.id === q.id ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-[#F5F5F4] text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
              >
                {q.name}
              </button>
            ))}
          </div>
          <audio
            ref={audioRef}
            key={audioUrl}
            controls
            preload="none"
            className="w-full"
            src={audioUrl}
            onPlay={() => setAudioPlaying(true)}
            onPause={() => setAudioPlaying(false)}
            onEnded={() => setAudioPlaying(false)}
          />
        </Card>

        {/* Penanda posisi terakhir dibaca */}
        {lastReadAyah != null && (
          <button
            onClick={() => jumpToAyah(lastReadAyah)}
            className="mb-3 flex w-full items-center justify-between rounded-2xl bg-[#0B3D39]/5 px-4 py-3 text-left ring-1 ring-[#0B3D39]/20 dark:bg-[#D4AF37]/10 dark:ring-[#D4AF37]/25"
          >
            <span className="text-sm font-bold text-[#0B3D39] dark:text-[#D4AF37]">
              Terakhir dibaca: Ayat {lastReadAyah}
            </span>
            <span className="text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">Lanjutkan</span>
          </button>
        )}

        {/* Teks mushaf */}
        <Card className="px-4 py-6 sm:px-6">
          {loading ? (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              Memuat surah dari Quran.com API…
            </p>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => openReader(112)}
                className="mt-3 rounded-full bg-[#0A0A0A] px-4 py-2 text-xs font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
              >
                Buka Al-Ikhlas (tersimpan offline)
              </button>
            </div>
          ) : (
            <>
              {readerSurah !== 1 && readerSurah !== 9 && (
                <p className={`mushaf mb-5 !text-center text-neutral-900 dark:text-neutral-100 ${fontSizeClass}`}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              <p className={`mushaf ${fontSizeClass} text-neutral-900 dark:text-neutral-100`}>
                {arabicLines.map((line, i) => (
                  <span
                    key={i}
                    id={`ayah-${i + 1}`}
                    onClick={() => markAyah(i + 1)}
                    className={`ayah ${lastReadAyah === i + 1 ? "last-read" : ""}`}
                    title={`Ketuk untuk menandai Ayat ${i + 1} sebagai terakhir dibaca`}
                  >
                    {mappedTajweedLines && showTajweed ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: mappedTajweedLines[i].html,
                        }}
                      />
                    ) : mappedTajweedLines ? (
                      mappedTajweedLines[i].plain
                    ) : (
                      line
                    )}{" "}
                    <span className="ayah-mark">{toArabicIndic(i + 1)}</span>{" "}
                  </span>
                ))}
              </p>
              {showTranslation && transLines.length > 0 && (
                <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/10">
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Terjemahan
                  </p>
                  {transLines.map((t, i) => (
                    <p key={i} className="mb-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      <span className="font-extrabold text-[#C9A227]">{i + 1}.</span> {t}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Panduan warna tajwid (untuk pemula) */}
        {tajweedOn && (
          <Card className="mt-3">
            <p className="mb-2 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              Panduan warna tajwid
            </p>
            <div className="flex flex-wrap gap-2">
              {TAJWEED_LEGEND.map((r) => (
                <span
                  key={r.name}
                  className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: r.swatch }}
                  />
                  {r.name} — {r.desc}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
              Warna mengikuti hukum bacaan pada hurufnya. Data warna tajwid: Quran.com API
              (dipetakan dari teks Uthmani ke ejaan Simple yang ditampilkan). Matikan lewat
              Pengaturan → Warna Tajwid kalau mau tampilan mushaf polos.
            </p>
          </Card>
        )}

        {/* Tanda waqaf + sifir (Mushaf Standar Indonesia / Kemenag) — bagian
            dari teks, tampil baik saat Warna Tajwid ON maupun OFF, dan di Yasin. */}
        <Card className="mt-3">
          <p className="mb-2 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
            Tanda waqaf
          </p>
          <div className="flex flex-wrap gap-2">
            {WAQAF_LEGEND.map((r) => (
              <span
                key={r.name}
                className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
              >
                <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                  {r.mark}
                </span>
                {r.name} — {r.desc}
              </span>
            ))}
          </div>
          <p className="mb-2 mt-3 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
            Tanda sifir
          </p>
          <div className="flex flex-wrap gap-2">
            {SIFIR_LEGEND.map((r) => (
              <span
                key={r.name}
                className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
              >
                <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                  {r.mark}
                </span>
                {r.name} — {r.desc}
              </span>
            ))}
          </div>
          <p className="mb-2 mt-3 text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
            Penanda juz &amp; sajdah
          </p>
          <div className="flex flex-wrap gap-2">
            {JUZ_SAJDAH_LEGEND.map((r) => (
              <span
                key={r.name}
                className="flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:bg-white/5 dark:text-neutral-300"
              >
                <span className="mushaf text-lg leading-none text-neutral-900 dark:text-neutral-100">
                  {r.mark}
                </span>
                {r.name} — {r.desc}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            Tanda waqaf dan sifir mengikuti Mushaf Standar Indonesia (Kemenag RI) dan
            dipetakan dari teks Uthmani ke ejaan Simple yang ditampilkan. Tanda waqaf
            juga ada di akhir ayat (mis. لا di akhir ayat Al-Waqi&apos;ah) — karena
            MSI memang menaruh tanda waqaf di akhir ayat, berbeda dengan Mushaf
            Madinah yang tidak. Penanda juz (۞, awal rub&apos;/perempat juz) dan
            sajdah (۩, akhir ayat sajdah) dikembalikan dari teks Uthmani.
          </p>
        </Card>

        {/* Tombol berhenti gulir otomatis (muncul saat gulir aktif) */}
        {autoScroll && (
          <button
            onClick={() => setAutoScroll(false)}
            className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#0A0A0A] px-4 py-2.5 text-sm font-bold text-white shadow-lg ring-1 ring-[#D4AF37]/60 dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Menggulir pelan — ketuk untuk berhenti
          </button>
        )}

        <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
          Ketuk sebuah ayat untuk menandainya sebagai terakhir dibaca. {QURAN_SOURCE_NOTE}.
        </p>
      </div>
    );
  }

  // ================= DAFTAR SURAH =================
  return (
    <div>
      {/* Header halaman ngaji */}
      <div className="mb-3 flex items-center gap-1">
        <Link href="/quran" className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5" aria-label="Kembali">
          <Icon name="arrow-left" className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">Al-Qur&apos;an</h1>
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5"
          aria-label="Cari surah"
        >
          <Icon name="search" className="h-5 w-5" />
        </button>
        <button
          onClick={() => lastRead && openReader(lastRead.surahNo)}
          disabled={!lastRead}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-black/5 disabled:opacity-30 dark:text-neutral-200 dark:hover:bg-white/5"
          aria-label="Terakhir dibaca"
        >
          <Icon name="bookmark" className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Sura / Page / Juz / Hizb */}
      <div className="mb-3 flex gap-2">
        {(["sura", "page", "juz", "hizb"] as const).map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t === "sura" ? "Sura" : t === "page" ? "Page" : t === "juz" ? "Juz" : "Hizb"}
          </Chip>
        ))}
      </div>

      {/* Pencarian */}
      {searchOpen && tab === "sura" && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari surah… (nama Latin, Arab, atau nomor)"
          className="mb-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:bg-[#171717] dark:ring-white/15"
          autoFocus
        />
      )}

      {/* Kartu Terakhir Dibaca */}
      {tab === "sura" && (
        lastRead ? (
          <button onClick={() => openReader(lastRead.surahNo)} className="mb-3 block w-full rounded-2xl bg-[#0A0A0A] p-4 text-left text-white shadow-md">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D4AF37]">
              Terakhir Dibaca
            </p>
            <p className="mt-1.5 text-lg font-extrabold">
              {lastRead.surahNo}. {lastRead.surahName}
            </p>
            <p className="text-sm text-white/70">
              Ayat {lastRead.ayah} · Juz {juzOfSurah(lastRead.surahNo)} · Ketuk untuk melanjutkan
            </p>
          </button>
        ) : (
          <button onClick={() => openReader(78)} className="mb-3 block w-full rounded-2xl bg-[#0A0A0A] p-4 text-left text-white shadow-md">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D4AF37]">
              Terakhir Dibaca
            </p>
            <p className="mt-1.5 text-lg font-extrabold">Belum ada yang dibaca</p>
            <p className="text-sm text-white/70">
              Mulai membaca Juz 30 — ketuk untuk membuka An-Naba (78)
            </p>
          </button>
        )
      )}

      {/* Tab Sura: daftar surah */}
      {tab === "sura" && (
        <>
          {juzFilter != null && (
            <button
              onClick={() => setJuzFilter(null)}
              className="mb-3 flex items-center gap-1 rounded-full bg-[#0A0A0A] px-3 py-1.5 text-xs font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
            >
              Juz {juzFilter} <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          )}
          {surahs === null ? (
            <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Memuat daftar surah…
            </p>
          ) : filteredSurahs.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Tidak ditemukan. Coba kata kunci lain.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredSurahs.map((s) => (
                <button key={s.number} onClick={() => openReader(s.number)} className="w-full text-left">
                  <Card className="flex items-center gap-3 !py-3">
                    <StarBadge no={s.number} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-extrabold text-neutral-900 dark:text-neutral-100">
                        {s.englishName}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {s.revelationType === "Meccan" ? "Mekah" : "Madinah"} · {s.numberOfAyahs} ayat
                      </span>
                    </span>
                    <span className="arabic shrink-0 text-2xl leading-none text-[#0B3D39] dark:text-[#D4AF37]">
                      {s.name}
                    </span>
                  </Card>
                </button>
              ))}
            </div>
          )}
          {listError && (
            <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
              Daftar lengkap tidak bisa dimuat (offline) — menampilkan surah Juz 30 yang tersimpan
              di aplikasi.
            </p>
          )}
        </>
      )}

      {/* Tab Page: lompat ke halaman mushaf */}
      {tab === "page" && (
        <div className="flex flex-col gap-3">
          <Card>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Buka halaman mushaf (1–604)
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                min={1}
                max={604}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="Nomor halaman"
                className="flex-1 rounded-2xl bg-[#F5F5F4] px-4 py-2.5 text-sm font-bold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
                aria-label="Nomor halaman mushaf"
              />
              <button
                onClick={() => {
                  const p = Number(pageInput);
                  if (p < 1 || p > 604) return;
                  const juz = juzForPage(p);
                  const [startSurah] = surahsInJuz(juz);
                  setPageInfo({ page: p, juz, surah: startSurah });
                }}
                className="rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
              >
                Buka
              </button>
            </div>
            {pageInfo && (
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Halaman {pageInfo.page} berada di <b>Juz {pageInfo.juz}</b> — dimulai dari surah{" "}
                {surahs?.find((s) => s.number === pageInfo.surah)?.englishName ?? `no. ${pageInfo.surah}`}.
              </p>
            )}
            {pageInfo && (
              <button
                onClick={() => openReader(pageInfo.surah)}
                className="mt-3 w-full rounded-2xl bg-[#0A0A0A] py-2.5 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
              >
                Baca surah awal Juz {pageInfo.juz}
              </button>
            )}
          </Card>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
              const [ps, pe] = pageRangeOfJuz(j);
              const [ss] = surahsInJuz(j);
              return (
                <button key={j} onClick={() => openReader(ss)} className="w-full text-left">
                  <Card className="flex items-center justify-between !py-3">
                    <span className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                      Juz {j}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                      Halaman {ps}–{pe}
                    </span>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Juz: daftar 30 juz */}
      {tab === "juz" && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
            const [ss, se] = surahsInJuz(j);
            const [ps, pe] = pageRangeOfJuz(j);
            const startName = surahs?.find((s) => s.number === ss)?.englishName ?? `Surah ${ss}`;
            return (
              <button
                key={j}
                onClick={() => {
                  setJuzFilter(j);
                  setTab("sura");
                }}
                className="w-full text-left"
              >
                <Card className="flex items-center justify-between !py-3">
                  <span>
                    <span className="block text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                      Juz {j}
                    </span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      Mulai: {startName} · {ss === se ? "1 surah" : `${se - ss + 1} surah`}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-neutral-400 dark:text-neutral-500">
                    Hal. {ps}–{pe} <Icon name="chevron-right" className="h-4 w-4" />
                  </span>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab Hizb: daftar 60 hizb */}
      {tab === "hizb" && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((hz) => {
            const juz = Math.ceil(hz / 2);
            const [ps, pe] = pageRangeOfJuz(juz);
            const mid = Math.floor((ps + pe) / 2);
            const [hs, he] = hz % 2 === 1 ? [ps, mid] : [mid + 1, pe];
            return (
              <button
                key={hz}
                onClick={() => {
                  setJuzFilter(juz);
                  setTab("sura");
                }}
                className="w-full text-left"
              >
                <Card className="flex items-center justify-between !py-3">
                  <span>
                    <span className="block text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                      Hizb {hz}
                    </span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      Juz {juz}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-neutral-400 dark:text-neutral-500">
                    Hal. {hs}–{he} <Icon name="chevron-right" className="h-4 w-4" />
                  </span>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Khatam Planner ----------
export function KhatamPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const TOTAL = 604;
  const daysLeft = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate + "T00:00:00");
    return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / 86400000));
  }, [targetDate]);
  const remaining = Math.max(0, TOTAL - currentPage);
  const perDay = Math.ceil(remaining / daysLeft);
  return (
    <div>
      <PageHeader title="Khatam Planner" subtitle="Rencana khatam Al-Qur'an (mushaf 604 halaman)" backHref="/quran" />
      <Card className="flex flex-col gap-4">
        <label className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Halaman terakhir yang sudah dibaca (0–604)
          <input
            type="number"
            min={0}
            max={604}
            value={currentPage}
            onChange={(e) => setCurrentPage(Math.min(604, Math.max(0, Number(e.target.value) || 0)))}
            className="mt-1 w-full rounded-2xl bg-[#F5F5F4] px-4 py-3 text-base font-bold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
          />
        </label>
        <label className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Target selesai (tanggal)
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-[#F5F5F4] px-4 py-3 text-base font-bold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
          />
        </label>
        <div className="rounded-2xl bg-[#0A0A0A] p-4 text-center text-white">
          <p className="text-sm text-white/70">Agar khatam tepat waktu, baca setiap hari:</p>
          <p className="text-4xl font-extrabold text-[#D4AF37]">{perDay} halaman/hari</p>
          <p className="text-xs text-white/70">
            Sisa {remaining} halaman · {daysLeft} hari lagi
          </p>
        </div>
        <div>
          <ProgressBar value={currentPage} max={TOTAL} />
          <p className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {currentPage}/{TOTAL} halaman ({Math.round((currentPage / TOTAL) * 100)}%)
          </p>
        </div>
      </Card>
    </div>
  );
}

// ---------- Kelompok Mengaji ----------
export function KelompokPage() {
  const { progress, addGroup, removeGroup } = useProgress();
  const [name, setName] = useState("");
  return (
    <div>
      <PageHeader title="Kelompok Mengaji" subtitle="Daftar kelompok mengajimu (tersimpan di perangkat)" backHref="/quran" />
      <Card>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kelompok… (mis. Majelis Al-Ikhlas)"
            className="flex-1 rounded-2xl bg-[#F5F5F4] px-4 py-3 text-sm font-semibold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
          />
          <button
            onClick={() => {
              if (name.trim()) {
                addGroup(name.trim());
                setName("");
              }
            }}
            className="rounded-2xl bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Tambah
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {progress.groups.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada kelompok. Tambahkan kelompok mengajimu di atas.</p>
          )}
          {progress.groups.map((g) => (
            <div key={g} className="flex items-center justify-between rounded-2xl bg-[#F5F5F4] px-4 py-3 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              <span className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                <Icon name="users" className="h-4 w-4 text-[#0B3D39] dark:text-[#D4AF37]" /> {g}
              </span>
              <button onClick={() => removeGroup(g)} className="text-sm font-bold text-red-500 dark:text-red-400">
                Hapus
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- Video Quotes Ayat ----------
export function VideoPage() {
  return (
    <div>
      <PageHeader title="Video Quotes Ayat" subtitle="Ayat pendek + video murottal ABEE MotionVerse" backHref="/quran" />
      <div className="flex flex-col gap-3">
        {JUZ30_SURAHS.filter((s) => s.video).map((s) => (
          <Card key={s.no}>
            <p className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              QS. {s.name} ({s.no})
            </p>
            <p className="mushaf mt-1 text-right text-xl leading-loose text-neutral-700 dark:text-neutral-300">{normalizeArabicText(s.arabic[0])}</p>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{s.translation[0]}</p>
            <a
              href={s.video}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] py-2.5 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
            >
              <Icon name="play" className="h-4 w-4" /> Tonton di YouTube — ABEE MotionVerse
            </a>
          </Card>
        ))}
        <Card>
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Video lainnya</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Video murottal dan doa lainnya ada di channel YouTube{" "}
            <a className="font-bold text-[#0B3D39] dark:text-[#D4AF37]" href="https://www.youtube.com/@abeemotionverse" target="_blank" rel="noreferrer">
              @abeemotionverse
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
