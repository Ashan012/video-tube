import { ApiError } from "@/utils/ApiError";
import { dbconnect } from "@/lib/dbconnect";
import { isValidObjectId } from "mongoose";
import commentModel from "@/models/comments.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import tweetModel from "@/models/tweet.model";

export async function GET() {
  await dbconnect();
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user was not authorize", 404);
    }
    const userId = session?._id;

    const getAllTweets = await tweetModel.find({ owner: userId });

    if (!getAllTweets) {
      throw new ApiError("Error on get all tweets  in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "get all tweets successfully", 200, getAllTweets),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get all tweets route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
