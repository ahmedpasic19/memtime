import { z } from "zod";

import type { TimeEntry, TimeEntryInput } from "@/types/memtime";

export const timeEntryFormSchema = z
  .object({
    taskId: z
      .number()
      .int()
      .min(0)
      .nullable()
      .refine((id) => id !== null, { message: "Select a task" }),
    comment: z
      .string()
      .trim()
      .min(1, "Comment is required")
      .max(500, "Comment must be at most 500 characters"),
    startLocal: z.string().min(1, "Start time is required"),
    endLocal: z.string().min(1, "End time is required"),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startLocal);
    const end = new Date(data.endLocal);
    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid start time",
        path: ["startLocal"],
      });
    }
    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid end time",
        path: ["endLocal"],
      });
    }
    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end <= start
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End must be after start",
        path: ["endLocal"],
      });
    }
  });

export type TimeEntryFormValues = z.input<typeof timeEntryFormSchema>;

export function toApiPayload(values: TimeEntryFormValues): TimeEntryInput {
  if (values.taskId === null) {
    throw new Error("taskId is required");
  }
  return {
    taskId: values.taskId,
    comment: values.comment.trim(),
    start: new Date(values.startLocal).toISOString(),
    end: new Date(values.endLocal).toISOString(),
  };
}

function toDatetimeLocalValueFromDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toDatetimeLocalValue(iso: string): string {
  return toDatetimeLocalValueFromDate(new Date(iso));
}

export function fromTimeEntry(entry: TimeEntry): TimeEntryFormValues {
  return {
    taskId: entry.taskId,
    comment: entry.comment,
    startLocal: toDatetimeLocalValue(entry.start),
    endLocal: toDatetimeLocalValue(entry.end),
  };
}

export function defaultCreateValues(): TimeEntryFormValues {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    taskId: null,
    comment: "",
    startLocal: toDatetimeLocalValueFromDate(start),
    endLocal: toDatetimeLocalValueFromDate(end),
  };
}
