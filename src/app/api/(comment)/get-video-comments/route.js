import { ApiError } from "@/utils/ApiError";
import { dbconnect } from "@/lib/dbconnect";
import { isValidObjectId } from "mongoose";
import commentModel from "@/models/comments.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!isValidObjectId(videoId)) {
      throw new ApiError("videoID is not valid", 401);
    }

    const getAllComment = await commentModel
      .find({ video: videoId })
      .populate("owner", "avatar fullName");

    if (!getAllComment) {
      throw new ApiError("Error on get all comment  in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "get all comment successfully", 200, getAllComment),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on add comment route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
