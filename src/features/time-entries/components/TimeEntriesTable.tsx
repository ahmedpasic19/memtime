"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/ui/data-table";
import type { TimeEntry } from "@/types/memtime";

import { entryDurationMs } from "../entry-duration";
import { getTimeEntriesColumns } from "./time-entries-columns";

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
}

export function TimeEntriesTable({
  entries,
  onEdit,
  onDelete,
}: TimeEntriesTableProps) {
  const maxDurationMs = useMemo(
    () =>
      entries.reduce(
        (max, entry) => Math.max(max, entryDurationMs(entry)),
        0,
      ),
    [entries],
  );

  const columns = useMemo(
    () => getTimeEntriesColumns({ onEdit, onDelete, maxDurationMs }),
    [onEdit, onDelete, maxDurationMs],
  );

  return (
    <DataTable
      columns={columns}
      data={entries}
      emptyMessage="No time entries yet. Create your first entry to get started."
      className="[&>div]:overflow-visible"
    />
  );
}
