import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const playlistModel =
  mongoose.models.Playlist || new mongoose.model("Playlist", playListSchema);

export default playlistModel;
