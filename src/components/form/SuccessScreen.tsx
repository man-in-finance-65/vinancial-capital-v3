import { Check, MessageCircle, Phone } from 'lucide-react';
import { useLang, interpolate } from '../../i18n';
import { SITE } from '../../config/site';
import { Button } from '../ui/Button';

export function SuccessScreen({ nombre, id, onBackToSite }: { nombre: string; id: string; onBackToSite: () => void }) {
  const { dict } = useLang();
  const s = dict.form.success;

  const whatsappUrl = `${SITE.whatsappUrl}?text=${encodeURIComponent(interpolate(s.whatsappMessage, { id }))}`;

  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky/15">
        <Check size={28} className="text-sky" />
      </div>
      <h2 className="mt-6 font-slab text-3xl font-semibold text-foreground md:text-4xl">{interpolate(s.greeting, { name: nombre })}</h2>
      {id && (
        <p className="mt-2 text-sm text-muted">
          {s.referenceLabel}: <span className="font-semibold text-foreground">{id}</span>
        </p>
      )}

      <div className="mt-8">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.34em] text-sky">{s.whatHappensNextHeading}</h3>
        <ol className="mt-3 flex flex-col gap-2">
          {s.whatHappensNext.map((line, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted md:text-base">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-panel text-xs text-sky">{i + 1}</span>
              {line}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 rounded-card border border-border bg-panel p-5">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.34em] text-sky">{s.papersHeading}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {s.papers.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted">
              <Check size={16} className="mt-0.5 shrink-0 text-sky" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button as="a" href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="primary">
          <MessageCircle size={16} /> {s.whatsappButton}
        </Button>
        <Button as="a" href={SITE.telUrl} variant="secondary">
          <Phone size={16} /> {s.callButton}
        </Button>
        <button type="button" onClick={onBackToSite} className="text-sm text-muted underline decoration-border underline-offset-4 hover:text-foreground">
          {s.backToSite}
        </button>
      </div>
    </div>
  );
}
