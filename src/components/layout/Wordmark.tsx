export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label="Vinancial Capital">
      <img src="/android-chrome-512x512.png" alt="" aria-hidden className="-ml-[0.2em] -mr-[0.26em] h-[2.4em] w-auto shrink-0 -translate-y-[0.2em]" />
      <span aria-hidden className="font-slab font-bold uppercase tracking-[0.06em] text-foreground">
        INANCIAL CAPITAL
      </span>
    </span>
  );
}
