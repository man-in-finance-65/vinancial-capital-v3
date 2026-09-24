import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { LangContext, detectLang, DICTS, type Lang } from '../i18n';
import { detectCurrency, type Currency } from '../lib/currency';

const CurrencyContext = createContext<Currency | null>(null);

export function useCurrency(): Currency {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within AppProviders');
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectLang());
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem('vc_lang', next);
    } catch {
      // ignore
    }
  }, []);
  const currency = useMemo(() => detectCurrency(), []);
  const dict = DICTS[lang];

  const langValue = useMemo(() => ({ lang, dict, setLang }), [lang, dict, setLang]);

  return (
    <LangContext.Provider value={langValue}>
      <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>
    </LangContext.Provider>
  );
}
