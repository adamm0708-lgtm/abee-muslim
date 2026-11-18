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
      <b>Tambahkan ke layar utama</b> (atau <b>Install aplikasi</b> bila muncul). Di Chrome
      desktop: klik ikon install di address bar.
    </p>
  );
}
