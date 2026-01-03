import { dbconnect } from "@/lib/dbconnect";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!isValidObjectId(videoId)) {
      throw new ApiError("is not valid id", 401);
    }

    const deleteVideo = await VideoModel.findByIdAndDelete(videoId);
    if (!deleteVideo) {
      throw new ApiError("error on delete video", 500);
    }
    return NextResponse.json(
      new ApiResponse(true, "delete video successfully", 200),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on delete video route",
        status: error?.status || 500,
      },
      {
        status: error?.status || 500,
      }
    );
  }
}
