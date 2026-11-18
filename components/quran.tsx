"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Note, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";
import {
  FLASHCARDS,
  HIJAIYAH,
  JUZ30_SURAHS,
  QARIS,
  surahAudioUrl,
} from "@/lib/data";

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
                  <p className="font-extrabold text-abee-ink dark:text-[#F7F2E7]">
                    {s.no}. {s.name} <span className="font-normal text-slate-500 dark:text-[#A8C3B5]">({s.ayahs} ayat)</span>
                  </p>
                  <p className="arabic text-xl text-abee-green dark:text-teal-300">{s.arabicName}</p>
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
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${done ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#B9D2C6]"}`}
                >
                  {done ? "Hafal ✓" : "Tandai Hafal"}
                </button>
              </div>
              <p className="arabic mt-2 border-t border-black/5 dark:border-white/10 pt-2 text-right text-lg leading-loose text-slate-700 dark:text-[#D5E5DC]">
                {s.arabic[0]}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-[#A8C3B5]">{s.translation[0]}</p>
            </Card>
          );
        })}
      </div>
      <Note>Menandai satu surah sebagai hafal memberi +10 poin.</Note>
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
            className={`rounded-2xl bg-white dark:bg-[#14382E] p-4 text-center shadow-sm ring-1 transition active:scale-95 ${selected === i ? "ring-2 ring-abee-green" : "ring-black/5 dark:ring-white/10"}`}
          >
            <span className="arabic block text-3xl text-abee-ink dark:text-[#F7F2E7]">{h.arabic}</span>
            <span className="text-xs font-bold text-slate-500 dark:text-[#A8C3B5]">{selected === i ? h.name : "?"}</span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <Card className="mt-4 text-center">
          <p className="arabic text-5xl text-abee-green dark:text-teal-300">{HIJAIYAH[selected].arabic}</p>
          <p className="mt-2 text-xl font-extrabold text-abee-ink dark:text-[#F7F2E7]">{HIJAIYAH[selected].name}</p>
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
        <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Pilih qari</p>
        <div className="flex flex-wrap gap-2">
          {QARIS.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setQari(q);
                setAudioError(false);
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold ${qari.id === q.id ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#B9D2C6]"}`}
            >
              {q.name}
            </button>
          ))}
        </div>
        <p className="mb-2 mt-4 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Pilih surah</p>
        <div className="flex flex-wrap gap-2">
          {JUZ30_SURAHS.map((s) => (
            <button
              key={s.no}
              onClick={() => {
                setSurahNo(s.no);
                setAudioError(false);
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold ${surahNo === s.no ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#B9D2C6]"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
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
      <Note>
        Audio diambil dari Islamic Network CDN (cdn.islamic.network), rekaman qari asli. Untuk
        surah di luar Juz 30, gunakan menu Baca Al-Qur&apos;an.
      </Note>
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

export function BacaPage() {
  const [surahNo, setSurahNo] = useState(112);
  const [apiSurah, setApiSurah] = useState<ApiSurah | null>(null);
  const [apiTrans, setApiTrans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const embedded = JUZ30_SURAHS.find((s) => s.no === surahNo);

  useEffect(() => {
    if (embedded) {
      setApiSurah(null);
      setApiTrans([]);
      setError("");
      return;
    }
    let alive = true;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNo}`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/id.indonesian`).then((r) => r.json()),
    ])
      .then(([ar, id]) => {
        if (!alive) return;
        if (ar.code !== 200 || id.code !== 200) throw new Error("Surah tidak ditemukan");
        setApiSurah(ar.data);
        setApiTrans(id.data.ayahs.map((a: { text: string }) => a.text));
      })
      .catch(() => alive && setError("Tidak bisa memuat surah dari AlQuran Cloud API. Periksa koneksi internet."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [surahNo, embedded]);

  const arabicLines = embedded ? embedded.arabic : apiSurah?.ayahs.map((a) => a.text) ?? [];
  const transLines = embedded ? embedded.translation : apiTrans;
  const title = embedded
    ? `${embedded.no}. ${embedded.name}`
    : apiSurah
      ? `${apiSurah.number}. ${apiSurah.englishName}`
      : `Surah ${surahNo}`;

  return (
    <div>
      <PageHeader title="Baca Al-Qur'an" subtitle="Arab + terjemahan Indonesia" backHref="/quran" />
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {JUZ30_SURAHS.map((s) => (
          <button
            key={s.no}
            onClick={() => setSurahNo(s.no)}
            className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${surahNo === s.no ? "bg-abee-green dark:bg-[#D4AF37] text-white dark:text-[#0B2E26]" : "bg-white dark:bg-[#14382E] text-slate-600 dark:text-[#B9D2C6] ring-1 ring-black/10 dark:ring-white/15"}`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={114}
          value={surahNo}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (n >= 1 && n <= 114) setSurahNo(n);
          }}
          className="w-24 rounded-2xl bg-white dark:bg-[#14382E] px-3 py-2 text-sm font-bold ring-1 ring-black/10 dark:ring-white/15 outline-none"
          aria-label="Nomor surah 1-114"
        />
        <span className="text-xs text-slate-500 dark:text-[#A8C3B5]">Nomor surah 1–114 (di luar Juz 30 diambil dari API)</span>
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-extrabold text-abee-ink dark:text-[#F7F2E7]">{title}</h2>
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-[#B9D2C6]">Memuat surah dari AlQuran Cloud API…</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {arabicLines.map((line, i) => (
              <div key={i} className="border-b border-black/5 dark:border-white/10 pb-3 last:border-0">
                <p className="arabic text-right text-2xl leading-loose text-abee-ink dark:text-[#F7F2E7]">
                  {line} <span className="text-base text-abee-green dark:text-teal-300">﴿{i + 1}﴾</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-[#B9D2C6]">{transLines[i] ?? ""}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
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
        <label className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
          Halaman terakhir yang sudah dibaca (0–604)
          <input
            type="number"
            min={0}
            max={604}
            value={currentPage}
            onChange={(e) => setCurrentPage(Math.min(604, Math.max(0, Number(e.target.value) || 0)))}
            className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-base font-bold ring-1 ring-black/10 dark:ring-white/15 outline-none"
          />
        </label>
        <label className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">
          Target selesai (tanggal)
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-base font-bold ring-1 ring-black/10 dark:ring-white/15 outline-none"
          />
        </label>
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-400/10 p-4 text-center ring-1 ring-emerald-200">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">Agar khatam tepat waktu, baca setiap hari:</p>
          <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">{perDay} halaman/hari</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Sisa {remaining} halaman · {daysLeft} hari lagi
          </p>
        </div>
        <div>
          <ProgressBar value={currentPage} max={TOTAL} />
          <p className="mt-1 text-center text-xs text-slate-500 dark:text-[#A8C3B5]">
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
            className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-black/10 dark:ring-white/15 outline-none"
          />
          <button
            onClick={() => {
              if (name.trim()) {
                addGroup(name.trim());
                setName("");
              }
            }}
            className="rounded-2xl bg-abee-green dark:bg-[#D4AF37] px-4 py-3 text-sm font-bold text-white dark:text-[#0B2E26]"
          >
            Tambah
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {progress.groups.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-[#A8C3B5]">Belum ada kelompok. Tambahkan kelompok mengajimu di atas.</p>
          )}
          {progress.groups.map((g) => (
            <div key={g} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 ring-1 ring-black/5 dark:ring-white/10">
              <span className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">👥 {g}</span>
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
            <p className="text-sm font-extrabold text-abee-ink dark:text-[#F7F2E7]">
              QS. {s.name} ({s.no})
            </p>
            <p className="arabic mt-1 text-right text-xl leading-loose text-slate-700 dark:text-[#D5E5DC]">{s.arabic[0]}</p>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-[#A8C3B5]">{s.translation[0]}</p>
            <a
              href={s.video}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block rounded-2xl bg-red-500 py-2.5 text-center text-sm font-bold text-white"
            >
              ▶ Tonton di YouTube — ABEE MotionVerse
            </a>
          </Card>
        ))}
        <Card>
          <p className="text-sm font-bold text-abee-ink dark:text-[#F7F2E7]">Video lainnya</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-[#B9D2C6]">
            Video murottal dan doa lainnya ada di channel YouTube{" "}
            <a className="font-bold text-abee-green dark:text-teal-300" href="https://www.youtube.com/@abeemotionverse" target="_blank" rel="noreferrer">
              @abeemotionverse
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
