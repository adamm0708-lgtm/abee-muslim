import type { Metadata, Viewport } from "next";
import { ProgressProvider } from "@/lib/store";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { BottomNav, SiteHeader } from "@/components/ui";
import { PwaRegister, InstallPromptModal } from "@/components/pwa";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABEE Muslim — Belajar Islam & Ibadah",
  description:
    "Aplikasi belajar Islam dan ibadah untuk semua orang: jadwal shalat, doa harian, dzikir, tasbih digital, hafalan Juz 30, dan misi harian. Oleh ABEE MotionVerse.",
  manifest: "/manifest.json",
  icons: { apple: "/apple-touch-icon.png" },
  appleWebApp: {
    capable: true,
    title: "ABEE Muslim",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProgressProvider>
          <ThemeProvider>
            <SiteHeader />
            <main className="mx-auto w-full max-w-md px-4 pb-24 pt-4">{children}</main>
            <BottomNav />
            <PwaRegister />
            <InstallPromptModal />
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
