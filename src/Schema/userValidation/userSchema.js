import { z } from "zod";

import {
  usernameValidation,
  emailValidation,
  fullNameValidation,
  imageValidation,
  passwordValidation,
} from "./declareValidtion";

export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  fullName: fullNameValidation,
  avatar: imageValidation,
  coverImage: imageValidation.optional(),
  password: passwordValidation,
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const changeCoverImageSchema = z.object({
  coverImage: imageValidation,
});

export const changeAvatarImageSchema = z.object({
  avatar: imageValidation,
});

export const accountDetailsUpdateSchema = z.object({
  email: emailValidation,
  fullName: fullNameValidation,
});

export const changePasswordSchema = z.object({
  oldPassword: passwordValidation,
  newPassword: passwordValidation,
});
