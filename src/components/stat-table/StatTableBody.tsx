"use client";

import { flexRender, type Row, type Cell, type Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, type CSSProperties } from "react";
import { PlayerCell } from "./PlayerCell";
import { StatCell } from "./StatCell";

interface StatTableBodyProps<T> {
  table: Table<T>;
  rows: Row<T>[];
  percentiles: Map<string, Map<number, number>>;
  playerNameColumn: string;
}

interface StatColumnMeta {
  sticky?: boolean;
  stickyLeft?: number;
  numeric?: boolean;
  colorScale?: boolean;
}

function getCellWidthStyles(
  size: number,
  minSize: number | undefined,
  maxSize: number | undefined,
  sticky: boolean,
): CSSProperties {
  if (sticky) {
    return {
      width: size,
      minWidth: size,
      maxWidth: size,
    };
  }

  const minWidth = Math.min(
    size,
    Math.max(minSize ?? 0, size <= 55 ? 40 : size <= 70 ? 48 : 56),
  );
  const maxWidth = Math.min(maxSize ?? size, size);

  return {
    width: `clamp(${minWidth}px, calc(${(size / 14).toFixed(2)}vw + ${Math.round(size * 0.55)}px), ${maxWidth}px)`,
    minWidth,
    maxWidth,
  };
}

export function StatTableBody<T>({
  table,
  rows,
  percentiles,
  playerNameColumn,
}: StatTableBodyProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 15,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-auto min-h-48"
      style={{
        height: "calc(100vh - 280px)",
        maxHeight: "calc(100dvh - 280px)",
      }}
    >
      <table className="w-max min-w-full border-collapse">
        <thead className="sticky top-0 z-20">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as StatColumnMeta | undefined;
                const isSorted = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    className={`whitespace-nowrap border-b border-border bg-bg-card px-1.5 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary select-none sm:px-2 ${
                      meta?.numeric ? "text-right" : "text-left"
                    } ${meta?.sticky ? "sticky z-30" : ""}`}
                    style={{
                      ...getCellWidthStyles(
                        header.getSize(),
                        header.column.columnDef.minSize,
                        header.column.columnDef.maxSize,
                        Boolean(meta?.sticky),
                      ),
                      ...(meta?.sticky
                        ? { left: meta.stickyLeft ?? 0 }
                        : {}),
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      className={`flex items-center gap-1 ${meta?.numeric ? "justify-end" : ""}`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <span className="text-text-secondary/50">
                        {isSorted === "asc"
                          ? "↑"
                          : isSorted === "desc"
                            ? "↓"
                            : header.column.getCanSort()
                              ? "↕"
                              : ""}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualizer.getVirtualItems().length > 0 && (
            <tr>
              <td
                style={{
                  height: virtualizer.getVirtualItems()[0]?.start ?? 0,
                }}
              />
            </tr>
          )}

          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isEven = virtualRow.index % 2 === 0;

            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={`transition-colors hover:bg-bg-hover ${
                  isEven ? "bg-bg-card" : "bg-bg-table-row-alt"
                }`}
              >
                {row.getVisibleCells().map((cell: Cell<T, unknown>) => {
                  const meta = cell.column.columnDef.meta as StatColumnMeta | undefined;

                  const isPlayerCol = cell.column.id === playerNameColumn;
                  const rowData = row.original as Record<string, unknown>;

                  const percentile = meta?.colorScale
                    ? percentiles.get(cell.column.id)?.get(virtualRow.index)
                    : undefined;

                  return (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap px-1.5 py-1 text-sm sm:px-2 ${
                        meta?.numeric ? "text-right font-tabular" : "text-left"
                      } ${
                        meta?.sticky
                          ? `sticky z-10 ${isEven ? "bg-bg-card" : "bg-bg-table-row-alt"}`
                          : ""
                      }`}
                      style={{
                        ...getCellWidthStyles(
                          cell.column.getSize(),
                          cell.column.columnDef.minSize,
                          cell.column.columnDef.maxSize,
                          Boolean(meta?.sticky),
                        ),
                        ...(meta?.sticky
                          ? { left: meta.stickyLeft ?? 0 }
                          : {}),
                      }}
                    >
                      {isPlayerCol ? (
                        <PlayerCell
                          name={rowData.fullName as string}
                          headshotUrl={rowData.headshotUrl as string | null}
                        />
                      ) : meta?.colorScale && percentile != null ? (
                        <StatCell
                          value={flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                          columnId={cell.column.id}
                          percentile={percentile}
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {virtualizer.getVirtualItems().length > 0 && (
            <tr>
              <td
                style={{
                  height:
                    virtualizer.getTotalSize() -
                    (virtualizer.getVirtualItems().at(-1)?.end ?? 0),
                }}
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
