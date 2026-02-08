"use client";

import type { AdvancedFilter } from "./types";

interface FilterSummaryProps {
  pos: string | null;
  team: string | null;
  minGP: number | null;
  filters: AdvancedFilter[];
  onClearPos: () => void;
  onClearTeam: () => void;
  onClearMinGP: () => void;
  onRemoveFilter: (id: string) => void;
  columnHeaders: Record<string, string>;
}

const operatorLabels: Record<string, string> = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
};

export function FilterSummary({
  pos,
  team,
  minGP,
  filters,
  onClearPos,
  onClearTeam,
  onClearMinGP,
  onRemoveFilter,
  columnHeaders,
}: FilterSummaryProps) {
  const hasFilters = pos || team || minGP != null || filters.length > 0;
  if (!hasFilters) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {pos && (
        <Chip label={`Position: ${pos}`} onClear={onClearPos} />
      )}
      {team && (
        <Chip label={`Team: ${team}`} onClear={onClearTeam} />
      )}
      {minGP != null && (
        <Chip label={`Min GP: ${minGP}`} onClear={onClearMinGP} />
      )}
      {filters.map((f) => (
        <Chip
          key={f.id}
          label={`${columnHeaders[f.columnId] ?? f.columnId} ${operatorLabels[f.operator]} ${f.value}`}
          onClear={() => onRemoveFilter(f.id)}
        />
      ))}
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-bg-hover px-2.5 py-0.5 text-xs text-text-primary">
      {label}
      <button
        onClick={onClear}
        className="ml-0.5 text-text-secondary hover:text-text-primary"
        aria-label={`Clear ${label}`}
      >
        &times;
      </button>
    </span>
  );
}
