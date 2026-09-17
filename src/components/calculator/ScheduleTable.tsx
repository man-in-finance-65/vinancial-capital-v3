import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../../i18n';
import { useCurrency } from '../../context/AppProviders';
import { formatMoney } from '../../lib/currency';
import { roundMoney } from '../../lib/calculator';
import type { ScheduleRow } from '../../lib/calculator';

export function ScheduleTable({ schedule }: { schedule: ScheduleRow[] }) {
  const { dict, lang } = useLang();
  const currency = useCurrency();
  const [open, setOpen] = useState(false);
  const h = dict.calculatorPage.lease.scheduleHeaders;
  const rowTypes = dict.calculatorPage.lease.rowTypes;

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-sky"
      >
        {dict.calculatorPage.lease.scheduleToggle}
        <ChevronDown size={18} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="vc-scrollbar mt-4 overflow-x-auto rounded-card border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-panel text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-3 py-2">{h.number}</th>
                <th className="px-3 py-2">{h.type}</th>
                <th className="px-3 py-2 text-right">{h.payment}</th>
                <th className="px-3 py-2 text-right">{h.interest}</th>
                <th className="px-3 py-2 text-right">{h.principal}</th>
                <th className="px-3 py-2 text-right">{h.balance}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.index} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-2 text-muted">{row.index}</td>
                  <td className="px-3 py-2 text-foreground">{rowTypes[row.type]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.payment ? formatMoney(roundMoney(row.payment), lang, currency) : '—'}</td>
                  <td className="px-3 py-2 text-right text-muted">{row.interest ? formatMoney(roundMoney(row.interest), lang, currency) : '—'}</td>
                  <td className="px-3 py-2 text-right text-muted">{row.principal ? formatMoney(roundMoney(row.principal), lang, currency) : '—'}</td>
                  <td className="px-3 py-2 text-right text-foreground">{formatMoney(roundMoney(row.balance), lang, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
