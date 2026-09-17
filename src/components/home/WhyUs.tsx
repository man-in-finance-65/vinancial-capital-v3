import { MessageCircleQuestion, Languages, Wrench } from 'lucide-react';
import { useLang } from '../../i18n';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ICONS = [MessageCircleQuestion, Languages, Wrench];

export function WhyUs() {
  const { dict } = useLang();
  const s = dict.whyUs;

  return (
    <section className="bg-surface px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading index={s.eyebrow} heading={s.heading} />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {s.points.map((point, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={i} delayMs={i * 100}>
                <div>
                  <Icon size={32} strokeWidth={1.5} className="text-sky" aria-hidden />
                  <h3 className="mt-4 font-slab text-xl font-semibold text-foreground">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">{point.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
