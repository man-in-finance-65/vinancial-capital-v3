import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen, children]);

  return (
    <div className="rounded-card border border-border bg-panel">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-slab text-lg font-semibold text-foreground transition-colors hover:text-sky"
      >
        {label}
        <ChevronDown size={20} className={`shrink-0 text-sky transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <div style={{ maxHeight }} className="overflow-hidden transition-[max-height] duration-300 ease-in-out">
        <div ref={contentRef} className="flex flex-col gap-4 px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
