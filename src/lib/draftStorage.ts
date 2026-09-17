import { LOCAL_STORAGE_DRAFT_KEY } from '../config/site';
import type { ApplicationData } from './application';

export type Draft = {
  data: ApplicationData;
  step: number;
  savedAt: number;
};

export function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.data) return null;
    return parsed as Draft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // storage unavailable or full — nothing we can do, don't block the user
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function hasAnyValue(data: ApplicationData): boolean {
  return Object.values(data).some((v) => v && v.trim().length > 0);
}
