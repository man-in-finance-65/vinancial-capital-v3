import { ArrowRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-sky text-ink hover:opacity-90',
  secondary: 'bg-transparent text-sky border border-sky/50 hover:bg-sky/10',
};

type CommonProps = {
  variant?: Variant;
  icon?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type LinkAsButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

export function Button({ variant = 'primary', icon = false, children, className = '', as, ...rest }: ButtonProps | LinkAsButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (as === 'a') {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} {...anchorRest}>
        {children}
        {icon && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
      {icon && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </button>
  );
}
