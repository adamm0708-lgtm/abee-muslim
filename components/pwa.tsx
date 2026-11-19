"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Disimpan di level modul supaya tombol Install di halaman Atur bisa
// memakainya walau event-nya datang sebelum halaman Atur dibuka.
let deferredPrompt: BeforeInstallPromptEvent | null = null;

/** Daftarkan service worker + tangkap event beforeinstallprompt. Render di layout. */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.warn("Pendaftaran service worker gagal:", err));
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register);
    }
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      window.dispatchEvent(new CustomEvent("abee:install-ready"));
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);
  return null;
}

const DISMISS_KEY = "abee:install-prompt-dismissed";
const DISMISS_DAYS = 7;

/** Popup tawaran install saat kunjungan pertama.
 * Muncul sekali (±2,5 detik setelah halaman dimuat), tidak mengganggu:
 * - Chrome/Android: tombol Install memunculkan dialog install bawaan Chrome.
 * - iPhone/iPad: instruksi manual (Safari tidak mendukung prompt otomatis).
 * - Sudah terinstal / pernah menolak dalam 7 hari: tidak tampil. */
export function InstallPromptModal() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Sudah terinstal sebagai aplikasi → jangan pernah tampil.
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    )
      return;
    // Pernah ditolak dalam 7 hari terakhir → jangan tampil dulu.
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw && Date.now() - Number(raw) < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    } catch {
      /* abaikan */
    }
    setIsIOS(
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream
    );
    if (deferredPrompt) setReady(true);
    const onReady = () => setReady(true);
    const onInstalled = () => {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        /* abaikan */
      }
    };
    window.addEventListener("abee:install-ready", onReady);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("abee:install-ready", onReady);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    // Tampilkan hanya bila install tersedia (Chrome/Android) atau perangkat iOS.
    if (!ready && !isIOS) return;
    const t = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(t);
  }, [ready, isIOS]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* abaikan */
    }
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4"
      onClick={dismiss}
      role="dialog"
      aria-label="Install aplikasi ABEE Muslim"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#14201F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="ABEE Muslim" className="h-14 w-14 rounded-2xl" />
          <div className="text-left">
            <p className="font-extrabold text-neutral-900 dark:text-neutral-100">Install ABEE Muslim</p>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Buka seperti aplikasi asli — layar penuh tanpa address bar, bisa dipakai offline.
            </p>
          </div>
        </div>
        {isIOS && !ready ? (
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Di iPhone/iPad: ketuk tombol <b>Bagikan</b> di Safari, lalu pilih{" "}
            <b>Tambahkan ke Layar Utama</b>.
          </p>
        ) : (
          <button
            onClick={install}
            className="mt-4 w-full rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white active:scale-[0.98] dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
          >
            Install aplikasi
          </button>
        )}
        <button
          onClick={dismiss}
          className="mt-2 w-full rounded-2xl py-2.5 text-sm font-bold text-neutral-500 dark:text-neutral-400"
        >
          Nanti
        </button>
      </div>
    </div>
  );
}

/** Tombol "Install aplikasi" untuk halaman Atur. */
export function InstallButton() {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setIsIOS(
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream
    );
    if (deferredPrompt) setReady(true);
    const onReady = () => setReady(true);
    const onInstalled = () => {
      setInstalled(true);
      setReady(false);
      deferredPrompt = null;
    };
    window.addEventListener("abee:install-ready", onReady);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("abee:install-ready", onReady);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setMessage("Terima kasih — aplikasi sedang diinstal.");
    }
    deferredPrompt = null;
    setReady(false);
  };

  if (installed) {
    return (
      <p className="flex items-center gap-2 text-sm font-bold text-[#0B3D39] dark:text-[#D4AF37]">
        <Icon name="check" className="h-4 w-4" /> Aplikasi sudah terinstal di perangkat ini.
      </p>
    );
  }

  if (ready) {
    return (
      <div>
        <button
          onClick={install}
          className="w-full rounded-2xl bg-[#0A0A0A] py-3 text-sm font-bold text-white active:scale-[0.98] dark:bg-[#D4AF37] dark:text-[#0A0A0A]"
        >
          Install aplikasi
        </button>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          Terinstal seperti aplikasi asli: ikon di layar utama, tampil layar penuh tanpa
          address bar Chrome.
        </p>
        {message && (
          <p className="mt-2 text-xs font-bold text-[#0B3D39] dark:text-[#D4AF37]">{message}</p>
        )}
      </div>
    );
  }

  if (isIOS) {
    return (
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Di iPhone/iPad: ketuk tombol <b>Bagikan</b> di Safari, lalu pilih{" "}
        <b>Tambahkan ke Layar Utama</b>.
      </p>
    );
  }

  return (
    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      Di Chrome Android: buka menu <b>⋮</b> di kanan atas, lalu pilih{" "}
      <b>Install aplikasi</b>. Di Chrome desktop: klik ikon install di address bar.
    </p>
  );
}
