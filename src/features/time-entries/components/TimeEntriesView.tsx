"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error-messages";
import { hasNextPage, parsePagination } from "@/lib/pagination";
import type { TimeEntry } from "@/types/memtime";

import { useTimeEntries } from "../hooks";
import { DeleteTimeEntryDialog } from "./DeleteTimeEntryDialog";
import { PaginationControls } from "./PaginationControls";
import { TimeEntriesTable } from "./TimeEntriesTable";
import { TimeEntryFormDialog } from "./TimeEntryFormDialog";

type DialogState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; entry: TimeEntry }
  | { kind: "delete"; entry: TimeEntry };

export function TimeEntriesView() {
  const searchParams = useSearchParams();
  const pagination = parsePagination(searchParams);
  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useTimeEntries(pagination);

  const [dialog, setDialog] = useState<DialogState>({ kind: "closed" });

  const entries = data ?? [];
  const showInitialLoading = isLoading && !isPlaceholderData;
  const isEmptyPastEnd =
    !showInitialLoading && !isError && entries.length === 0 && pagination.offset > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Time tracking"
        title="Time entries"
        description="Track where your hours go."
        action={
          <Button type="button" onClick={() => setDialog({ kind: "create" })}>
            <Plus className="h-4 w-4" />
            New entry
          </Button>
        }
      />

      {showInitialLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      {!showInitialLoading && !isError && isEmptyPastEnd && (
        <Alert>
          <AlertDescription>
            No more entries on this page. Go back to see previous results.
          </AlertDescription>
        </Alert>
      )}

      {!showInitialLoading && !isError && !isEmptyPastEnd && (
        <>
          <TimeEntriesTable
            entries={entries}
            onEdit={(entry) => setDialog({ kind: "edit", entry })}
            onDelete={(entry) => setDialog({ kind: "delete", entry })}
          />
          <PaginationControls
            pagination={pagination}
            hasNext={hasNextPage(entries.length, pagination.limit)}
            isFetching={isFetching}
          />
        </>
      )}

      <TimeEntryFormDialog
        open={dialog.kind === "create" || dialog.kind === "edit"}
        onOpenChange={(open) => {
          if (!open) setDialog({ kind: "closed" });
        }}
        entry={dialog.kind === "edit" ? dialog.entry : undefined}
      />

      <DeleteTimeEntryDialog
        entry={dialog.kind === "delete" ? dialog.entry : null}
        open={dialog.kind === "delete"}
        onOpenChange={(open) => {
          if (!open) setDialog({ kind: "closed" });
        }}
        pagination={pagination}
        entriesOnPage={entries.length}
      />
    </div>
  );
}
