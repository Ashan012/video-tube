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
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";

export async function POST(req) {
  await dbconnect();
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const { videoId, thumbnail, title, description, owner } = data;

    if (!isValidObjectId(videoId) || !title || !description) {
      throw new ApiError("title and description required", 401);
    }
    const session = await getServerSession(authOptions);
    const checkOwner = await VideoModel.findById(videoId).select("owner");

    const isOwner = checkOwner.owner == session._id;
    if (!isOwner) {
      throw new ApiError("Unauthorize user", 404);
    }

    const hasThumbnail = thumbnail instanceof File && thumbnail.size > 0;

    if (!hasThumbnail) {
      const updateVideoDetails = await VideoModel.findOneAndUpdate(
        { _id: videoId },

        {
          $set: {
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
    } else {
      console.log("with thumbnail");
      if (!(thumbnail instanceof File)) {
        throw new ApiError("Thumbnail must be a file", 400);
      }

      const thumbnailUpload = await cloudinaryUpload(thumbnail);

      if (!thumbnailUpload)
        throw new ApiError("error on cloudinary upload", 500);

      const updateVideoDetails = await VideoModel.findOneAndUpdate(
        { _id: videoId },

        {
          $set: {
            thumbnail: thumbnailUpload.secure_url,
            title,
            description,
          },
        },

        { returnDocument: "before" }
      );

      const thumbnailPublicId = updateVideoDetails.thumbnail;

      const publicId = extractPublicId(thumbnailPublicId);

      const deleteCloudinaryOldResource = await cloudinaryDeleteResource(
        publicId
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
    }
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
