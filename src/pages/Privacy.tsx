import { useEffect } from 'react';
import { useLang } from '../i18n';
import { SITE } from '../config/site';
import { Link } from '../router/Router';
import { Reveal } from '../components/ui/Reveal';

// Starter privacy policy — plain language, not legal advice. Have a lawyer review it
// before relying on it, especially given the financial/credit data this form collects.
export function Privacy() {
  const { dict } = useLang();
  const s = dict.privacy;

  useEffect(() => {
    document.title = s.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', s.metaDescription);
  }, [s]);

  return (
    <div className="bg-brand-radial px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="font-slab text-4xl font-semibold text-foreground md:text-5xl">{s.heading}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{s.intro}</p>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mt-10 flex flex-col gap-8">
            {s.sections.map((section, i) => {
              const [before, after] = section.body.split('{email}');
              return (
                <div key={i}>
                  <h2 className="font-slab text-xl font-semibold text-foreground">{section.heading}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                    {before}
                    {after !== undefined && (
                      <>
                        <a href={`mailto:${SITE.email}`} className="text-sky underline decoration-border underline-offset-2 hover:text-foreground">
                          {SITE.email}
                        </a>
                        {after}
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delayMs={150}>
          <Link to="/" className="mt-12 inline-block text-sm font-semibold text-sky hover:opacity-80">
            {dict.nav.home}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
