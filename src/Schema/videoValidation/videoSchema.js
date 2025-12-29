import { z } from "zod";
import {
  videoFileValidation,
  descriptionValidation,
  thumbnailValidation,
  titleValidation,
} from "./declareValidtion";

export const publishVideoSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  videoFile: videoFileValidation,
  thumbnail: thumbnailValidation,
});

export const updateVideoSchema = z.object({
  thumbnail: thumbnailValidation,
  title: titleValidation,
  description: descriptionValidation,
});
