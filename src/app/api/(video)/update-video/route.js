import { dbconnect } from "@/lib/dbconnect";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import {
  cloudinaryDeleteResource,
  cloudinaryUpload,
  extractPublicId,
} from "@/utils/cloudinaryUpload";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

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
          thumbnail: thumbnailUpload.secure_url,
          title,
          description,
        },
      },
      { new: true }
    );

    //later on if i don't need updated video on frontend so i utilize this option
    // const updateVideoDetails = await VideoModel.findOneAndUpdate(
    //   { _id: videoId },

    //   {
    //     $set: {
    //       thumbnail: thumbnailUpload.secure_url,
    //       title,
    //       description,
    //     },
    //   },

    //   { returnDocument: "before" }
    // );

    // const thumbnailPublicId = updateVideoDetails.thumbnail;

    // const publicId = extractPublicId(thumbnailPublicId);

    // const deleteCloudinaryOldResource = await cloudinaryDeleteResource(
    //   publicId
    // );

    // if (!deleteCloudinaryOldResource) {
    //   throw new ApiError("failed to delete old resource");
    // }

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
