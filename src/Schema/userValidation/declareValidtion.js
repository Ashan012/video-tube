import { z } from "zod";

const ACCEPT_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb

export const usernameValidation = z
  .string()
  .min(2, "minimum 2 character are allowed")
  .max(20, "maximum 20 character are allowed")
  .regex(/^[a-zA-Z0-9_]+$/, "username cannot contain Special Character");

export const passwordValidation = z
  .string()
  .min(8, "minimum 8 character are required")
  .max(16, "maximum 16 character are allowed")
  .regex(/[A-Z]/, "At least one uppercase letter required")
  .regex(/[a-z]/, "At least one lowercase letter required")
  .regex(/\d/, "At least one number required")
  .regex(/[@$!%*?&]/, "At least one special character required")
  .regex(/^\S+$/, "Spaces are not allowed");

export const emailValidation = z
  .string()
  .email({ message: "invalid email address" });

export const fullNameValidation = z.string().min(1, "Fullname are reuired");

export const imageValidation = z
  .instanceof(File)
  .refine((avatar) => avatar.size <= MAX_FILE_SIZE, {
    message: "File size is not more than a 2 mb",
  })
  .refine((avatar) => ACCEPT_IMAGE.includes(avatar.type), {
    message: "Only png jpeg and webp allowed",
  });
