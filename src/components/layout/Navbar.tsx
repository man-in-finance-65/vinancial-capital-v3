import { useEffect, useState } from 'react';
import { Link } from '../../router/Router';
import { useLang } from '../../i18n';
import { Wordmark } from './Wordmark';
import { HamburgerButton } from './HamburgerButton';
import { MobileMenu } from './MobileMenu';
import { Button } from '../ui/Button';

export function Navbar({ onApply }: { onApply: () => void }) {
  const { dict } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 px-6 py-5 transition-colors duration-300 md:px-12 md:py-6 lg:px-16 ${
          scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-border/60' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-sm md:text-base">
            <Wordmark />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
              {dict.nav.home}
            </Link>
            <Link to="/calculator" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
              {dict.nav.calculator}
            </Link>
            <Link to="/about" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
              {dict.nav.about}
            </Link>
            <Button variant="primary" icon onClick={onApply}>
              {dict.nav.apply}
            </Button>
          </div>
          <HamburgerButton isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} label={menuOpen ? dict.nav.menuClose : dict.nav.menuOpen} />
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onApply={onApply} />
    </>
  );
}
