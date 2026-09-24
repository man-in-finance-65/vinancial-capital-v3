import { useEffect } from 'react';
import { useLang } from '../i18n';
import type { ApplicationData } from '../lib/application';
import { HERO_INDUSTRY_TO_LABEL } from '../lib/industries';
import type { IndustryKey } from '../config/machines';
import { Hero } from '../components/home/Hero';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyUs } from '../components/home/WhyUs';
import { IndustriesSection } from '../components/home/IndustriesSection';
import { CalculatorPreview } from '../components/home/CalculatorPreview';
import { FAQSection } from '../components/home/FAQSection';

export function Home({ openForm }: { openForm: (initial?: Partial<ApplicationData>) => void }) {
  const { dict } = useLang();

  useEffect(() => {
    document.title = dict.meta.home.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.home.description);
  }, [dict]);

  function applyForIndustry(industry?: IndustryKey) {
    openForm(industry ? { industria: HERO_INDUSTRY_TO_LABEL[industry] } : undefined);
  }

  return (
    <>
      <Hero onApply={applyForIndustry} />
      <HowItWorks />
      <WhyUs />
      <IndustriesSection onApply={applyForIndustry} />
      <CalculatorPreview
        onApplyWithAmount={(amountLabel) => openForm({ monto_solicitado: amountLabel, servicio_financiero: 'prestamo_equipo' })}
      />
      <FAQSection openForm={openForm} />
    </>
  );
}
