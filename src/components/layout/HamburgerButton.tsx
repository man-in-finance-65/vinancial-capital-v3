export function HamburgerButton({ isOpen, onClick, label }: { isOpen: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
    >
      <span
        className={`h-[2px] w-6 rounded-full bg-foreground transition-transform duration-500 ${
          isOpen ? 'translate-y-[8px] rotate-45' : ''
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
      />
      <span
        className={`h-[2px] w-4 rounded-full bg-foreground transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      />
      <span
        className={`h-[2px] w-6 rounded-full bg-foreground transition-transform duration-500 ${
          isOpen ? '-translate-y-[8px] -rotate-45' : ''
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
      />
    </button>
  );
}
