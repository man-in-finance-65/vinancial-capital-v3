import { useEffect } from 'react';
import { useLang } from '../../i18n';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Accordion } from '../ui/Accordion';

export function FAQSection() {
  const { dict } = useLang();
  const s = dict.faq;

  useEffect(() => {
    if (import.meta.env.DEV && s.feesAnswer === 'TODO_CONFIRM_FEES') {
      // eslint-disable-next-line no-console
      console.warn('[Vinancial Capital] FAQ fees answer is still the TODO_CONFIRM_FEES placeholder. Confirm pricing before launch.');
    }
  }, [s.feesAnswer]);

  const items = [...s.items, { q: s.feesQuestion, a: s.feesAnswer }];

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
