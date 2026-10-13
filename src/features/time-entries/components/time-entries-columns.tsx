"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { TimeEntry } from "@/types/memtime";

import { entryDurationMs } from "../entry-duration";
import { DurationCell } from "./DurationCell";

export interface TimeEntriesColumnActions {
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
}

export interface TimeEntriesColumnOptions extends TimeEntriesColumnActions {
  maxDurationMs: number;
}

export function getTimeEntriesColumns(
  options: TimeEntriesColumnOptions,
): ColumnDef<TimeEntry>[] {
  const { maxDurationMs, onEdit, onDelete } = options;

  return [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-mono tabular text-xs text-muted-foreground">
          {row.getValue("id")}
        </span>
      ),
      meta: { headerClassName: "w-[72px]" },
    },
    {
      accessorKey: "taskId",
      header: "Task ID",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-mono tabular text-xs">
          {row.getValue("taskId")}
        </span>
      ),
      meta: { headerClassName: "w-[88px]" },
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string;
        return (
          <span className="block truncate" title={comment}>
            {comment}
          </span>
        );
      },
      enableSorting: false,
      meta: {
        headerClassName: "w-full min-w-[8rem]",
        cellClassName: "max-w-0",
      },
    },
    {
      id: "duration",
      header: "Duration",
      enableSorting: false,
      cell: ({ row }) => {
        const ms = entryDurationMs(row.original);
        return <DurationCell ms={ms} maxMs={maxDurationMs} />;
      },
      meta: { headerClassName: "w-[160px]" },
    },
    {
      accessorKey: "start",
      header: "Start",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono tabular text-xs">
          {formatDateTime(row.getValue("start"))}
        </span>
      ),
      enableSorting: false,
      meta: { cellClassName: "whitespace-nowrap" },
    },
    {
      accessorKey: "end",
      header: "End",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono tabular text-xs">
          {formatDateTime(row.getValue("end"))}
        </span>
      ),
      enableSorting: false,
      meta: { cellClassName: "whitespace-nowrap" },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono tabular text-xs text-muted-foreground">
          {formatDateTime(row.getValue("createdAt"))}
        </span>
      ),
      enableSorting: false,
      meta: { cellClassName: "whitespace-nowrap" },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit entry ${entry.id}`}
              onClick={() => onEdit(entry)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete entry ${entry.id}`}
              onClick={() => onDelete(entry)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      meta: {
        headerClassName: "w-[100px] text-right",
        cellClassName: "text-right",
      },
    },
  ];
}
