import { useEffect } from 'react';
import { useLang } from '../i18n';
import type { ApplicationData } from '../lib/application';
import { SITE } from '../config/site';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Disclosure } from '../components/ui/Disclosure';

export function About({ openForm }: { openForm: (initial?: Partial<ApplicationData>) => void }) {
  const { dict } = useLang();
  const s = dict.about;

  useEffect(() => {
    document.title = dict.meta.about.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.about.description);
  }, [dict]);

  return (
    <div className="bg-brand-radial px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h1 className="font-slab text-4xl font-semibold text-foreground md:text-5xl">{s.heading}</h1>
          {s.subheading && <p className="mt-3 text-lg text-muted">{s.subheading}</p>}
        </Reveal>

        <div className="mt-10 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-card border border-border bg-panel">
          <img src="/images/vicente.webp" alt={s.founderPhotoAlt} className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')} />
        </div>

        <Reveal delayMs={100}>
          <div className="mt-10 flex flex-col gap-5">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={150}>
          <div className="mt-10 rounded-card border border-sky/30 bg-panel p-6">
            <h2 className="font-slab text-xl font-semibold text-sky">{s.coreBeliefHeading}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground md:text-lg">{s.coreBelief}</p>
          </div>
        </Reveal>

        <p className="mt-8 text-sm text-muted">
          {dict.footer.founderPrefix}{' '}
          <a
            href={SITE.founder.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-border underline-offset-4 hover:text-sky"
          >
            {SITE.founder.name}
          </a>
        </p>

        <Reveal delayMs={175}>
          <div className="mt-10">
            <Disclosure label={s.founderCtaLabel}>
              <h2 className="font-slab text-lg font-semibold text-foreground">{s.founderHeading}</h2>
              {s.founderParagraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted md:text-base">
                  {p}
                </p>
              ))}
            </Disclosure>
          </div>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-10">
            <Button variant="primary" icon onClick={() => openForm()}>
              {s.applyCta}
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
