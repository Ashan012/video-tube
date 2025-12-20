import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
const videoModel =
  mongoose.models.Video || new mongoose.model("Video", videoSchema);

export default videoModel;
