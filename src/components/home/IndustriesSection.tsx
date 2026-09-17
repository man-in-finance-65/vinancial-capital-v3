import { HardHat, Truck, UtensilsCrossed } from 'lucide-react';
import { useLang } from '../../i18n';
import type { IndustryKey } from '../../config/machines';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ICONS: Record<IndustryKey, typeof HardHat> = {
  construction: HardHat,
  trucking: Truck,
  restaurant: UtensilsCrossed,
};

export function IndustriesSection({ onApply }: { onApply: (industry?: IndustryKey) => void }) {
  const { dict } = useLang();
  const s = dict.industriesSection;
  const cards: IndustryKey[] = ['construction', 'trucking', 'restaurant'];

  return (
    <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading index={s.eyebrow} heading={s.heading} />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((key, i) => {
            const Icon = ICONS[key];
            const card = s[key];
            return (
              <Reveal key={key} delayMs={i * 100}>
                <div className="flex h-full flex-col rounded-card border border-border bg-panel p-6">
                  <Icon size={32} strokeWidth={1.5} className="text-sky" aria-hidden />
                  <h3 className="mt-4 font-slab text-xl font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted md:text-base">{card.body}</p>
                  <button
                    type="button"
                    onClick={() => onApply(key)}
                    className="mt-5 self-start text-sm font-semibold uppercase tracking-[0.14em] text-sky hover:opacity-80"
                  >
                    {dict.common.apply}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delayMs={300}>
          <p className="mt-8 text-sm text-muted">
            {s.other}{' '}
            <button type="button" onClick={() => onApply()} className="font-semibold text-sky hover:opacity-80">
              {s.otherLink}
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
