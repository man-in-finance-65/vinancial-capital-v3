export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-slab font-bold uppercase tracking-[0.22em] text-foreground ${className}`}>
      VINANCIAL<span className="text-sky">·</span>CAPITAL
    </span>
  );
}
