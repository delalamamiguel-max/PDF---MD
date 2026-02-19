import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  tags: z.array(z.string().min(1)).max(20).optional().default([]),
  folderId: z.string().uuid("Invalid folder").optional()
});

export const listDocumentsSchema = z.object({
  status: z.enum(["Processing", "Ready", "Failed"]).optional(),
  q: z.string().optional(),
  tag: z.string().optional(),
  folderId: z.string().uuid().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

export const reprocessSchema = z.object({
  reason: z.string().min(2).max(200)
});

export const inviteRequestSchema = z.object({
  fullName: z.string().min(2).max(160),
  email: z.string().email(),
  heardAbout: z.string().max(400).optional()
});

export const createInviteSchema = z.object({
  invitedEmail: z.string().email().optional(),
  expiresInHours: z.number().int().min(1).max(24 * 30).optional()
});

export const signupWithInviteSchema = z.object({
  token: z.string().min(20),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8)
});

export const createFolderSchema = z.object({
  name: z.string().min(1).max(120),
  visibility: z.enum(["private", "unlisted", "public"]).optional()
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  visibility: z.enum(["private", "unlisted", "public"]).optional()
});
