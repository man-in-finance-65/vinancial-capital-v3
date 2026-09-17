/// <reference types="vite/client" />

import type { Lang } from './i18n/types';
import type { Currency } from './lib/currency';

declare global {
  interface Window {
    __VC_LANG__?: Lang;
    __VC_CURRENCY__?: Currency;
  }
}

export {};
