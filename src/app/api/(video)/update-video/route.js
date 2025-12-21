import { dbconnect } from "@/lib/dbconnect";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";

export async function POST(req) {
  await dbconnect();
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const { thumbnail, title, description, videoId } = data;

    if (!isValidObjectId(videoId) || !thumbnail || !title || !description) {
      throw new ApiError("all feilds are required", 401);
    }
    const thumbnailUpload = await cloudinaryUpload(thumbnail);

    if (!thumbnailUpload) throw new ApiError("error on cloudinary upload", 500);

    const updateVideoDetails = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        $set: {
          thumbnail: thumbnailUpload,
          title,
          description,
        },
      },
      { new: true }
    );

    if (!updateVideoDetails) {
      throw new ApiError("error on update video details", 500);
    }
    return NextResponse.json(
      new ApiResponse(
        true,
        " update Video Details successfully",
        200,
        updateVideoDetails
      ),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on update Video Details",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
