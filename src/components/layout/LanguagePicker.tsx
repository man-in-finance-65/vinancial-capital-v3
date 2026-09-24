import { useEffect, useRef, useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useLang, type Lang } from '../../i18n';
import { TextInput } from '../ui/Field';

// Country + language pairs, like Hostinger's picker. `code` is the ISO country code used for the flag.
const LANGUAGE_NAMES: Record<Lang, string> = { es: 'Español', en: 'English', fr: 'Français' };
const OPTIONS: { code: string; country: string; lang: Lang }[] = [
  { code: 'ar', country: 'Argentina', lang: 'es' },
  { code: 'bo', country: 'Bolivia', lang: 'es' },
  { code: 'ca', country: 'Canada', lang: 'en' },
  { code: 'ca', country: 'Canada', lang: 'fr' },
  { code: 'cl', country: 'Chile', lang: 'es' },
  { code: 'co', country: 'Colombia', lang: 'es' },
  { code: 'cr', country: 'Costa Rica', lang: 'es' },
  { code: 'cu', country: 'Cuba', lang: 'es' },
  { code: 'ec', country: 'Ecuador', lang: 'es' },
  { code: 'sv', country: 'El Salvador', lang: 'es' },
  { code: 'es', country: 'España', lang: 'es' },
  { code: 'us', country: 'Estados Unidos', lang: 'es' },
  { code: 'gt', country: 'Guatemala', lang: 'es' },
  { code: 'hn', country: 'Honduras', lang: 'es' },
  { code: 'mx', country: 'México', lang: 'es' },
  { code: 'ni', country: 'Nicaragua', lang: 'es' },
  { code: 'pa', country: 'Panamá', lang: 'es' },
  { code: 'py', country: 'Paraguay', lang: 'es' },
  { code: 'pe', country: 'Perú', lang: 'es' },
  { code: 'pr', country: 'Puerto Rico', lang: 'es' },
  { code: 'do', country: 'República Dominicana', lang: 'es' },
  { code: 'us', country: 'United States', lang: 'en' },
  { code: 'uy', country: 'Uruguay', lang: 'es' },
  { code: 've', country: 'Venezuela', lang: 'es' },
];
const COUNTRY_KEY = 'vc_country';

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function Flag({ code }: { code: string }) {
  return <img src={`/flags/${code}.svg`} alt="" aria-hidden className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-border" />;
}

export function LanguagePicker() {
  const { lang, dict, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState(() => {
    try {
      return localStorage.getItem(COUNTRY_KEY);
    } catch {
      return null;
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = OPTIONS.find((o) => `${o.code}-${o.lang}` === country && o.lang === lang);
  const q = normalize(query.trim());
  const results = OPTIONS.filter((o) => normalize(`${o.country} ${LANGUAGE_NAMES[o.lang]}`).includes(q));

  function choose(o: (typeof OPTIONS)[number]) {
    const key = `${o.code}-${o.lang}`;
    setCountry(key);
    try {
      localStorage.setItem(COUNTRY_KEY, key);
    } catch {
      // ignore
    }
    setLang(o.lang);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={dict.nav.langTitle}
        className={`flex items-center gap-2 rounded-full border bg-panel/60 px-3 py-2 text-sm font-semibold uppercase text-foreground backdrop-blur transition-colors hover:border-sky/50 ${
          open ? 'border-sky' : 'border-border'
        }`}
      >
        {selected ? <Flag code={selected.code} /> : <Globe size={18} className="text-sky" aria-hidden />}
        {lang}
      </button>

      {open && (
        <div className="fixed inset-x-6 top-20 z-50 rounded-card md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-3 md:w-80 border border-border bg-surface p-4 shadow-2xl shadow-black/50">
          <p className="font-slab text-base font-semibold text-foreground">{dict.nav.langTitle}</p>
          <div className="relative mt-3">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <TextInput id="lang-search" autoFocus className="pl-10" placeholder={dict.nav.langSearch} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <ul className="vc-scrollbar mt-3 max-h-72 overflow-y-auto">
            {results.map((o) => {
              const isSelected = selected === o;
              return (
                <li key={`${o.code}-${o.lang}`}>
                  <button
                    type="button"
                    onClick={() => choose(o)}
                    aria-current={isSelected || undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-panel ${
                      isSelected ? 'bg-sky/10' : ''
                    }`}
                  >
                    <Flag code={o.code} />
                    <span className="font-semibold text-foreground">{o.country}</span>
                    <span className="text-muted">{LANGUAGE_NAMES[o.lang]}</span>
                  </button>
                </li>
              );
            })}
            {results.length === 0 && <li className="px-3 py-2.5 text-sm text-muted">{dict.nav.langEmpty}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
