"use client";

import type { AdvancedFilter } from "./types";

interface AdvancedFilterBuilderProps {
  filters: AdvancedFilter[];
  onChange: (filters: AdvancedFilter[]) => void;
  numericColumns: { id: string; header: string }[];
}

const operators = [
  { value: "gte", label: ">=" },
  { value: "gt", label: ">" },
  { value: "lte", label: "<=" },
  { value: "lt", label: "<" },
  { value: "eq", label: "=" },
] as const;

export function AdvancedFilterBuilder({
  filters,
  onChange,
  numericColumns,
}: AdvancedFilterBuilderProps) {
  function addFilter() {
    const first = numericColumns[0];
    if (!first) return;
    const newFilter: AdvancedFilter = {
      id: crypto.randomUUID(),
      columnId: first.id,
      operator: "gte",
      value: 0,
    };
    onChange([...filters, newFilter]);
  }

  function updateFilter(id: string, patch: Partial<AdvancedFilter>) {
    onChange(
      filters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  }

  function removeFilter(id: string) {
    onChange(filters.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-2">
      {filters.map((f) => (
        <div key={f.id} className="flex items-center gap-2">
          <select
            className="rounded-md border border-border bg-bg-card px-2 py-1 text-sm text-text-primary"
            value={f.columnId}
            onChange={(e) => updateFilter(f.id, { columnId: e.target.value })}
          >
            {numericColumns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.header}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-border bg-bg-card px-2 py-1 text-sm text-text-primary"
            value={f.operator}
            onChange={(e) =>
              updateFilter(f.id, {
                operator: e.target.value as AdvancedFilter["operator"],
              })
            }
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-20 rounded-md border border-border bg-bg-card px-2 py-1 text-sm text-text-primary"
            value={f.value}
            onChange={(e) =>
              updateFilter(f.id, { value: Number(e.target.value) })
            }
          />
          <button
            onClick={() => removeFilter(f.id)}
            className="rounded px-1.5 py-0.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            aria-label="Remove filter"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={addFilter}
        className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover"
      >
        + Add Filter
      </button>
    </div>
  );
}
