import { z } from "zod";

export const playListSchema = z.object({
  name: z
    .string()
    .min(3, "minimum 3 character are required")
    .max(20, "maximum 20 character are allowed"),

  description: z
    .string()
    .min(3, "minimum 3 character are required")
    .max(40, "maximum 40 character are allowed"),
});
