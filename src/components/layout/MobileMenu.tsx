import { useEffect } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useLang } from '../../i18n';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';

export function MobileMenu({ isOpen, onClose, onApply }: { isOpen: boolean; onClose: () => void; onApply: () => void }) {
  const { dict } = useLang();
  const { path } = useRouter();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const items = [
    { to: '/', label: dict.nav.home },
    { to: '/calculator', label: dict.nav.calculator },
    { to: '/about', label: dict.nav.about },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink/95 backdrop-blur-xl transition-opacity ${reduced ? '' : 'duration-700'} ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col px-6 pt-28 pb-10">
        <nav className="flex flex-1 flex-col">
          {items.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`border-b border-border py-4 font-slab text-4xl text-foreground transition-all hover:translate-x-2 hover:text-sky ${
                reduced
                  ? ''
                  : `duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`
              }`}
              style={reduced ? undefined : { transitionDelay: isOpen ? `${150 + i * 80}ms` : '0ms' }}
              aria-current={path === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div
          className={reduced ? '' : `transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={reduced ? undefined : { transitionDelay: isOpen ? '550ms' : '0ms' }}
        >
          <Button
            variant="primary"
            icon
            className="w-full"
            onClick={() => {
              onClose();
              onApply();
            }}
          >
            {dict.nav.apply}
          </Button>
        </div>
      </div>
    </div>
  );
}
