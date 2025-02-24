import { z } from "zod";

export const notificationSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  message: z.string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
  link: z.string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
