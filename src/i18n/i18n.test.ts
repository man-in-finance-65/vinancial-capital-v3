import { describe, expect, it } from 'vitest';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => flattenKeys(item, `${prefix}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value as object)
      .sort()
      .flatMap((key) => flattenKeys((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

describe('i18n key parity', () => {
  it('es, en and fr expose the exact same set of keys', () => {
    const enKeys = flattenKeys(en).sort();
    const esKeys = flattenKeys(es).sort();
    const frKeys = flattenKeys(fr).sort();

    expect(esKeys).toEqual(enKeys);
    expect(frKeys).toEqual(enKeys);
  });
});
