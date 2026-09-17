export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-mark.svg" alt="" aria-hidden className="h-[0.9em] w-auto shrink-0" />
      <span className="font-slab font-bold uppercase tracking-[0.22em] text-foreground">
        VINANCIAL<span className="text-sky">·</span>CAPITAL
      </span>
    </span>
  );
}
