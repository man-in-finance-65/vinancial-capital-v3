import { useMemo, useState } from 'react';
import { useLang } from '../../i18n';
import { useCurrency } from '../../context/AppProviders';
import { formatMoney } from '../../lib/currency';
import { calculateLease, residualValue, roundMoney, roundPercent, type AdvancePayments, type ResidualOption } from '../../lib/calculator';
import { DownPaymentInput } from './DownPaymentInput';
import { AprSlider } from './AprSlider';
import { KeyStats } from './KeyStats';
import { ScheduleTable } from './ScheduleTable';
import { Button } from '../ui/Button';

const CURRENCY_SYMBOL = '$';

export function LeaseTab({ onApplyWithAmount }: { onApplyWithAmount: (amountLabel: string) => void }) {
  const { dict, lang } = useLang();
  const currency = useCurrency();
  const s = dict.calculatorPage.lease;

  const [price, setPrice] = useState(100000);
  const [down, setDown] = useState(15000);
  const [apr, setApr] = useState(7.5);
  const [term, setTerm] = useState(48);
  const [advance, setAdvance] = useState<AdvancePayments>(0);
  const [endOption, setEndOption] = useState<ResidualOption>('residualPercent');
  const [residualPct, setResidualPct] = useState(20);
  const [residualDollar, setResidualDollar] = useState(10000);

  const residual = residualValue(price, endOption, residualPct, residualDollar);
  const result = useMemo(
    () => calculateLease({ price, down, aprPercent: apr, termMonths: term, advancePayments: advance, residual }),
    [price, down, apr, term, advance, residual]
  );

  const money = (v: number) => formatMoney(roundMoney(v), lang, currency);
  const amountLabel = `${money(price - down)} (lease, ${term} months)`;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.equipmentPriceLabel}</span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
          />
        </label>

        <DownPaymentInput price={price} down={down} onChange={setDown} currencySymbol={CURRENCY_SYMBOL} />
        <AprSlider value={apr} onChange={setApr} />

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{dict.calculatorPage.termMonthsLabel}</span>
          <input
            type="number"
            min={1}
            value={term}
            onChange={(e) => setTerm(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
          />
        </label>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.advancePaymentsLabel}</span>
          <div className="mt-2 flex gap-2">
            {([0, 1, 2] as AdvancePayments[]).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAdvance(n)}
                className={`flex-1 rounded-card border px-3 py-2 text-sm ${advance === n ? 'border-sky bg-sky/10 text-foreground' : 'border-border text-muted'}`}
              >
                {n === 0 ? s.advanceOptions.none : n === 1 ? s.advanceOptions.first : s.advanceOptions.firstLast}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.endOfLeaseLabel}</span>
          <select
            value={endOption}
            onChange={(e) => setEndOption(e.target.value as ResidualOption)}
            className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
          >
            <option value="buyout10">{s.endOfLeaseOptions.buyout10}</option>
            <option value="residualPercent">{s.endOfLeaseOptions.residualPercent}</option>
            <option value="residualDollar">{s.endOfLeaseOptions.residualDollar}</option>
          </select>
        </div>

        {endOption === 'residualPercent' && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.residualValueLabel} (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={residualPct}
              onChange={(e) => setResidualPct(Number(e.target.value) || 0)}
              className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
            />
          </label>
        )}
        {endOption === 'residualDollar' && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.residualValueLabel} ({CURRENCY_SYMBOL})</span>
            <input
              type="number"
              min={0}
              value={residualDollar}
              onChange={(e) => setResidualDollar(Number(e.target.value) || 0)}
              className="mt-1 w-full min-h-[48px] rounded-card border border-border bg-ink px-4 text-base text-foreground focus:border-sky"
            />
          </label>
        )}
      </div>

      <div>
        <div className="rounded-card border border-border bg-panel p-6 md:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.monthlyPaymentLabel}</span>
          <div className="mt-1 font-slab text-5xl font-bold text-sky md:text-6xl">{money(result.payment)}</div>
          <p className="mt-1 text-xs text-muted">{currency === 'CAD' ? dict.calculatorPage.currencyNoteCAD : dict.calculatorPage.currencyNoteUSD}</p>

          <div className="mt-6">
            <KeyStats
              stats={[
                { label: dict.calculatorPage.keyStats.downPaymentPercent, value: `${roundPercent((down / price) * 100 || 0)}%` },
                { label: dict.calculatorPage.keyStats.apr, value: `${apr.toFixed(1)}%` },
                { label: dict.calculatorPage.keyStats.termYears, value: `${(term / 12).toFixed(1)}y` },
                { label: dict.calculatorPage.keyStats.residualPercent, value: `${roundPercent((residual / price) * 100 || 0)}%` },
              ]}
            />
          </div>

          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted">{s.dueAtSigningLabel}</dt>
              <dd className="font-semibold text-foreground">{money(result.dueAtSigning)}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted">{s.totalDepreciationLabel}</dt>
              <dd className="font-semibold text-foreground">{money(result.totalDepreciation)}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted">{s.totalInterestLabel}</dt>
              <dd className="font-semibold text-foreground">{money(result.totalInterest)}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted">{s.totalLeaseCostLabel}</dt>
              <dd className="font-semibold text-foreground">{money(result.totalLeaseCost)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{s.allInCostLabel}</dt>
              <dd className="font-semibold text-foreground">{money(result.allInCost)}</dd>
            </div>
          </dl>

          <ScheduleTable schedule={result.schedule} />

          <div className="mt-8">
            <Button variant="primary" icon onClick={() => onApplyWithAmount(amountLabel)}>
              {dict.calculatorPage.applyWithAmount}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
