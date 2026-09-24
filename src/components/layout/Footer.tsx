import { Mail, Phone, MessageCircle, MapPin, Linkedin } from 'lucide-react';
import { Link } from '../../router/Router';
import { useLang, interpolate } from '../../i18n';
import { SITE } from '../../config/site';
import { Wordmark } from './Wordmark';

export function Footer({ onApply }: { onApply: () => void }) {
  const { dict } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface px-6 py-16 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <Wordmark className="text-sm" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{dict.footer.positioning}</p>
          <p className="mt-6 text-sm text-muted">{SITE.locationsLine}</p>
          <p className="mt-1 flex items-start gap-2 text-sm text-muted">
            <MapPin size={16} className="mt-0.5 shrink-0 text-sky" aria-hidden />
            {SITE.address}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-muted transition-colors hover:text-foreground">
            <Mail size={16} className="text-sky" aria-hidden /> {SITE.email}
          </a>
          <a href={SITE.telUrl} className="flex items-center gap-2 text-muted transition-colors hover:text-foreground">
            <Phone size={16} className="text-sky" aria-hidden /> {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            <MessageCircle size={16} className="text-sky" aria-hidden /> WhatsApp
          </a>
          <a
            href={SITE.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            <Linkedin size={16} className="text-sky" aria-hidden /> LinkedIn
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.34em] text-sky">{dict.footer.linksHeading}</span>
          <Link to="/about" className="text-muted transition-colors hover:text-foreground">
            {dict.nav.about}
          </Link>
          <Link to="/calculator" className="text-muted transition-colors hover:text-foreground">
            {dict.nav.calculator}
          </Link>
          <button type="button" onClick={onApply} className="text-left text-muted transition-colors hover:text-foreground">
            {dict.nav.apply}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border pt-8">
        <p className="max-w-3xl text-xs leading-relaxed text-muted">{dict.footer.disclaimer}</p>
        <p className="mt-4 text-xs text-muted">
          {interpolate(dict.footer.rights, { year })} ·{' '}
          <Link to="/privacy" className="underline decoration-border underline-offset-2 hover:text-foreground">
            {dict.form.step6.privacyLinkText}
          </Link>
        </p>
      </div>
    </footer>
  );
}
