export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label="Vinancial Capital">
      <img src="/logo-mark.svg" alt="" aria-hidden className="h-[1em] w-auto shrink-0" />
      <span aria-hidden className="font-slab font-bold uppercase tracking-[0.06em] text-foreground">
        INANCIAL CAPITAL
      </span>
    </span>
  );
}
