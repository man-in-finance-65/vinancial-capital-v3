import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import type { ApplicationData } from '../lib/application';
import { LeaseTab } from '../components/calculator/LeaseTab';
import { LoanTab } from '../components/calculator/LoanTab';
import { AffordTab } from '../components/calculator/AffordTab';
import { Accordion } from '../components/ui/Accordion';
import { Reveal } from '../components/ui/Reveal';

type Tab = 'lease' | 'loan' | 'afford';

export function CalculatorPage({ openForm }: { openForm: (initial?: Partial<ApplicationData>) => void }) {
  const { dict } = useLang();
  const [tab, setTab] = useState<Tab>('loan');
  const s = dict.calculatorPage;

  useEffect(() => {
    document.title = dict.meta.calculator.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.calculator.description);
  }, [dict]);

  function applyWithAmount(amountLabel: string) {
    openForm({ monto_solicitado: amountLabel, servicio_financiero: 'prestamo_equipo' });
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'lease', label: s.tabs.lease },
    { key: 'loan', label: s.tabs.loan },
    { key: 'afford', label: s.tabs.afford },
  ];

  return (
    <div className="bg-brand-radial px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h1 className="font-slab text-4xl font-semibold text-foreground md:text-5xl">{s.heading}</h1>
          <p className="mt-3 max-w-xl text-base text-muted md:text-lg">{s.subheading}</p>
        </Reveal>

        <div role="tablist" aria-label={s.heading} className="mt-8 flex gap-2 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${
                tab === t.key ? 'border-sky text-sky' : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === 'lease' && <LeaseTab onApplyWithAmount={applyWithAmount} />}
          {tab === 'loan' && <LoanTab onApplyWithAmount={applyWithAmount} />}
          {tab === 'afford' && <AffordTab onApplyWithAmount={applyWithAmount} />}
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">{s.disclaimer}</p>

        <div className="mt-16">
          <h2 className="font-slab text-2xl font-semibold text-foreground">{dict.faq.heading}</h2>
          <div className="mt-6">
            <Accordion items={s.faqItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
