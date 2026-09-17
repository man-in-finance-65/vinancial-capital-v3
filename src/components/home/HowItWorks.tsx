import { useLang } from '../../i18n';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function HowItWorks() {
  const { dict } = useLang();
  const s = dict.howItWorks;

  return (
    <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading index={s.eyebrow} heading={s.heading} />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {s.steps.map((step, i) => (
            <Reveal key={i} delayMs={i * 100}>
              <div className="rounded-card border border-border bg-panel p-6">
                <span className="block h-px w-10 bg-sky" />
                <span className="mt-4 block font-slab text-3xl font-semibold text-sky">0{i + 1}</span>
                <h3 className="mt-3 font-slab text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
