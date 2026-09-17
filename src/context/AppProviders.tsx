import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { LangContext, detectLang, DICTS } from '../i18n';
import { detectCurrency, type Currency } from '../lib/currency';

const CurrencyContext = createContext<Currency | null>(null);

export function useCurrency(): Currency {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within AppProviders');
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const lang = useMemo(() => detectLang(), []);
  const currency = useMemo(() => detectCurrency(), []);
  const dict = DICTS[lang];

  const langValue = useMemo(() => ({ lang, dict }), [lang, dict]);

  return (
    <LangContext.Provider value={langValue}>
      <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>
    </LangContext.Provider>
  );
}
