import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectOption = { value: string; label: string };

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function selectOption(opt: SelectOption) {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full min-h-[48px] rounded-card border border-border bg-panel px-4 pr-10 text-base text-foreground placeholder:text-muted focus:border-sky"
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (filtered[activeIndex]) selectOption(filtered[activeIndex]);
            } else if (e.key === 'Escape') {
              setOpen(false);
              setQuery('');
            }
          }}
        />
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
      </div>
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="vc-scrollbar absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-card border border-border bg-surface py-1 shadow-xl"
        >
          {filtered.length === 0 && <li className="px-4 py-2 text-sm text-muted">—</li>}
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(opt);
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${i === activeIndex ? 'bg-sky/10 text-foreground' : 'text-foreground/90'} ${
                opt.value === value ? 'font-semibold text-sky' : ''
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
