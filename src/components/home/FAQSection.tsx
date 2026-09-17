import { useLang } from '../../i18n';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';

export function FAQSection() {
  const { dict } = useLang();
  const s = dict.faq;

  const items = [...s.items, { q: s.feesQuestion, a: s.feesAnswer, linkTo: '/calculator', linkLabel: dict.nav.calculator }];

  return (
    <section className="px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading index={s.eyebrow} heading={s.heading} />
        </Reveal>
        <Reveal delayMs={100}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
