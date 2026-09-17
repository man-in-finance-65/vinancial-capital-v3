import { Check } from 'lucide-react';

export function OptionCard({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-[56px] w-full items-center justify-between gap-4 rounded-card border px-5 py-4 text-left transition-colors ${
        selected ? 'border-sky bg-sky/10' : 'border-border bg-panel hover:border-sky/50'
      }`}
    >
      <span>
        <span className="block font-sans text-base font-medium text-foreground">{label}</span>
        {sub && <span className="mt-0.5 block text-xs text-muted">{sub}</span>}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? 'border-sky bg-sky text-ink' : 'border-border text-transparent'
        }`}
        aria-hidden
      >
        <Check size={14} strokeWidth={3} />
      </span>
    </button>
  );
}
