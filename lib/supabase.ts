// Supabase — opsional. Tanpa env var, aplikasi jalan penuh dengan
// localStorage. Dengan env var, progres juga disinkronkan ke tabel
// user_progress (lihat supabase/schema.sql).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return null;
  }
  client = createClient(url, key);
  return client;
}

export function supabaseConfigured(): boolean {
  return getSupabase() !== null;
}

/** ID perangkat anonim untuk baris user_progress (tanpa login). */
export function deviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("abee-device-id");
  if (!id) {
    id = `dev-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("abee-device-id", id);
  }
  return id;
}
