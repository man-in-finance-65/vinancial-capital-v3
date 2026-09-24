import { useLang } from '../../i18n';

export function AprSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { dict } = useLang();

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{dict.calculatorPage.aprLabel}</span>
        <span className="text-sm font-semibold text-foreground">{value.toFixed(1)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={30}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
        aria-label={dict.calculatorPage.aprLabel}
      />
    </div>
  );
}
