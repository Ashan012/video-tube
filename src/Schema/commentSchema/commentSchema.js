import { z } from "zod";

export const CommentSchema = z.object({
  content: z
    .string()
    .min(3, "minimum 3 character are required")
    .max(40, "maximum 40 character are allowed"),
});
