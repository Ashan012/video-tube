import { ApiError } from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import { dbconnect } from "@/lib/dbconnect";
import { isValidObjectId } from "mongoose";
import commentModel from "@/models/comments.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbconnect();
  try {
    const { content, videoId } = await req.json();

    if (!content) throw new ApiError("content are required", 401);

    if (!isValidObjectId(videoId)) {
      throw new ApiError("videoID is not valid", 401);
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user was not authorie", 404);
    }

    const userId = session._id;

    const addComment = await commentModel.create({
      content,
      video: videoId,
      owner: userId,
    });

    if (!addComment) {
      throw new ApiError("Error on add comment save in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "add comment successfully", 200, addComment),
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
