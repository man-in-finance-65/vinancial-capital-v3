import type { ReactNode } from 'react';

export function SectionHeading({ index, heading, children }: { index: string; heading: string; children?: ReactNode }) {
  return (
    <div className="mb-10 md:mb-14">
      <span className="font-slab text-sm font-semibold tracking-[0.3em] text-sky">{index}</span>
      <h2 className="mt-3 font-slab text-3xl font-semibold leading-tight text-foreground md:text-5xl">{heading}</h2>
      {children && <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{children}</div>}
    </div>
  );
}
