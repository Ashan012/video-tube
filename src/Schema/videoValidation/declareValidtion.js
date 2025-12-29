import { z } from "zod";

const ACCEPT_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT_VIDEO = ["video/mp4", "video/mv4", "video/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; //2mb
const MAX_VIDEO_FILE_SIZE = 5 * 1024 * 1024; //5mb

export const videoFileValidation = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_VIDEO_FILE_SIZE, {
    message: "File size is not more than a 5 mb",
  })
  .refine((file) => ACCEPT_VIDEO.includes(file.type), {
    message: "Only mp4 mv4 and webp allowed",
  });

export const thumbnailValidation = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size is not more than a 2 mb",
  })
  .refine((file) => ACCEPT_IMAGE.includes(file.type), {
    message: "Only png jpeg and webp allowed",
  });

export const titleValidation = z
  .string()
  .min(3, "minimum 3 character are required")
  .max(100, "maximum 100 character are allowed");

export const descriptionValidation = z
  .string()
  .min(3, "minimum 3 character are required")
  .max(300, "maximum 100 character are allowed");
