"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/error-messages";
import type { ParsedPagination } from "@/lib/pagination";
import type { TimeEntry } from "@/types/memtime";

import { useDeleteTimeEntry } from "../hooks";

interface DeleteTimeEntryDialogProps {
  entry: TimeEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pagination: ParsedPagination;
  entriesOnPage: number;
}

export function DeleteTimeEntryDialog({
  entry,
  open,
  onOpenChange,
  pagination,
  entriesOnPage,
}: DeleteTimeEntryDialogProps) {
  const deleteMutation = useDeleteTimeEntry();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      deleteMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await deleteMutation.mutateAsync(entry.id);
      toast.success(`Time entry #${entry.id} deleted`);
      handleOpenChange(false);

      if (entriesOnPage <= 1 && pagination.offset > 0) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(
          "offset",
          String(Math.max(0, pagination.offset - pagination.limit)),
        );
        router.push(`/time-entries?${params.toString()}`);
      }
    } catch {
      // Error shown inline via deleteMutation.isError
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete time entry</DialogTitle>
          <DialogDescription>
            This will permanently remove time entry #{entry?.id}. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {deleteMutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {getErrorMessage(deleteMutation.error)}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => void handleDelete()}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
