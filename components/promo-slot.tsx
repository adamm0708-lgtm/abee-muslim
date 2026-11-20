// Slot promo/iklan global — koordinasi sekali jalan supaya dua pengingat
// tidak tampil bersamaan (mis. banner AdhanReminder vs modal Pengingat).
//
// State ini TRANSIEN (hanya di memori, tidak disimpan ke localStorage):
// nama slot yang sedang terbuka, atau null bila tidak ada. AdhanReminder
// menyembunyikan bannernya selama ada slot promo yang terbuka.
"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PromoSlot = {
  promoOpen: string | null;
  setPromoOpen: (v: string | null) => void;
};

const PromoCtx = createContext<PromoSlot | null>(null);

export function PromoSlotProvider({ children }: { children: ReactNode }) {
  const [promoOpen, setPromoOpen] = useState<string | null>(null);
  const value = useMemo(() => ({ promoOpen, setPromoOpen }), [promoOpen]);
  return <PromoCtx.Provider value={value}>{children}</PromoCtx.Provider>;
}

/** Aman dipakai di luar provider — mengembalikan slot kosong. */
export function usePromoSlot(): PromoSlot {
  const ctx = useContext(PromoCtx);
  return ctx ?? { promoOpen: null, setPromoOpen: () => {} };
}
