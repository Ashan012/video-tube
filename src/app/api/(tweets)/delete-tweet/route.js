import { dbconnect } from "@/lib/dbconnect";
import commentModel from "@/models/comments.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const { tweetId } = searchParams.get("tweetId");

    if (!isValidObjectId(tweetId)) {
      throw new ApiError("tweet id is invalid", 401);
    }
    const deleteTweet = await commentModel.findByIdAndDelete(tweetId);

    if (!deleteTweet) {
      throw new ApiError("error on db during tweet delete ", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "delete tweet successfully", 200),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on delete tweet route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
