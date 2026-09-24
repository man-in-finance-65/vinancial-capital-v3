import { useMemo, useState } from 'react';
import { useLang } from '../../i18n';
import { useCurrency } from '../../context/AppProviders';
import { formatMoney } from '../../lib/currency';
import { calculateLoan, roundMoney, roundPercent } from '../../lib/calculator';
import { DownPaymentInput } from './DownPaymentInput';
import { AprSlider } from './AprSlider';
import { KeyStats } from './KeyStats';
import { Button } from '../ui/Button';

export function LoanTab({ onApplyWithAmount }: { onApplyWithAmount: (amountLabel: string) => void }) {
  const { dict, lang } = useLang();
  const currency = useCurrency();
  const s = dict.calculatorPage.loan;

  const [price, setPrice] = useState(60000);
  const [down, setDown] = useState(6000);
  const [apr, setApr] = useState(8.5);
  const [term, setTerm] = useState(60);

  const result = useMemo(() => calculateLoan({ price, down, aprPercent: apr, termMonths: term }), [price, down, apr, term]);
  const money = (v: number) => formatMoney(roundMoney(v), lang, currency);
  const amountLabel = `${money(result.loanAmount)} (loan, ${term} months)`;

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
        <DownPaymentInput price={price} down={down} onChange={setDown} currencySymbol="$" />
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
      </div>

      <div className="rounded-card border border-border bg-panel p-6 md:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.monthlyPaymentLabel}</span>
        <div className="mt-1 font-slab text-5xl font-bold text-sky md:text-6xl">{money(result.payment)}</div>
        <p className="mt-1 text-xs text-muted">{currency === 'CAD' ? dict.calculatorPage.currencyNoteCAD : dict.calculatorPage.currencyNoteUSD}</p>

        <div className="mt-6">
          <KeyStats
            stats={[
              { label: dict.calculatorPage.keyStats.downPaymentPercent, value: `${roundPercent((down / price) * 100 || 0)}%` },
              { label: dict.calculatorPage.keyStats.rate, value: `${apr.toFixed(1)}%` },
              { label: dict.calculatorPage.keyStats.termYears, value: `${(term / 12).toFixed(1)}y` },
            ]}
          />
        </div>

        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted">{s.totalInterestLabel}</dt>
            <dd className="font-semibold text-foreground">{money(result.totalInterest)}</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted">{s.totalLoanCostLabel}</dt>
            <dd className="font-semibold text-foreground">{money(result.totalLoanCost)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{s.totalPaidLabel}</dt>
            <dd className="font-semibold text-foreground">{money(result.totalPaid)}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <Button variant="primary" icon onClick={() => onApplyWithAmount(amountLabel)}>
            {dict.calculatorPage.applyWithAmount}
          </Button>
        </div>
      </div>
    </div>
  );
}
