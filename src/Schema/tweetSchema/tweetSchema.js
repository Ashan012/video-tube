import { z } from "zod";

export const tweetSchema = z.object({
  content: z
    .string()
    .min(3, "minimum 3 character are required")
    .max(10, "maximum 100 character are allowed"),
});
