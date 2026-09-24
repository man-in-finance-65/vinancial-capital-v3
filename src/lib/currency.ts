export type Currency = 'CAD' | 'USD';

const CANADIAN_TIME_ZONES = [
  'America/Toronto', 'America/Montreal', 'America/Vancouver', 'America/Edmonton',
  'America/Winnipeg', 'America/Halifax', 'America/St_Johns', 'America/Regina',
  'America/Iqaluit', 'America/Whitehorse', 'America/Yellowknife', 'America/Dawson',
  'America/Dawson_Creek', 'America/Creston', 'America/Fort_Nelson', 'America/Glace_Bay',
  'America/Goose_Bay', 'America/Moncton', 'America/Blanc-Sablon', 'America/Nipigon',
  'America/Thunder_Bay', 'America/Rainy_River', 'America/Atikokan', 'America/Swift_Current',
  'America/Cambridge_Bay', 'America/Inuvik', 'America/Resolute', 'America/Rankin_Inlet',
];

export function detectCurrency(): Currency {
  if (typeof window !== 'undefined' && window.__VC_CURRENCY__) {
    return window.__VC_CURRENCY__;
  }
  try {
    const locale = typeof navigator !== 'undefined' ? navigator.language : '';
    const region = locale.split('-')[1]?.toUpperCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (region === 'CA' || CANADIAN_TIME_ZONES.includes(tz)) return 'CAD';
  } catch {
    // fall through to USD
  }
  return 'USD';
}

const LOCALE_BY_LANG_CURRENCY: Record<string, string> = {
  'es-CAD': 'es-CA',
  'es-USD': 'es-US',
  'fr-CAD': 'fr-CA',
  'fr-USD': 'fr-CA',
  'en-CAD': 'en-CA',
  'en-USD': 'en-US',
};

export function formatMoney(amount: number, lang: string, currency: Currency): string {
  const locale = LOCALE_BY_LANG_CURRENCY[`${lang}-${currency}`] ?? 'en-US';
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, lang: string): string {
  const locale = lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-US';
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(safe) + '%';
}
