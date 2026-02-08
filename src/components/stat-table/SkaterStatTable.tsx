"use client";

import { StatTable } from "./StatTable";
import { skaterColumns } from "./columns/skater-columns";
import { skaterColumnGroups, skaterColumnPresets } from "./columns/column-groups";
import type { SkaterRow } from "./types";
import type { ColumnDef } from "@tanstack/react-table";

interface SkaterStatTableProps {
  data: SkaterRow[];
}

const columns = skaterColumns as unknown as ColumnDef<SkaterRow, unknown>[];

export function SkaterStatTable({ data }: SkaterStatTableProps) {
  return (
    <StatTable
      data={data}
      columns={columns}
      columnGroups={skaterColumnGroups}
      columnPresets={skaterColumnPresets}
      positions={["C", "LW", "RW", "D"]}
    />
  );
}
