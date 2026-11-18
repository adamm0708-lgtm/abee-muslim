import type { Metadata, Viewport } from "next";
import { ProgressProvider } from "@/lib/store";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { BottomNav } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABEE Muslim — Belajar Islam & Ibadah",
  description:
    "Aplikasi belajar Islam dan ibadah untuk semua orang: jadwal shalat, doa harian, dzikir, tasbih digital, hafalan Juz 30, dan misi harian. Oleh ABEE MotionVerse.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F766E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ProgressProvider>
          <ThemeProvider>
          <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-24 dark:bg-[#0B2E26]">
            <header className="flex items-center justify-between px-4 pb-1 pt-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-abee-green text-lg font-extrabold text-white">
                  A
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-extrabold text-abee-ink dark:text-[#F7F2E7]">ABEE Muslim</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#A8C3B5]">Belajar Islam &amp; Ibadah</p>
                </div>
              </div>
              <span className="rounded-full bg-abee-gold/20 px-3 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                ABEE MotionVerse
              </span>
            </header>
            <main className="px-4 pt-2">{children}</main>
          </div>
          <BottomNav />
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
