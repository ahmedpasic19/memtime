import { z } from "zod";

export const timeEntryInputSchema = z
  .object({
    taskId: z.number().int().min(0, "taskId must be a non-negative integer"),
    comment: z
      .string()
      .trim()
      .min(1, "Comment is required")
      .max(500, "Comment must be at most 500 characters"),
    start: z.string().refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Invalid start time",
    ),
    end: z.string().refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Invalid end time",
    ),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        message: "End must be after start",
        path: ["end"],
      });
    }
  });

export type TimeEntryInput = z.infer<typeof timeEntryInputSchema>;
