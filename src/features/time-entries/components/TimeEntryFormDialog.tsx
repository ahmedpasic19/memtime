"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/error-messages";
import type { TimeEntry } from "@/types/memtime";

import { useCreateTimeEntry, useUpdateTimeEntry } from "../hooks";
import {
  defaultCreateValues,
  fromTimeEntry,
  toApiPayload,
  type TimeEntryFormValues,
} from "../schema";
import { TimeEntryForm } from "./TimeEntryForm";

interface TimeEntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: TimeEntry;
}

export function TimeEntryFormDialog({
  open,
  onOpenChange,
  entry,
}: TimeEntryFormDialogProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const createMutation = useCreateTimeEntry();
  const updateMutation = useUpdateTimeEntry();
  const mode = entry ? "edit" : "create";

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setFormError(null);
      createMutation.reset();
      updateMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: TimeEntryFormValues) => {
    setFormError(null);
    const payload = toApiPayload(values);

    try {
      if (mode === "create") {
        const created = await createMutation.mutateAsync(payload);
        toast.success(`Time entry #${created.id} created`);
      } else if (entry) {
        const updated = await updateMutation.mutateAsync({
          id: entry.id,
          input: payload,
        });
        toast.success(`Time entry #${updated.id} updated`, {
          description: `${updated.comment} · ${formatDateTime(updated.start)} – ${formatDateTime(updated.end)}`,
        });
      }
      handleOpenChange(false);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mode === "create" ? "New time entry" : "Edit time entry"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Log time against a task with a comment and time range."
              : "Update the task, comment, or time range for this entry."}
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <TimeEntryForm
          key={entry ? entry.id : "create"}
          mode={mode}
          defaultValues={entry ? fromTimeEntry(entry) : defaultCreateValues()}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
