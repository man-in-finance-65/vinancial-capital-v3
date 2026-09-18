import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLang, interpolate } from '../../i18n';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { INDUSTRY_ORDER, AUTO_CYCLE_MS, MACHINES, type IndustryKey } from '../../config/machines';
import { Button } from '../ui/Button';

const HeroScene = lazy(() => import('../three/HeroScene').then((m) => ({ default: m.HeroScene })));

export function Hero({ onApply }: { onApply: (industry: IndustryKey) => void }) {
  const { dict } = useLang();
  const reducedMotion = useReducedMotion();
  const [industry, setIndustry] = useState<IndustryKey>('construction');
  const [userLocked, setUserLocked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef<number>(0);

  useEffect(() => {
    const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = idle(() => setMountScene(true));
    return () => {
      if ((window as any).cancelIdleCallback) (window as any).cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (userLocked || paused || reducedMotion) {
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    function tick(now: number) {
      const elapsed = now - startRef.current;
      const pct = Math.min(1, elapsed / AUTO_CYCLE_MS);
      setProgress(pct);
      if (pct >= 1) {
        const currentIndex = INDUSTRY_ORDER.indexOf(industry);
        setIndustry(INDUSTRY_ORDER[(currentIndex + 1) % INDUSTRY_ORDER.length]);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [industry, userLocked, paused, reducedMotion]);

  function selectIndustry(key: IndustryKey) {
    setIndustry(key);
    setUserLocked(true);
  }

  const copy = dict.hero.industries[industry];
  const pickerLabels: Record<IndustryKey, string> = {
    construction: dict.hero.pickerConstruction,
    trucking: dict.hero.pickerTrucking,
    restaurant: dict.hero.pickerRestaurant,
  };

  return (
    <section className="relative flex h-screen min-h-[720px] flex-col overflow-hidden bg-brand-radial">
      <div className="vc-watermark">
        <img src="/android-chrome-512x512.png" alt="" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-32 text-center md:pt-40">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.34em] text-sky">{copy.eyebrow}</span>
        <h1 className="mt-4 font-slab text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {interpolate(dict.hero.headlineTemplate, { word: copy.word })} <span className="text-sky">{dict.hero.headlineSky}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{dict.hero.subtext}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" icon onClick={() => onApply(industry)}>
            {dict.hero.ctaApply}
          </Button>
          <Button
            variant="secondary"
            as="a"
            href="#calculator-preview"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calculator-preview')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
            }}
          >
            {dict.hero.ctaSeePayment}
          </Button>
        </div>
      </div>

      <div
        className="relative z-10 mt-4 flex-1"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {mountScene ? (
          <Suspense fallback={null}>
            <HeroScene industry={industry} reducedMotion={reducedMotion} />
          </Suspense>
        ) : (
          <img src={MACHINES[industry].posterPath} alt="" aria-hidden className="mx-auto h-full max-h-[420px] object-contain" />
        )}
      </div>

      <div className="relative z-10 mb-8 flex justify-center px-6" onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div role="tablist" aria-label={dict.hero.pickerLabel} className="flex gap-2 rounded-full border border-border bg-panel/60 p-1.5 backdrop-blur">
          {INDUSTRY_ORDER.map((key) => {
            const isActive = key === industry;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => selectIndustry(key)}
                className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors md:text-sm ${
                  isActive ? 'text-ink' : 'text-muted hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 -z-10 bg-sky"
                    style={{ clipPath: !userLocked ? `inset(0 ${100 - progress * 100}% 0 0)` : undefined }}
                  />
                )}
                {isActive && <span className="absolute inset-0 -z-20 bg-sky/30" />}
                {pickerLabels[key]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
