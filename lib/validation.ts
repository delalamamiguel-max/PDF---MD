import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  tags: z.array(z.string().min(1)).max(20).optional().default([])
});

export const listDocumentsSchema = z.object({
  status: z.enum(["Processing", "Ready", "Failed"]).optional(),
  q: z.string().optional(),
  tag: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

export const reprocessSchema = z.object({
  reason: z.string().min(2).max(200)
});
