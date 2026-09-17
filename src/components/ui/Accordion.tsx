import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import type { QA } from '../../i18n';
import { Link } from '../../router/Router';

type AccordionItem = QA & { linkTo?: string; linkLabel?: string };

function AccordionRow({ item, index, isOpen, onToggle }: { item: AccordionItem; index: number; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  useEffect(() => {
    if (!contentRef.current) return;
    setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen, item.a]);

  return (
    <div>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-base font-medium text-foreground transition-colors hover:text-sky md:text-lg"
        >
          {item.q}
          <ChevronDown size={20} className={`shrink-0 text-sky transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pb-5">
          <p className="text-sm leading-relaxed text-muted md:text-base">{item.a}</p>
          {item.linkTo && (
            <Link to={item.linkTo} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-sky hover:opacity-80">
              {item.linkLabel}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <AccordionRow key={i} item={item} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
      ))}
    </div>
  );
}
