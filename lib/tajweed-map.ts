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
// - U+06E5 (waw kecil) -> waw; U+06E6 (yeh kecil) -> yeh — keduanya
//   HURUF (dhamir -hu/-hi), bukan tanda; diperlukan untuk 327 tanda
//   maddah yang menempel padanya.
// - Iqlab/tanwin Uthmani [vokal + ۢ U+06E2 / ۭ U+06ED] -> satu tanwin.
// - Buang: tatweel, U+06DF, small-high U+06DD-U+06ED (KECUALI waw
//   kecil U+06E5 -> waw dan yeh kecil U+06E6 -> yeh), ZWNJ.
//   Tanda waqf U+06D6-U+06DC TETAP (ada di Simple — kecuali saktah
//   U+06DC: Simple hanya 5 dari 7).
// - Tanda maddah (U+0653) DIKEMBALIKAN ke teks Simple: setiap U+0653
//   di teks Uthmani adalah tanda mad panjang yang ditulis mushaf
//   (wajib/jaiz/lazim); teks Simple membuangnya. Posisi diambil dari
//   teks Uthmani lewat alignment (huruf pembawa maddah), BUKAN dari
//   tebakan. Pengecualian: bila huruf Simple-nya آ (U+0622, maddah
//   menyatu — mad badal, 2 ketukan) tidak ditambah lagi.
// - Tanda saktah (U+06DC, 7 tempat) DIKEMBALIKAN bila belum ada di
//   Simple (2 tempat: 2:245, 7:69 — pembawanya shad U+0635 di Uthmani,
//   sin U+0633 di Simple; kompat shad<->sin di alignCores). 5 saktah
//   lainnya sudah ada di Simple (idempoten — teks Simple menulisnya
//   sebagai token mandiri " ۜ ", kadang dengan sukun pada pembawa).
// - Tanda sifir DIKEMBALIKAN dari teks Uthmani POLOS (argumen
//   `uthmaniText`, sumber ketiga — teks tajwid HTML membuang hampir
//   semua sifir, jadi BUKAN sumber yang cukup): mustadir U+06DF
//   (3.988 — huruf diam, tidak dibaca) dan mustathil U+06E0 (66 —
//   dibaca saat waqaf, diam saat wasal). Posisi lewat alignment kedua
//   (core Uthmani polos <-> Simple) + fallback jangkar ≤3 karakter.
//   Bila `uthmaniText` tidak diberikan, sifir tidak dikembalikan
//   (degradasi anggun — waqaf + maddah tetap).
// - Tanda waqaf (U+06D6–U+06DC) sudah ada di teks Simple, jadi TIDAK
//   perlu dikembalikan — tapi di HTML ia dibungkus `<span class="wq">`
//   supaya tampil BESAR dan terbaca (font me_quran menggambarnya kecil
//   dan melayang tinggi di atas teks; CSS `.mushaf .wq { font-size:
//   1.4em }`). Di teks polos ia tampil apa adanya (bagian dari teks).
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
const SMALL_ZERO = "\u06df"; // sifir mustadir
const SMALL_RECT = "\u06e0"; // sifir mustathil
const SAKTAH = "\u06dc"; // saktah
// Tanda waqaf Mushaf Standar Indonesia (Kemenag): U+06D6–U+06DC.
const WAQAF_MARKS = new Set(["\u06d6", "\u06d7", "\u06d8", "\u06d9", "\u06da", "\u06db", "\u06dc"]);
const ZWNJ = "\u200c";
const SMALL_MEEM = "\u06e2"; // tanda iqlab
const SMALL_TANWIN_MARK = "\u06ed"; // tanda tanwin kasra
const VOWEL_TO_TANWIN: Record<string, string> = {
  "\u064e": "\u064b",
  "\u064f": "\u064c",
  "\u0650": "\u064d",
};

// Combining marks yang dilewati saat mencari huruf pembawa tanda maddah
// (U+0653 menempel tepat setelah huruf mad-nya). HURUF pembawa (alif,
// waw, ya, alef maksura, dagger alif, waw/yeh kecil, huruf muqatta'at)
// TIDAK ada di set ini — walk-back berhenti di huruf pertama.
const MADDAH_CARRIER_SKIP = new Set<string>([
  ..."\u064b\u064c\u064d\u064e\u064f\u0650\u0651\u0652", // tanwin, vokal, syaddah, sukun
  "\u0654",
  "\u0655",
  TATWEEL,
  SMALL_ZERO,
  SMALL_MEEM,
  SMALL_TANWIN_MARK,
  ...Array.from({ length: 0x06ee - 0x06dd }, (_, k) =>
    String.fromCodePoint(0x06dd + k)
  ).filter((c) => c !== "\u06e5" && c !== "\u06e6"),
]);

function isSmallHigh(ch: string): boolean {
  return ch >= "\u06dd" && ch <= "\u06ed";
}

function coreExpansion(ch: string): string[] {
  if (ch === "\u0671") return [ALIF]; // alif waslah
  if (ch === "\u0670" || ch === "\u0672") return [ALIF]; // dagger alif
  if (ch === "\u066e") return [ALIF]; // dotless beh -> alif
  if (ch === "\u06e5") return ["\u0648"]; // waw kecil (superscript) -> waw
  if (ch === "\u06e6") return ["\u064a"]; // yeh kecil (superscript) -> yeh
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
  plain: string; // teks Simple + tanda yang dikembalikan (maddah + sifir + saktah), tanpa warna
  kept: number;
  replaced: number;
  lost: number;
  lostReasons: Record<string, number>;
  errors: string[];
  problems: string[];
  splitMaps: number;
  maddahPlaced: number; // tanda maddah U+0653 yang dikembalikan
  maddahSkippedAlef: number; // maddah tidak ditambah (huruf Simple sudah آ U+0622)
  maddahAlreadyPresent: number; // maddah sudah ada di teks Simple (idempotensi)
  maddahFallback: number; // maddah dijangkar ke huruf sebelumnya (silah kubra)
  maddahUnplaced: string[]; // maddah gagal dipetakan (harus KOSONG)
  maddahByCarrierClass: Record<string, number>; // kelas huruf pembawa -> jumlah
  saktahPlaced: number; // saktah U+06DC yang dikembalikan (2:245, 7:69)
  saktahAlreadyPresent: number; // saktah sudah ada di teks Simple (5 tempat)
  saktahUnplaced: string[]; // saktah gagal dipetakan (harus KOSONG)
  zeroMustadirPlaced: number; // sifir mustadir U+06DF yang dikembalikan
  zeroMustathilPlaced: number; // sifir mustathil U+06E0 yang dikembalikan
  zeroAlreadyPresent: number; // sifir sudah ada di teks Simple (idempotensi)
  zeroFallback: number; // sifir dijangkar ke huruf sebelumnya
  zeroUnplaced: string[]; // sifir gagal dipetakan (harus KOSONG)
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
 * Alignment difflib pada core -> peta uth_core_pos -> sim_core_pos.
 * Dipakai dua kali per ayat: (1) sisi tajwid — warna + maddah + saktah;
 * (2) sisi Uthmani polos — sifir. Logikanya SATU (harus identik dengan
 * port Python), supaya differential test tetap byte-identik.
 * Blok replace: coba alignment ulang di dalam blok; bila masih replace,
 * padankan huruf yang sama secara berurutan; sisa lagi: padankan huruf
 * yang "kompatibel" (varian ejaan): yeh <-> alif dan shad <-> sin
 * (varian ejaan mushaf: يَبْصُطُ/يَبْسُطُ, بَصْطَةً/بَسْطَةً,
 * مُصَيْطِر/مُسَيْطِر — diperlukan supaya saktah 2:245 & 7:69 yang
 * pembawanya shad bisa dipetakan ke sin di Simple).
 */
function alignCores(uthCoreStr: string[], simCoreStr: string[]): Map<number, number> {
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
      // Sisa lagi: padankan huruf yang "kompatibel" (varian ejaan).
      remU = range(i1, i2).filter((p) => !doneU.has(p));
      remS = range(j1, j2).filter((p) => !doneS.has(p));
      const compat: Record<string, string> = {
        "\u064a": "\u0627",
        "\u0627": "\u064a",
        "\u0635": "\u0633",
        "\u0633": "\u0635",
      };
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
  return u2s;
}

/**
 * Tempatkan satu tanda yang dikembalikan (saktah/sifir) setelah huruf
 * Simple yang bersesuaian dengan huruf pembawanya di Uthmani.
 * Mengembalikan { target, fallbackUsed, status } dengan status salah satu
 * dari: "placed" (tanda disisipkan setelah target), "already" (tanda sudah
 * ada setelah target — idempoten), "unplaced" (pembawa tidak bisa dipetakan
 * — harus NOL di seluruh Qur'an).
 */
function placeRestoredMark(
  mark: string,
  idx: number,
  uthChars: string[],
  uthCorePositionsOfChar: Map<number, number[]>,
  u2s: Map<number, number>,
  simCharOfCorePos: Map<number, number>,
  simChars: string[]
): { target: number | null; fallbackUsed: boolean; status: "placed" | "already" | "unplaced" } {
  let j = idx - 1;
  while (j >= 0 && MADDAH_CARRIER_SKIP.has(uthChars[j])) j -= 1;
  if (j < 0) return { target: null, fallbackUsed: false, status: "unplaced" };
  const corePositions = uthCorePositionsOfChar.get(j) ?? [];
  let simPos: number | undefined;
  for (const cp of corePositions) {
    if (u2s.has(cp)) {
      simPos = u2s.get(cp);
      break;
    }
  }
  let fallbackUsed = false;
  if (simPos === undefined) {
    for (let k = j - 1; k >= Math.max(j - 3, 0); k--) {
      for (const cp of uthCorePositionsOfChar.get(k) ?? []) {
        if (u2s.has(cp)) {
          simPos = u2s.get(cp);
          fallbackUsed = true;
          break;
        }
      }
      if (simPos !== undefined) break;
    }
  }
  if (simPos === undefined) return { target: null, fallbackUsed, status: "unplaced" };
  const target = simCharOfCorePos.get(simPos);
  if (target === undefined) return { target: null, fallbackUsed, status: "unplaced" };
  // Idempotensi: tanda sudah ada setelah target — menempel langsung, atau
  // sebagai token mandiri setelah spasi dan/atau harakat pada huruf pembawa
  // (teks Simple menulis 5 saktah yang sudah ada sebagai " ۜ ", dan pada
  // 69:28/75:27/83:14 ada sukun pada huruf pembawa, mis. "مَالِيَهْ ۜ").
  const fwdSkip = new Set([" ", "\u064b", "\u064c", "\u064d", "\u064e", "\u064f", "\u0650", "\u0651", "\u0652"]);
  let k = target + 1;
  for (let step = 0; step < 5; step++) {
    if (k >= simChars.length) break;
    const c = simChars[k];
    if (c === mark) return { target, fallbackUsed, status: "already" };
    if (fwdSkip.has(c)) {
      k += 1;
      continue;
    }
    break;
  }
  return { target, fallbackUsed, status: "placed" };
}

/**
 * Pindahkan warna tajwid dari satu ayat Uthmani ke ayat Simple-nya.
 * Mengembalikan HTML teks Simple + <span class="tj tj-X">.
 * `uthmaniText` (teks Uthmani polos ayat yang sama) = sumber sifir;
 * bila tidak diberikan, sifir tidak dikembalikan (waqaf + maddah tetap).
 */
export function mapVerse(tajweedHtml: string, simpleText: string, uthmaniText?: string): MapResult {
  const parsed = parseTajweed(tajweedHtml);
  const uthChars = parsed.chars.map((tc) => tc.ch);
  const simChars = Array.from(simpleText);

  const uth = buildCore(uthChars, true);
  const sim = buildCore(simChars, false);
  const uthCoreStr = uth.coreStr;
  const simCoreStr = sim.coreStr;

  // Alignment difflib pada core (uth_core_pos -> sim_core_pos).
  const u2s = alignCores(uthCoreStr, simCoreStr);

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
    plain: "",
    kept: 0,
    replaced: 0,
    lost: 0,
    lostReasons: {},
    errors: [],
    problems: [...parsed.problems],
    splitMaps: 0,
    maddahPlaced: 0,
    maddahSkippedAlef: 0,
    maddahAlreadyPresent: 0,
    maddahFallback: 0,
    maddahUnplaced: [],
    maddahByCarrierClass: {},
    saktahPlaced: 0,
    saktahAlreadyPresent: 0,
    saktahUnplaced: [],
    zeroMustadirPlaced: 0,
    zeroMustathilPlaced: 0,
    zeroAlreadyPresent: 0,
    zeroFallback: 0,
    zeroUnplaced: [],
  };
  const mapped = new Set<number>();
  const lostItems: [number, TajweedChar][] = [];
  parsed.chars.forEach((tc, idx) => {
    if (tc.classes.size === 0) return;
    if (tc.ch === MADDAH) {
      // Tanda maddah bukan huruf: warnanya tidak ditransfer sebagai
      // huruf; nasibnya diaudit terpisah di logika maddah di bawah
      // (dikembalikan / sudah ada di آ / gagal) — bukan "lost".
      return;
    }
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

  // --- Kembalikan tanda maddah (U+0653) ---
  // Setiap U+0653 di teks Uthmani adalah tanda mad panjang yang ditulis
  // mushaf (wajib 4–5, jaiz 2/4/5, lazim 6 ketukan); teks Simple
  // membuangnya. Kembalikan tepat setelah huruf Simple yang bersesuaian
  // dengan huruf pembawa maddah di Uthmani (lewat alignment di atas —
  // BUKAN tebakan posisi). Dua pengecualian, keduanya terverifikasi:
  // (a) huruf Simple-nya آ (U+0622, maddah menyatu — mad badal,
  // 2 ketukan): tandanya sudah ada di huruf itu, jangan ditambah;
  // (b) teks Simple sudah mengandung U+0653 tepat setelah huruf itu
  // (idempotensi — mis. teks tertanam yang sudah dibubuhi maddah).
  // Tanda maddah adalah BAGIAN TEKS (bukan warna): ia masuk ke
  // plain (dipakai mode tajwid OFF + Yasin) DAN ke mappedHtml
  // (di dalam span warna huruf pembawanya, mode ON).
  const maddahAfter = new Set<number>();
  parsed.chars.forEach((tc, idx) => {
    if (tc.ch !== MADDAH) return;
    // Cari huruf pembawa: mundur melewati combining marks.
    let j = idx - 1;
    while (j >= 0 && MADDAH_CARRIER_SKIP.has(parsed.chars[j].ch)) j -= 1;
    if (j < 0) {
      res.maddahUnplaced.push(`maddah idx ${idx} tanpa huruf pembawa`);
      return;
    }
    const carrier = parsed.chars[j];
    const corePositions = uthCorePositionsOfChar.get(j) ?? [];
    // Jalur normal: posisi core pembawa terpetakan ke Simple.
    let simPos: number | undefined;
    for (const cp of corePositions) {
      if (u2s.has(cp)) {
        simPos = u2s.get(cp);
        break;
      }
    }
    let fallbackUsed = false;
    if (simPos === undefined) {
      // Fallback: huruf pembawa TIDAK punya padanan huruf di Simple.
      // Kasus nyatanya: waw/yeh kecil ۥ/ۦ pada dhamir ـهُ/ـهِ (mad
      // silah kubra, 4–5 ketukan) — di Simple, vokal panjang itu
      // ditulis sebagai harakat pendek (kasra/damma) pada huruf
      // dhamir, tanpa huruf. Jangkar maddah: karakter Uthmani
      // terdekat SEBELUM pembawa yang punya posisi core terpetakan
      // (praktiknya selalu harakat pada huruf dhamir itu, tepat
      // sebelum pembawa). Posisi ini ditentukan alignment, bukan
      // tebakan; pencarian dibatasi 3 karakter ke belakang supaya
      // jangkar tidak pernah jauh dari pembawa.
      for (let k = j - 1; k >= Math.max(j - 3, 0); k--) {
        for (const cp of uthCorePositionsOfChar.get(k) ?? []) {
          if (u2s.has(cp)) {
            simPos = u2s.get(cp);
            fallbackUsed = true;
            break;
          }
        }
        if (simPos !== undefined) break;
      }
    }
    if (simPos === undefined) {
      res.maddahUnplaced.push(
        `maddah idx ${idx} pembawa ${JSON.stringify(carrier.ch)} tidak terpetakan ke Simple`
      );
      return;
    }
    const target = simCharOfCorePos.get(simPos);
    if (target === undefined) {
      res.maddahUnplaced.push(
        `maddah idx ${idx} pembawa ${JSON.stringify(carrier.ch)} tanpa huruf Simple`
      );
      return;
    }
    const targetCh = simChars[target];
    if (targetCh === "\u0622") {
      // alef maddah — tandanya sudah menyatu
      res.maddahSkippedAlef += 1;
      return;
    }
    if (target + 1 < simChars.length && simChars[target + 1] === MADDAH) {
      res.maddahAlreadyPresent += 1;
      return;
    }
    maddahAfter.add(target);
    res.maddahPlaced += 1;
    if (fallbackUsed) res.maddahFallback += 1;
    const key = pickClass(carrier.classes) ?? "(tanpa kelas)";
    res.maddahByCarrierClass[key] = (res.maddahByCarrierClass[key] ?? 0) + 1;
  });

  // --- Kembalikan tanda saktah (U+06DC) ---
  // Teks Simple memuat 5 dari 7 saktah; 2 hilang (2:245, 7:69) karena
  // pembawanya shad U+0635 di Uthmani tapi sin U+0633 di Simple
  // (varian ejaan mushaf — kompat shad<->sin di alignCores).
  // Saktah ada di teks tajwid HTML (7/7), jadi sumbernya parsed.chars
  // (sisi tajwid) — sama seperti maddah. Tanda saktah adalah BAGIAN
  // TEKS: masuk ke plain DAN ke mapped_html (dengan span wq, seperti
  // tanda waqaf lainnya — lihat render di bawah).
  const saktahAfter = new Set<number>();
  parsed.chars.forEach((tc, idx) => {
    if (tc.ch !== SAKTAH) return;
    const { target, status } = placeRestoredMark(
      SAKTAH,
      idx,
      uthChars,
      uthCorePositionsOfChar,
      u2s,
      simCharOfCorePos,
      simChars
    );
    if (status === "placed" && target !== null) {
      saktahAfter.add(target);
      res.saktahPlaced += 1;
    } else if (status === "already") {
      res.saktahAlreadyPresent += 1;
    } else {
      res.saktahUnplaced.push(`saktah idx ${idx} pembawa tidak terpetakan ke Simple`);
    }
  });

  // --- Kembalikan tanda sifir (U+06DF mustadir, U+06E0 mustathil) ---
  // Sumbernya teks Uthmani POLOS (uthmaniText) — teks tajwid HTML
  // membuang hampir semua sifir (hanya 66/3.988 mustadir + 1/66
  // mustathil yang tersisa), jadi BUKAN sumber yang cukup. Alignment
  // kedua (core Uthmani polos <-> Simple) dibangun terpisah; posisi
  // diambil dari huruf pembawa sifir di Uthmani, BUKAN tebakan.
  // Sifir adalah BAGIAN TEKS: masuk ke plain DAN ke mapped_html
  // (di dalam span warna huruf pembawanya, seperti maddah — tanpa
  // span sendiri, karena tandanya menempel pada huruf diamnya).
  // Urutan sisipan setelah satu huruf yang sama: maddah dulu, lalu
  // sifir — mengikuti urutan Uthmani (11 ayat: maddah pada huruf mad,
  // sifir pada alif fariqah berikutnya yang dibuang di Simple, mis.
  // 2:221 ادْعُوٓا۟ -> وٓ۟).
  const zeroAfter = new Map<number, string>(); // target idx -> tanda (U+06DF / U+06E0)
  if (uthmaniText) {
    const uthPlainChars = Array.from(uthmaniText);
    const uth2 = buildCore(uthPlainChars, true);
    const u2sUth = alignCores(uth2.coreStr, sim.coreStr);
    const uth2CorePositionsOfChar = new Map<number, number[]>();
    uth2.core.forEach((entry, pos) => {
      for (const ci of entry.src) {
        const lst = uth2CorePositionsOfChar.get(ci) ?? [];
        lst.push(pos);
        uth2CorePositionsOfChar.set(ci, lst);
      }
    });
    uthPlainChars.forEach((ch, idx) => {
      if (ch !== SMALL_ZERO && ch !== SMALL_RECT) return;
      const { target, fallbackUsed, status } = placeRestoredMark(
        ch,
        idx,
        uthPlainChars,
        uth2CorePositionsOfChar,
        u2sUth,
        simCharOfCorePos,
        simChars
      );
      if (status === "placed" && target !== null) {
        zeroAfter.set(target, ch);
        if (ch === SMALL_ZERO) res.zeroMustadirPlaced += 1;
        else res.zeroMustathilPlaced += 1;
        if (fallbackUsed) res.zeroFallback += 1;
      } else if (status === "already") {
        res.zeroAlreadyPresent += 1;
      } else {
        res.zeroUnplaced.push(`sifir ${JSON.stringify(ch)} idx ${idx} pembawa tidak terpetakan ke Simple`);
      }
    });
  }

  // Render HTML: gabungkan run huruf berurutan dengan kelas yang sama.
  // Tanda maddah + sifir disisipkan tepat setelah huruf pembawanya —
  // di dalam span warna yang sama bila hurufnya berwarna, sebagai teks
  // polos bila tidak (urutan: maddah dulu, lalu sifir — urutan Uthmani).
  // Tanda saktah yang disisipkan (2 tempat) dirender dalam span wq
  // sendiri (tutup span warna sementara, lalu buka lagi) — sama seperti
  // tanda waqaf yang sudah ada di teks Simple: tiap tanda waqaf
  // (U+06D6–U+06DC) dibungkus <span class="wq"> supaya tampil besar
  // dan terbaca di font me_quran (CSS .mushaf .wq, 1.4em) — TANPA
  // mengubah kelas warna tajwid huruf di sekitarnya.
  const out: string[] = [];
  let cur: string | null = null; // kelas span yang sedang terbuka: nama kelas tj, "wq", atau null
  simChars.forEach((ch, idx) => {
    const cls = WAQAF_MARKS.has(ch)
      ? "wq"
      : pickClass(simClasses.get(idx) ?? new Set<string>());
    if (cls !== cur) {
      if (cur !== null) out.push("</span>");
      if (cls !== null) {
        if (cls === "wq") out.push(`<span class="wq">`);
        else out.push(`<span class="tj tj-${cls}">`);
      }
      cur = cls;
    }
    out.push(ch);
    if (maddahAfter.has(idx)) out.push(MADDAH);
    const zero = zeroAfter.get(idx);
    if (zero !== undefined) out.push(zero);
    if (saktahAfter.has(idx)) {
      // Saktah = tanda waqaf yang berdiri sendiri: tutup span warna,
      // render dalam span wq, lalu biarkan huruf berikutnya membuka
      // span-nya sendiri (cur=null).
      if (cur !== null) {
        out.push("</span>");
        cur = null;
      }
      out.push(`<span class="wq">`);
      out.push(SAKTAH);
      out.push("</span>");
    }
  });
  if (cur !== null) out.push("</span>");
  res.mappedHtml = out.join("");
  res.plain = simChars
    .map(
      (ch, i) =>
        ch +
        (maddahAfter.has(i) ? MADDAH : "") +
        (zeroAfter.get(i) ?? "") +
        (saktahAfter.has(i) ? SAKTAH : "")
    )
    .join("");
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
 * fetchSurahText (sudah dinormalisasi), `uthmaniLines` = teks Uthmani
 * polos dari fetchSurahUthmani (sumber sifir; boleh tidak ada — sifir
 * tidak dikembalikan bila tidak ada). Mengembalikan per ayat:
 * `html` (teks Simple + warna tajwid + maddah + sifir + saktah) dan
 * `plain` (teks Simple + tanda yang dikembalikan, tanpa warna — dipakai
 * saat toggle Warna Tajwid OFF dan di Yasin). Bila jumlah baris tidak
 * sama, kembalikan null (pemanggil memakai teks polos).
 */
export function mapTajweedSurah(
  tajweedLines: string[],
  simpleLines: string[],
  uthmaniLines?: string[]
): { html: string; plain: string }[] | null {
  if (tajweedLines.length !== simpleLines.length) return null;
  if (uthmaniLines !== undefined && uthmaniLines.length !== simpleLines.length) return null;
  return tajweedLines.map((line, i) => {
    const r = mapVerse(line, normalizeArabicText(simpleLines[i]), uthmaniLines?.[i]);
    return { html: r.mappedHtml, plain: r.plain };
  });
}
