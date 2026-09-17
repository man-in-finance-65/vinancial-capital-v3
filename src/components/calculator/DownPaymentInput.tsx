import { useState } from 'react';
import { downPaymentAmount, downPaymentPercent } from '../../lib/calculator';
import { useLang } from '../../i18n';

export function DownPaymentInput({
  price,
  down,
  onChange,
  currencySymbol,
}: {
  price: number;
  down: number;
  onChange: (down: number) => void;
  currencySymbol: string;
}) {
  const { dict } = useLang();
  const [mode, setMode] = useState<'dollar' | 'percent'>('dollar');
  const pct = downPaymentPercent(price, down);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{dict.calculatorPage.keyStats.downPaymentPercent}</span>
        <div className="flex overflow-hidden rounded-full border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode('dollar')}
            className={`px-3 py-1 ${mode === 'dollar' ? 'bg-sky text-ink' : 'text-muted'}`}
          >
            {dict.calculatorPage.downPaymentDollar}
          </button>
          <button
            type="button"
            onClick={() => setMode('percent')}
            className={`px-3 py-1 ${mode === 'percent' ? 'bg-sky text-ink' : 'text-muted'}`}
          >
            {dict.calculatorPage.downPaymentPercent}
          </button>
        </div>
      </div>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          {mode === 'dollar' ? currencySymbol : '%'}
        </span>
        <input
          type="number"
          min={0}
          className="w-full min-h-[48px] rounded-card border border-border bg-ink pl-9 pr-4 text-base text-foreground focus:border-sky"
          value={mode === 'dollar' ? Math.round(down) : Math.round(pct * 10) / 10}
          onChange={(e) => {
            const v = Number(e.target.value) || 0;
            onChange(mode === 'dollar' ? v : downPaymentAmount(price, v));
          }}
        />
      </div>
    </div>
  );
}
