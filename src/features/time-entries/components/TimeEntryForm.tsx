"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  timeEntryFormSchema,
  type TimeEntryFormValues,
} from "../schema";
import { TaskPicker } from "./TaskPicker";

interface TimeEntryFormProps {
  mode: "create" | "edit";
  defaultValues: TimeEntryFormValues;
  onSubmit: (values: TimeEntryFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TimeEntryForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: TimeEntryFormProps) {
  const methods = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntryFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <TaskPicker mode={mode} />

        <div className="space-y-2">
          <Label htmlFor="comment">Comment</Label>
          <Textarea id="comment" rows={3} {...register("comment")} />
          {errors.comment && (
            <p className="text-sm text-destructive">{errors.comment.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startLocal">Start</Label>
            <Input id="startLocal" type="datetime-local" {...register("startLocal")} />
            {errors.startLocal && (
              <p className="text-sm text-destructive">
                {errors.startLocal.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLocal">End</Label>
            <Input id="endLocal" type="datetime-local" {...register("endLocal")} />
            {errors.endLocal && (
              <p className="text-sm text-destructive">{errors.endLocal.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Create entry"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
