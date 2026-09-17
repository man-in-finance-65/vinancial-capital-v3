import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function Reveal({ children, className = '', delayMs = 0 }: { children: ReactNode; className?: string; delayMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className={`vc-reveal ${visible ? 'vc-visible' : ''} ${className}`} style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}>
      {children}
    </div>
  );
}
