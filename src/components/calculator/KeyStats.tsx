export function KeyStats({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-full border border-border bg-panel px-4 py-2 text-xs">
          <span className="text-muted">{stat.label}: </span>
          <span className="font-semibold text-foreground">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
