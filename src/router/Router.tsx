import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

type RouterValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState(null, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

// Manages the `?apply=1` query param that drives the fullscreen application form,
// so the phone's back button closes the form instead of leaving the page.
export function useApplyOverlay(): { isOpen: boolean; open: () => void; close: () => void } {
  const [isOpen, setIsOpen] = useState(() => new URLSearchParams(window.location.search).get('apply') === '1');

  useEffect(() => {
    const onPopState = () => {
      setIsOpen(new URLSearchParams(window.location.search).get('apply') === '1');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const open = () => {
    if (new URLSearchParams(window.location.search).get('apply') === '1') {
      setIsOpen(true);
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('apply', '1');
    window.history.pushState({ vcApply: true }, '', url.toString());
    setIsOpen(true);
  };

  const close = () => {
    if (new URLSearchParams(window.location.search).get('apply') === '1') {
      window.history.back();
    } else {
      setIsOpen(false);
    }
  };

  return { isOpen, open, close };
}
