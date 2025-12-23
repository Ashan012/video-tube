import { ApiError } from "@/utils/ApiError";
import { dbconnect } from "@/lib/dbconnect";
import { isValidObjectId } from "mongoose";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import tweetModel from "@/models/tweet.model";

export async function POST(req) {
  await dbconnect();
  try {
    const { content, tweetId } = await req.json();

    if (!content) throw new ApiError("content are required", 401);

    if (!isValidObjectId(tweetId)) {
      throw new ApiError("tweetId is not valid", 401);
    }
    const updateTweet = await tweetModel.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    if (!updateTweet) {
      throw new ApiError("Error on update tweets save in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "update tweets successfully", 200, updateTweet),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on update tweets route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
