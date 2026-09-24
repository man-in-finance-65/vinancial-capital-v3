import { createContext, useContext } from 'react';
import type { Dict, Lang } from './types';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const DICTS: Record<Lang, Dict> = { es, en, fr };

const SUPPORTED: Lang[] = ['es', 'fr', 'en'];

export function detectLang(): Lang {
  if (typeof window !== 'undefined' && window.__VC_LANG__) {
    return window.__VC_LANG__;
  }
  try {
    const langs = typeof navigator !== 'undefined' && navigator.languages?.length ? navigator.languages : [navigator?.language ?? 'en'];
    for (const raw of langs) {
      const code = raw.toLowerCase().split('-')[0];
      const match = SUPPORTED.find((s) => s === code);
      if (match) return match;
    }
  } catch {
    // fall through to English
  }
  return 'en';
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}

export function errorText(dict: Dict, code?: string): string | undefined {
  if (!code) return undefined;
  const errors = dict.form.errors as Record<string, string>;
  return errors[code] ?? dict.form.errors.invalid_value;
}

export type LangContextValue = {
  lang: Lang;
  dict: Dict;
};

export const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

export type { Dict, Lang, QA } from './types';
