import { useMemo, useState } from 'react';
import { COUNTRY_CODES, DEFAULT_COUNTRY_ISO } from '../../lib/countryCodes';
import type { Currency } from '../../lib/currency';

function parseValue(value: string): { iso: string; number: string } | null {
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (value.startsWith(c.dial)) {
      return { iso: c.iso, number: value.slice(c.dial.length).trim() };
    }
  }
  return null;
}

export function PhoneInput({
  id,
  value,
  onChange,
  currency,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  currency: Currency;
  error?: string;
}) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const [iso, setIso] = useState(parsed?.iso ?? DEFAULT_COUNTRY_ISO[currency]);
  const [number, setNumber] = useState(parsed?.number ?? '');

  const dial = COUNTRY_CODES.find((c) => c.iso === iso)?.dial ?? '+1';

  function emit(nextIso: string, nextNumber: string) {
    const nextDial = COUNTRY_CODES.find((c) => c.iso === nextIso)?.dial ?? '+1';
    const digits = nextNumber.replace(/[^\d]/g, '');
    onChange(digits ? `${nextDial} ${digits}` : '');
  }

  return (
    <div className="flex gap-2">
      <select
        aria-label="Country code"
        className="min-h-[48px] w-[104px] shrink-0 rounded-card border border-border bg-panel px-2 text-sm text-foreground focus:border-sky"
        value={iso}
        onChange={(e) => {
          setIso(e.target.value);
          emit(e.target.value, number);
        }}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.iso} value={c.iso}>
            {c.iso} {c.dial}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-[48px] w-full rounded-card border border-border bg-panel px-4 text-base text-foreground placeholder:text-muted focus:border-sky"
        value={number}
        placeholder={dial}
        onChange={(e) => {
          setNumber(e.target.value);
          emit(iso, e.target.value);
        }}
      />
    </div>
  );
}
