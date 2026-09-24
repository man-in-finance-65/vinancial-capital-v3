import { useMemo, useState } from 'react';
import { useLang } from '../../i18n';
import { useCurrency } from '../../context/AppProviders';
import { formatMoney } from '../../lib/currency';
import { calculateLoan, downPaymentAmount, roundMoney } from '../../lib/calculator';
import { Link } from '../../router/Router';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export function CalculatorPreview({ onApplyWithAmount }: { onApplyWithAmount: (amountLabel: string) => void }) {
  const { dict, lang } = useLang();
  const currency = useCurrency();
  const s = dict.calculatorPreview;

  const [price, setPrice] = useState(80000);
  const [downPct, setDownPct] = useState(15);
  const [apr, setApr] = useState(9.5);
  const [term, setTerm] = useState(60);

  const down = downPaymentAmount(price, downPct);
  const result = useMemo(() => calculateLoan({ price, down, aprPercent: apr, termMonths: term }), [price, down, apr, term]);
  const monthly = roundMoney(result.payment);

  const amountLabel = `${formatMoney(roundMoney(result.loanAmount), lang, currency)} (loan, ${term} months)`;

  return (
    <section id="calculator-preview" className="bg-surface px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading index={s.eyebrow} heading={s.heading} />
        </Reveal>
        <Reveal delayMs={100}>
          <div className="grid gap-10 rounded-card border border-border bg-panel p-6 md:grid-cols-2 md:p-10">
            <div className="flex flex-col gap-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.priceLabel}</span>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {s.downPaymentLabel} ({downPct.toFixed(0)}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={downPct}
                  onChange={(e) => setDownPct(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {s.aprLabel} ({apr.toFixed(1)}%)
                </span>
                <input type="range" min={0} max={30} step={0.1} value={apr} onChange={(e) => setApr(Number(e.target.value))} className="mt-2 w-full" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.termLabel}</span>
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
                >
                  {[24, 36, 48, 60, 72, 84].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.monthlyPaymentLabel}</span>
              <span className="mt-2 font-slab text-5xl font-bold text-sky md:text-6xl">{formatMoney(monthly, lang, currency)}</span>
              <span className="mt-2 text-xs text-muted">{currency === 'CAD' ? s.currencyNoteCAD : s.currencyNoteUSD}</span>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" icon onClick={() => onApplyWithAmount(amountLabel)}>
                  {s.applyWithAmount}
                </Button>
                <Link
                  to="/calculator"
                  className="inline-flex items-center justify-center rounded-full border border-sky/50 px-7 py-3 text-center font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sky transition-colors hover:bg-sky/10 md:text-sm"
                >
                  {s.openFullCalculator}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
