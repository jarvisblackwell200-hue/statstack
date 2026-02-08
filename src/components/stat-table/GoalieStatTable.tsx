"use client";

import { StatTable } from "./StatTable";
import { goalieColumns } from "./columns/goalie-columns";
import { goalieColumnGroups, goalieColumnPresets } from "./columns/column-groups";
import type { GoalieRow } from "./types";
import type { ColumnDef } from "@tanstack/react-table";

interface GoalieStatTableProps {
  data: GoalieRow[];
}

const columns = goalieColumns as unknown as ColumnDef<GoalieRow, unknown>[];

export function GoalieStatTable({ data }: GoalieStatTableProps) {
  return (
    <StatTable
      data={data}
      columns={columns}
      columnGroups={goalieColumnGroups}
      columnPresets={goalieColumnPresets}
    />
  );
}
