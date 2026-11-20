// Port TypeScript dari mapper Python (~/workspace/tajwid-simple-work/map_tajwid.py).
// Memindahkan warna tajwid dari teks Uthmani (Quran.com text_uthmani_tajweed)
// ke teks Simple (Quran.com text_imlaei). Referensi kebenaran = mapper Python;
// differential test (scripts/diff-tajweed-map.mjs) membandingkan output TS
// dengan mapped_all.json hasil Python untuk SELURUH 6.236 ayat — harus
// byte-identik. Jangan ubah logika tanpa menjalankan differential test.
//
// Aturan yang dipindahkan (bukan aturan tajwid baru — hanya pemindahan):
// - alignment difflib PER AYAT pada "core" (normalisasi ejaan), bukan per kata.
// - U+0671/U+0670/U+0672 -> alif; U+066E (dotless beh) -> alif.
// - U+0623/U+0625 -> [alif, hamza]; U+0626 -> [yeh, hamza]; U+0624 -> [waw, hamza];
//   hamza combining U+0654/U+0655 -> hamza.
// - U+0649/U+064A (alef maksura/yeh) disamakan -> yeh.
// - U+0622 (alef maddah) -> alif.
// - Iqlab/tanwin Uthmani [vokal + ۢ U+06E2 / ۭ U+06ED] -> satu tanwin.
// - Buang: tatweel, maddah U+0653, U+06DF, small-high U+06DD-U+06ED, ZWNJ.
//   Tanda waqf U+06D6-U+06DC TETAP (ada di Simple).
// - Sisi tajwid: [alif, tanwin] -> [tanwin, alif]; [alif, syaddah, tanwin]
//   -> [syaddah, tanwin, alif].

import { normalizeArabicText } from "./reading";

// ---------------------------------------------------------------------------
// Konstanta karakter
// ---------------------------------------------------------------------------

const TANWIN = new Set(["\u064b", "\u064c", "\u064d"]); // fathatan, dammatan, kasratan
const ALIF = "\u0627";
const TATWEEL = "\u0640";
const MADDAH = "\u0653";
const SMALL_ZERO = "\u06df";
const ZWNJ = "\u200c";
const SMALL_MEEM = "\u06e2"; // tanda iqlab
const SMALL_TANWIN_MARK = "\u06ed"; // tanda tanwin kasra
const VOWEL_TO_TANWIN: Record<string, string> = {
  "\u064e": "\u064b",
  "\u064f": "\u064c",
  "\u0650": "\u064d",
};

function isSmallHigh(ch: string): boolean {
  return ch >= "\u06dd" && ch <= "\u06ed";
}

function coreExpansion(ch: string): string[] {
  if (ch === "\u0671") return [ALIF]; // alif waslah
  if (ch === "\u0670" || ch === "\u0672") return [ALIF]; // dagger alif
  if (ch === "\u066e") return [ALIF]; // dotless beh -> alif
  if (ch === "\u0623") return [ALIF, "\u0621"]; // alif + hamza above
  if (ch === "\u0625") return [ALIF, "\u0621"]; // alif + hamza below
  if (ch === "\u0626") return ["\u064a", "\u0621"]; // yeh + hamza
  if (ch === "\u0624") return ["\u0648", "\u0621"]; // waw + hamza
  if (ch === "\u0622") return [ALIF]; // alef maddah
  if (ch === "\u0654" || ch === "\u0655") return ["\u0621"]; // combining hamza
  if (ch === "\u0649" || ch === "\u064a") return ["\u064a"]; // alef maksura / yeh
  if (ch === TATWEEL || ch === MADDAH || ch === SMALL_ZERO || ch === ZWNJ) return [];
  if (isSmallHigh(ch)) return [];
  return [ch];
}

// ---------------------------------------------------------------------------
// Parser HTML tajwid (stack-based, toleran terhadap tag rusak)
// ---------------------------------------------------------------------------

const TAG_RE = /<(\/?)([a-zA-Z]+)([^>]*)>/;
const CLASS_RE = /class\s*=\s*([a-zA-Z0-9_]+)/;

export type TajweedChar = { ch: string; classes: ReadonlySet<string> };
export type ParsedTajweed = {
  chars: TajweedChar[];
  endMarker: string;
  problems: string[];
};

export function parseTajweed(html: string): ParsedTajweed {
  const chars: TajweedChar[] = [];
  const stack: string[] = [];
  const problems: string[] = [];
  let endMarker = "";
  let i = 0;
  const n = html.length;
  while (i < n) {
    const c = html[i];
    if (c === "<") {
      const m = TAG_RE.exec(html.slice(i));
      if (!m || m.index !== 0) {
        problems.push(`broken tag at offset ${i}: ${JSON.stringify(html.slice(i, i + 30))}`);
        i += 1;
        continue;
      }
      const closing = m[1];
      const tag = m[2];
      const attrs = m[3];
      if (tag === "tajweed" && !closing) {
        const cm = CLASS_RE.exec(attrs);
        const cls = cm ? cm[1] : "";
        if (cls) stack.push(cls);
        else problems.push(`tajweed tanpa class at ${i}`);
      } else if (tag === "tajweed" && closing) {
        if (stack.length > 0) stack.pop();
        else problems.push(`tajweed penutup tanpa pembuka at ${i}`);
      } else if (tag === "span" && !closing && attrs.includes("end")) {
        const end = html.indexOf("</span>", i + m[0].length);
        if (end === -1) {
          problems.push("span end tanpa penutup");
          i = i + m[0].length;
          continue;
        }
        endMarker = html.slice(i + m[0].length, end);
        i = end + "</span>".length;
        continue;
      } else {
        problems.push(`tag tak dikenal at ${i}: ${JSON.stringify(m[0])}`);
      }
      i += m[0].length;
    } else {
      chars.push({ ch: c, classes: new Set(stack) });
      i += 1;
    }
  }
  if (stack.length > 0) problems.push(`span tak tertutup di akhir: ${stack.join(",")}`);
  return { chars, endMarker, problems };
}

// ---------------------------------------------------------------------------
// difflib.SequenceMatcher — port setia dari CPython (autojunk=False).
// Tie-breaking dan urutan blok harus sama persis dengan Python, karena
// mapper membandingkannya lewat differential test.
// ---------------------------------------------------------------------------

type Match = { a: number; b: number; size: number };

class SequenceMatcher {
  private a: string[];
  private b: string[];
  private b2j = new Map<string, number[]>();
  private matchingBlocks: Match[] | null = null;
  private opcodes: [string, number, number, number, number][] | null = null;

  constructor(a: string[], b: string[]) {
    this.a = a;
    this.b = b;
    for (let i = 0; i < b.length; i++) {
      const elt = b[i];
      let arr = this.b2j.get(elt);
      if (!arr) {
        arr = [];
        this.b2j.set(elt, arr);
      }
      arr.push(i);
    }
  }

  private findLongestMatch(alo: number, ahi: number, blo: number, bhi: number): Match {
    const a = this.a;
    const b = this.b;
    const b2j = this.b2j;
    let besti = alo;
    let bestj = blo;
    let bestsize = 0;
    let j2len = new Map<number, number>();
    for (let i = alo; i < ahi; i++) {
      const newj2len = new Map<number, number>();
      const indices = b2j.get(a[i]) ?? [];
      for (const j of indices) {
        if (j < blo) continue;
        if (j >= bhi) break;
        const k = (j2len.get(j - 1) ?? 0) + 1;
        newj2len.set(j, k);
        if (k > bestsize) {
          besti = i - k + 1;
          bestj = j - k + 1;
          bestsize = k;
        }
      }
      j2len = newj2len;
    }
    // Perluas kecocokan (no-op bila tidak ada junk; dipertahankan demi kesetiaan).
    while (besti > alo && bestj > blo && a[besti - 1] === b[bestj - 1]) {
      besti -= 1;
      bestj -= 1;
      bestsize += 1;
    }
    while (
      besti + bestsize < ahi &&
      bestj + bestsize < bhi &&
      a[besti + bestsize] === b[bestj + bestsize]
    ) {
      bestsize += 1;
    }
    return { a: besti, b: bestj, size: bestsize };
  }

  getMatchingBlocks(): Match[] {
    if (this.matchingBlocks) return this.matchingBlocks;
    const la = this.a.length;
    const lb = this.b.length;
    const queue: [number, number, number, number][] = [[0, la, 0, lb]];
    const matchingBlocks: Match[] = [];
    while (queue.length > 0) {
      const [alo, ahi, blo, bhi] = queue.pop()!;
      const { a: i, b: j, size: k } = this.findLongestMatch(alo, ahi, blo, bhi);
      if (k) {
        matchingBlocks.push({ a: i, b: j, size: k });
        if (alo < i && blo < j) queue.push([alo, i, blo, j]);
        if (i + k < ahi && j + k < bhi) queue.push([i + k, ahi, j + k, bhi]);
      }
    }
    matchingBlocks.sort((x, y) => x.a - y.a || x.b - y.b || x.size - y.size);
    // Gabungkan blok yang bersebelahan.
    const nonAdjacent: Match[] = [];
    let i1 = 0;
    let j1 = 0;
    let k1 = 0;
    for (const { a: i2, b: j2, size: k2 } of matchingBlocks) {
      if (i1 + k1 === i2 && j1 + k1 === j2) {
        k1 += k2;
      } else {
        if (k1) nonAdjacent.push({ a: i1, b: j1, size: k1 });
        i1 = i2;
        j1 = j2;
        k1 = k2;
      }
    }
    if (k1) nonAdjacent.push({ a: i1, b: j1, size: k1 });
    nonAdjacent.push({ a: la, b: lb, size: 0 });
    this.matchingBlocks = nonAdjacent;
    return this.matchingBlocks;
  }

  getOpcodes(): [string, number, number, number, number][] {
    if (this.opcodes) return this.opcodes;
    let i = 0;
    let j = 0;
    const answer: [string, number, number, number, number][] = [];
    for (const { a: ai, b: bj, size } of this.getMatchingBlocks()) {
      let tag = "";
      if (i < ai && j < bj) tag = "replace";
      else if (i < ai) tag = "delete";
      else if (j < bj) tag = "insert";
      if (tag) answer.push([tag, i, ai, j, bj]);
      i = ai + size;
      j = bj + size;
      if (size) answer.push(["equal", ai, i, bj, j]);
    }
    this.opcodes = answer;
    return answer;
  }
}

// ---------------------------------------------------------------------------
// Alignment core Uthmani <-> Simple
// ---------------------------------------------------------------------------

const MADDA_CLASSES = new Set([
  "madda_normal",
  "madda_permissible",
  "madda_necessary",
  "madda_obligatory",
]);

const CLASS_PRIORITY = [
  "madda_obligatory",
  "madda_necessary",
  "madda_permissible",
  "madda_normal",
  "ghunnah",
  "qalaqah",
  "ikhafa",
  "ikhafa_shafawi",
  "idgham_ghunnah",
  "idgham_wo_ghunnah",
  "idgham_shafawi",
  "idgham_mutajanisayn",
  "idgham_mutaqaribayn",
  "iqlab",
  "laam_shamsiyah",
  "ham_wasl",
  "slnt",
];

function pickClass(classes: ReadonlySet<string>): string | null {
  if (classes.size === 0) return null;
  for (const c of CLASS_PRIORITY) {
    if (classes.has(c)) return c;
  }
  return [...classes].sort()[0];
}

type CoreEntry = { ch: string; src: number[] };

function buildCore(
  items: string[],
  swapTanwin: boolean
): { coreStr: string[]; core: CoreEntry[] } {
  const core: CoreEntry[] = [];
  let i = 0;
  const n = items.length;
  while (i < n) {
    const ch = items[i];
    // Iqlab / tanwin Uthmani: [vokal + ۢ/ۭ] -> satu tanwin.
    if (
      ch in VOWEL_TO_TANWIN &&
      i + 1 < n &&
      (items[i + 1] === SMALL_MEEM || items[i + 1] === SMALL_TANWIN_MARK)
    ) {
      const tanwin = VOWEL_TO_TANWIN[ch];
      core.push({ ch: tanwin, src: [i, i + 1] });
      i += 2;
      continue;
    }
    for (const cc of coreExpansion(ch)) {
      core.push({ ch: cc, src: [i] });
    }
    i += 1;
  }
  let out = core;
  if (swapTanwin) {
    const swapped: CoreEntry[] = [];
    let j = 0;
    while (j < out.length) {
      if (
        j + 2 < out.length &&
        out[j].ch === ALIF &&
        out[j + 1].ch === "\u0651" &&
        TANWIN.has(out[j + 2].ch)
      ) {
        // [alif, syaddah, tanwin] -> [syaddah, tanwin, alif]
        swapped.push(out[j + 1], out[j + 2], out[j]);
        j += 3;
      } else if (j + 1 < out.length && out[j].ch === ALIF && TANWIN.has(out[j + 1].ch)) {
        // [alif, tanwin] -> [tanwin, alif]
        swapped.push(out[j + 1], out[j]);
        j += 2;
      } else {
        swapped.push(out[j]);
        j += 1;
      }
    }
    out = swapped;
  }
  return { coreStr: out.map((e) => e.ch), core: out };
}

export type MapResult = {
  mappedHtml: string;
  kept: number;
  replaced: number;
  lost: number;
  lostReasons: Record<string, number>;
  errors: string[];
  problems: string[];
  splitMaps: number;
};

function neighborKeepsColor(
  idx: number,
  classes: ReadonlySet<string>,
  uthChars: TajweedChar[],
  mapped: Set<number>
): string | null {
  for (const j of [idx - 2, idx - 1, idx + 1, idx + 2]) {
    if (j >= 0 && j < uthChars.length) {
      const tc = uthChars[j];
      let shared = false;
      for (const c of tc.classes) {
        if (classes.has(c)) {
          shared = true;
          break;
        }
      }
      if (shared && mapped.has(j)) return tc.ch;
    }
  }
  return null;
}

function lossReason(
  ch: string,
  classes: ReadonlySet<string>,
  idx: number,
  uthChars: TajweedChar[],
  mapped: Set<number>
): string {
  if (ch === TATWEEL) return "tatweel (tidak ada di Simple)";
  if (ch === MADDAH) return "maddah U+0653 (tidak ada di Simple)";
  if (ch === SMALL_ZERO) return "U+06DF huruf diam (tidak ada di Simple)";
  if (ch === SMALL_MEEM) {
    if (idx > 0 && uthChars[idx - 1].ch === "\u0646" && mapped.has(idx - 1)) {
      return "tanda iqlab pada nun sakinah (petunjuk baca; warna tetap pada nun)";
    }
    return "small-high mark (tidak ada di Simple)";
  }
  if (isSmallHigh(ch)) return "small-high mark (tidak ada di Simple)";
  if (ch === ZWNJ) return "ZWNJ (tidak ada di Simple)";
  if (TANWIN.has(ch)) return "tanwin tanpa padanan";
  if (ch === "\u0652") return "sukun pada huruf diam (tidak ada di Simple)";
  if (ch === "\u0648" && classes.has("slnt")) {
    return "waw diam menjadi alif di Simple (slnt hilang, madda tetap pada alif)";
  }
  if (ch === ALIF && classes.has("slnt")) return "alif fariqah diam (tidak ada di Simple)";
  if (ch === "\u064a" && classes.has("slnt")) return "yeh diam (tidak ada di Simple)";
  if (ch === "\u0649" && classes.has("slnt")) return "alef maksura diam (tidak ada di Simple)";
  if (ch === "\u0654" || ch === "\u0655") return "hamza combining (tidak ada di Simple)";
  if (ch === "\u066e" || ch === "\u0670" || ch === "\u0672") {
    const nb = neighborKeepsColor(idx, classes, uthChars, mapped);
    if (nb !== null) return "menyatu menjadi satu alif di Simple (warna tetap pada alif)";
    return `huruf ${JSON.stringify(ch)} (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}) tanpa padanan Simple`;
  }
  if (
    ch === "\u064e" ||
    ch === "\u064f" ||
    ch === "\u0650" ||
    ch === "\u0627" ||
    ch === "\u0649"
  ) {
    const nb = neighborKeepsColor(idx, classes, uthChars, mapped);
    if (nb !== null) return "menyatu dengan huruf tetangga (warna tetap pada huruf Simple)";
  }
  return `huruf ${JSON.stringify(ch)} (U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}) tanpa padanan Simple`;
}

/**
 * Pindahkan warna tajwid dari satu ayat Uthmani ke ayat Simple-nya.
 * Mengembalikan HTML teks Simple + <span class="tj tj-X">.
 */
export function mapVerse(tajweedHtml: string, simpleText: string): MapResult {
  const parsed = parseTajweed(tajweedHtml);
  const uthChars = parsed.chars.map((tc) => tc.ch);
  const simChars = Array.from(simpleText);

  const uth = buildCore(uthChars, true);
  const sim = buildCore(simChars, false);
  const uthCoreStr = uth.coreStr;
  const simCoreStr = sim.coreStr;

  // Alignment difflib pada core.
  const sm = new SequenceMatcher(uthCoreStr, simCoreStr);
  const u2s = new Map<number, number>();
  for (const [tag, i1, i2, j1, j2] of sm.getOpcodes()) {
    if (tag === "equal") {
      for (let k = 0; k < i2 - i1; k++) u2s.set(i1 + k, j1 + k);
    } else if (tag === "replace") {
      const sub = new SequenceMatcher(uthCoreStr.slice(i1, i2), simCoreStr.slice(j1, j2));
      const doneU = new Set<number>();
      const doneS = new Set<number>();
      for (const [t2, a1, a2, b1, b2] of sub.getOpcodes()) {
        if (t2 === "equal") {
          for (let k = 0; k < a2 - a1; k++) {
            u2s.set(i1 + a1 + k, j1 + b1 + k);
            doneU.add(i1 + a1 + k);
            doneS.add(j1 + b1 + k);
          }
        }
      }
      // Sisa di blok replace: padankan huruf yang sama secara berurutan.
      let remU = range(i1, i2).filter((p) => !doneU.has(p));
      let remS = range(j1, j2).filter((p) => !doneS.has(p));
      const sByCh = new Map<string, number[]>();
      for (const p of remS) {
        const lst = sByCh.get(simCoreStr[p]) ?? [];
        lst.push(p);
        sByCh.set(simCoreStr[p], lst);
      }
      for (const p of remU) {
        const lst = sByCh.get(uthCoreStr[p]);
        if (lst && lst.length > 0) {
          const t = lst.shift()!;
          u2s.set(p, t);
          doneU.add(p);
          doneS.add(t);
        }
      }
      // Sisa lagi: padankan huruf yang "kompatibel" (yeh <-> alif).
      remU = range(i1, i2).filter((p) => !doneU.has(p));
      remS = range(j1, j2).filter((p) => !doneS.has(p));
      const compat: Record<string, string> = { "\u064a": "\u0627", "\u0627": "\u064a" };
      const sByCompat = new Map<string, number[]>();
      for (const p of remS) {
        const lst = sByCompat.get(simCoreStr[p]) ?? [];
        lst.push(p);
        sByCompat.set(simCoreStr[p], lst);
      }
      for (const p of remU) {
        const want = compat[uthCoreStr[p]];
        if (want) {
          const lst = sByCompat.get(want);
          if (lst && lst.length > 0) u2s.set(p, lst.shift()!);
        }
      }
    }
    // 'delete' dan 'insert': tidak ada pemetaan.
  }

  // Peta posisi core -> posisi karakter asli.
  const uthCorePositionsOfChar = new Map<number, number[]>();
  uth.core.forEach((entry, pos) => {
    for (const idx of entry.src) {
      const lst = uthCorePositionsOfChar.get(idx) ?? [];
      lst.push(pos);
      uthCorePositionsOfChar.set(idx, lst);
    }
  });
  const simCharOfCorePos = new Map<number, number>();
  sim.core.forEach((entry, pos) => {
    simCharOfCorePos.set(pos, entry.src[0]);
  });

  // Transfer kelas.
  const simClasses = new Map<number, Set<string>>();
  const res: MapResult = {
    mappedHtml: "",
    kept: 0,
    replaced: 0,
    lost: 0,
    lostReasons: {},
    errors: [],
    problems: [...parsed.problems],
    splitMaps: 0,
  };
  const mapped = new Set<number>();
  const lostItems: [number, TajweedChar][] = [];
  parsed.chars.forEach((tc, idx) => {
    if (tc.classes.size === 0) return;
    const cls = pickClass(tc.classes)!;
    const corePositions = uthCorePositionsOfChar.get(idx) ?? [];
    const targetChars = new Set<number>();
    for (const pos of corePositions) {
      const simPos = u2s.get(pos);
      if (simPos !== undefined) {
        const t = simCharOfCorePos.get(simPos);
        if (t !== undefined) targetChars.add(t);
      }
    }
    if (targetChars.size === 0) {
      res.lost += 1;
      lostItems.push([idx, tc]);
      return;
    }
    mapped.add(idx);
    if (targetChars.size > 1) {
      res.splitMaps += 1;
      res.errors.push(
        `huruf Uthmani ${JSON.stringify(tc.ch)} (idx ${idx}) memetakan ke >1 huruf Simple: ${[...targetChars]
          .sort((a, b) => a - b)
          .map((t) => simChars[t])
          .join(",")}`
      );
    }
    for (const simIdx of targetChars) {
      const s = simClasses.get(simIdx) ?? new Set<string>();
      s.add(cls);
      simClasses.set(simIdx, s);
    }
    const first = simChars[[...targetChars].sort((a, b) => a - b)[0]];
    if (first === tc.ch) res.kept += 1;
    else res.replaced += 1;
  });
  for (const [idx, tc] of lostItems) {
    const reason = lossReason(tc.ch, tc.classes, idx, parsed.chars, mapped);
    res.lostReasons[reason] = (res.lostReasons[reason] ?? 0) + 1;
  }

  // Render HTML: gabungkan run huruf berurutan dengan kelas yang sama.
  const out: string[] = [];
  let cur: string | null = null;
  simChars.forEach((ch, idx) => {
    const cls = pickClass(simClasses.get(idx) ?? new Set<string>());
    if (cls !== cur) {
      if (cur !== null) out.push("</span>");
      if (cls !== null) out.push(`<span class="tj tj-${cls}">`);
      cur = cls;
    }
    out.push(ch);
  });
  if (cur !== null) out.push("</span>");
  res.mappedHtml = out.join("");
  return res;
}

function range(a: number, b: number): number[] {
  const r: number[] = [];
  for (let i = a; i < b; i++) r.push(i);
  return r;
}

/**
 * Pindahkan warna tajwid untuk satu surah penuh. `tajweedLines` = baris
 * mentah dari fetchSurahTajweed, `simpleLines` = teks Simple dari
 * fetchSurahText (sudah dinormalisasi). Mengembalikan HTML per ayat.
 * Bila jumlah baris tidak sama, kembalikan null (pemanggil memakai teks polos).
 */
export function mapTajweedSurah(
  tajweedLines: string[],
  simpleLines: string[]
): string[] | null {
  if (tajweedLines.length !== simpleLines.length) return null;
  return tajweedLines.map((line, i) => mapVerse(line, normalizeArabicText(simpleLines[i])).mappedHtml);
}
