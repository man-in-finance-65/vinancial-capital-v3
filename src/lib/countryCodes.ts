// Small hand-rolled phone country code list — no phone-number library per project rules.
// Canada and the U.S. first, then Latin American countries, then the rest (alphabetical by English name).

export type CountryCode = { iso: string; name: string; dial: string };

export const COUNTRY_CODES: CountryCode[] = [
  { iso: 'CA', name: 'Canada', dial: '+1' },
  { iso: 'US', name: 'United States', dial: '+1' },
  { iso: 'MX', name: 'Mexico', dial: '+52' },
  { iso: 'GT', name: 'Guatemala', dial: '+502' },
  { iso: 'HN', name: 'Honduras', dial: '+504' },
  { iso: 'SV', name: 'El Salvador', dial: '+503' },
  { iso: 'NI', name: 'Nicaragua', dial: '+505' },
  { iso: 'CR', name: 'Costa Rica', dial: '+506' },
  { iso: 'PA', name: 'Panama', dial: '+507' },
  { iso: 'CU', name: 'Cuba', dial: '+53' },
  { iso: 'DO', name: 'Dominican Republic', dial: '+1' },
  { iso: 'PR', name: 'Puerto Rico', dial: '+1' },
  { iso: 'CO', name: 'Colombia', dial: '+57' },
  { iso: 'VE', name: 'Venezuela', dial: '+58' },
  { iso: 'EC', name: 'Ecuador', dial: '+593' },
  { iso: 'PE', name: 'Peru', dial: '+51' },
  { iso: 'BO', name: 'Bolivia', dial: '+591' },
  { iso: 'CL', name: 'Chile', dial: '+56' },
  { iso: 'AR', name: 'Argentina', dial: '+54' },
  { iso: 'PY', name: 'Paraguay', dial: '+595' },
  { iso: 'UY', name: 'Uruguay', dial: '+598' },
  { iso: 'BR', name: 'Brazil', dial: '+55' },
  { iso: 'AU', name: 'Australia', dial: '+61' },
  { iso: 'BE', name: 'Belgium', dial: '+32' },
  { iso: 'CN', name: 'China', dial: '+86' },
  { iso: 'FR', name: 'France', dial: '+33' },
  { iso: 'DE', name: 'Germany', dial: '+49' },
  { iso: 'IN', name: 'India', dial: '+91' },
  { iso: 'IT', name: 'Italy', dial: '+39' },
  { iso: 'JP', name: 'Japan', dial: '+81' },
  { iso: 'NL', name: 'Netherlands', dial: '+31' },
  { iso: 'PT', name: 'Portugal', dial: '+351' },
  { iso: 'ES', name: 'Spain', dial: '+34' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44' },
];

export const DEFAULT_COUNTRY_ISO: Record<'CAD' | 'USD', string> = {
  CAD: 'CA',
  USD: 'US',
};
