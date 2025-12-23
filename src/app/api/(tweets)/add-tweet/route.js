import { ApiError } from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import { dbconnect } from "@/lib/dbconnect";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import tweetModel from "@/models/tweet.model";

export async function POST(req) {
  await dbconnect();
  try {
    const { content } = await req.json();

    if (!content) throw new ApiError("content are required", 401);

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user was not authorie", 404);
    }

    const userId = session._id;

    const addTweet = await tweetModel.create({
      content,
      owner: userId,
    });

    if (!addTweet) {
      throw new ApiError("Error on add tweet  in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "add tweets successfully", 200, addTweet),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on add tweets route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
