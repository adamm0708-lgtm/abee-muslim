"use client";
import { useMemo, useState } from "react";
import { Card, Icon, PageHeader, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/store";
import { FLASHCARDS } from "@/lib/data";

type Question = { a: number; b: number; op: "+" | "-" | "×"; answer: number };

function makeQuestions(seed: number): Question[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const qs: Question[] = [];
  for (let i = 0; i < 10; i++) {
    const op = (["+", "-", "×"] as const)[Math.floor(rnd() * 3)];
    const a = 2 + Math.floor(rnd() * 20);
    const b = 2 + Math.floor(rnd() * 12);
    if (op === "-") qs.push({ a: Math.max(a, b), b: Math.min(a, b), op, answer: Math.max(a, b) - Math.min(a, b) });
    else if (op === "×") qs.push({ a, b: Math.min(b, 9), op, answer: a * Math.min(b, 9) });
    else qs.push({ a, b, op, answer: a + b });
  }
  return qs;
}

function Quiz() {
  const { setMissionProgress, addPoints } = useProgress();
  const [seed] = useState(() => Date.now() % 100000);
  const questions = useMemo(() => makeQuestions(seed), [seed]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [done, setDone] = useState(false);
  const [input, setInput] = useState("");

  const q = questions[idx];
  const correct = answers.filter((a, i) => a === questions[i].answer).length;

  const submit = () => {
    const val = Number(input);
    if (input.trim() === "" || Number.isNaN(val)) return;
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
    setInput("");
    if (idx < 9) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      const score = next.filter((a, i) => a === questions[i].answer).length;
      setMissionProgress("hitung-count", score);
      if (score >= 8) addPoints(10);
    }
  };

  if (done) {
    return (
      <Card className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A0A0A] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          <Icon name="trophy" className="h-7 w-7" />
        </span>
        <p className="mt-3 text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Skor: {correct}/10
        </p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {correct >= 8
            ? "Bagus sekali! Kamu mendapat +10 poin."
            : "Terus berlatih — coba lagi sampai dapat 8 atau lebih."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-2xl bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          Main Lagi
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
          Soal {idx + 1}/10 · Benar: {correct}
        </p>
      </div>
      <ProgressBar value={idx} max={10} />
      <p className="mt-4 text-center text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
        {q.a} {q.op} {q.b} = ?
      </p>
      <div className="mt-4 flex gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Jawabanmu"
          className="flex-1 rounded-2xl bg-[#F5F5F4] px-4 py-3 text-lg font-bold ring-1 ring-black/10 outline-none dark:bg-white/5 dark:ring-white/15"
          autoFocus
        />
        <button onClick={submit} className="rounded-2xl bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          Jawab
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Jawaban terakhir: {answers[idx] === null ? "—" : answers[idx] === q.answer ? "Benar" : "Belum tepat"}
      </p>
    </Card>
  );
}

function Flashcards() {
  const { setMissionProgress } = useProgress();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const card = FLASHCARDS[idx];
  const markKnown = () => {
    const next = new Set(known);
    next.add(idx);
    setKnown(next);
    setMissionProgress("kata-count", next.size);
    setFlipped(false);
    setIdx((i) => (i + 1) % FLASHCARDS.length);
  };
  return (
    <Card className="text-center">
      <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
        Kartu {idx + 1}/{FLASHCARDS.length} · Sudah hafal: {known.size}
      </p>
      <button
        onClick={() => setFlipped(!flipped)}
        className="mt-3 flex min-h-40 w-full flex-col items-center justify-center rounded-3xl bg-[#F5F5F4] p-4 ring-1 ring-black/5 active:scale-95 dark:bg-white/5 dark:ring-white/10"
      >
        {flipped ? (
          <>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{card.id}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Inggris: {card.en}</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Ketuk untuk membalik lagi</p>
          </>
        ) : (
          <>
            <p className="arabic text-5xl text-[#0B3D39] dark:text-[#D4AF37]">{card.arabic}</p>
            <p className="mt-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">{card.latin}</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Ketuk untuk melihat artinya</p>
          </>
        )}
      </button>
      <div className="mt-3 flex gap-2">
        <button onClick={markKnown} className="flex-1 rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]">
          Sudah Hafal
        </button>
        <button
          onClick={() => {
            setFlipped(false);
            setIdx((i) => (i + 1) % FLASHCARDS.length);
          }}
          className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold text-neutral-600 ring-1 ring-black/10 dark:bg-white/5 dark:text-neutral-300 dark:ring-white/15"
        >
          Lewati
        </button>
      </div>
    </Card>
  );
}

export default function BelajarPage() {
  const [tab, setTab] = useState<"quiz" | "kata">("quiz");
  return (
    <div>
      <PageHeader title="Belajar" subtitle="Latihan hitung dan kata Inggris/Arab" backHref="/" />
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setTab("quiz")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${tab === "quiz" ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/15"}`}
        >
          <Icon name="list" className="h-4 w-4" /> Soal Hitung
        </button>
        <button
          onClick={() => setTab("kata")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${tab === "kata" ? "bg-[#0A0A0A] text-white dark:bg-[#D4AF37] dark:text-[#0A0A0A]" : "bg-white text-neutral-600 ring-1 ring-black/10 dark:bg-[#171717] dark:text-neutral-300 dark:ring-white/15"}`}
        >
          <Icon name="book" className="h-4 w-4" /> Belajar Kata
        </button>
      </div>
      {tab === "quiz" ? <Quiz /> : <Flashcards />}
      <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Skor kuis 8/10 atau lebih memberi +10 poin. Kartu kata yang ditandai hafal mengisi misi
        &ldquo;Belajar kata&rdquo;.
      </p>
    </div>
  );
}
