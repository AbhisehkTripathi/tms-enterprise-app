import { getAuth } from "./auth";

const STORAGE_KEY_PREFIX = "tms-flagged-";

function getStorageKey(): string {
  const auth = getAuth();
  const userId = auth?.id ?? "anonymous";
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Returns the set of shipment IDs flagged by the current user (persisted in localStorage).
 */
export function getFlaggedShipmentIds(): Set<string> {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Toggles flag for a shipment and persists to localStorage.
 */
export function toggleFlaggedShipmentId(id: string): void {
  const set = getFlaggedShipmentIds();
  if (set.has(id)) set.delete(id);
  else set.add(id);
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

/**
 * Checks if a shipment is flagged for the current user.
 */
export function isShipmentFlagged(id: string): boolean {
  return getFlaggedShipmentIds().has(id);
}
