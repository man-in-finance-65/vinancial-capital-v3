import { APPS_SCRIPT_URL } from '../config/site';
import { FIELDS, PAGINA_MAX_LENGTH, type ApplicationData, type FieldName } from './application';
import type { Lang } from '../i18n/types';

export type SubmitResult =
  | { ok: true; id: string; nombre: string }
  | { ok: false; error: 'validation'; fields: Partial<Record<FieldName, string>> }
  | { ok: false; error: 'network' | 'server' };

export async function submitApplication(
  data: ApplicationData,
  lang: Lang,
  recaptchaToken: string,
  honeypot: string
): Promise<SubmitResult> {
  const payload: Record<string, string> = {};
  for (const field of FIELDS) {
    payload[field] = data[field] ?? '';
  }
  payload.idioma = lang;
  payload.pagina = window.location.href.slice(0, PAGINA_MAX_LENGTH);
  payload.website = honeypot; // honeypot — real users never fill this; the backend ignores submissions where it's set
  payload.recaptcha_token = recaptchaToken;

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: 'server' };
    }

    const json = await response.json();

    if (json?.ok === true) {
      return { ok: true, id: String(json.id ?? ''), nombre: String(json.nombre ?? data.nombre) };
    }

    if (json?.ok === false && json?.error === 'validation') {
      return { ok: false, error: 'validation', fields: json.fields ?? {} };
    }

    return { ok: false, error: 'server' };
  } catch {
    return { ok: false, error: 'network' };
  }
}
