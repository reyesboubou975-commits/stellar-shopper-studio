// Local stats store: tracks generations done by the user (kept in localStorage).
import type { SolId } from "@/data/sols";

export interface GenRecord {
  id: string;
  sol: SolId;
  light: string;
  format: string;
  at: number; // ms
}

const KEY = "pixel.history.v1";

export function loadHistory(): GenRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GenRecord[];
  } catch { return []; }
}

export function pushHistory(rec: Omit<GenRecord, "id" | "at">) {
  const all = loadHistory();
  all.push({ ...rec, id: crypto.randomUUID(), at: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(all.slice(-500)));
  return all;
}

export function clearHistory() { localStorage.removeItem(KEY); }
