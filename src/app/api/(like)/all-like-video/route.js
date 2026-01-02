import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import likeModel from "@/models/like.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { dbconnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";

export async function GET() {
  await dbconnect();
  try {
    const session = await getServerSession(authOptions);
    const userId = session._id;

    const userLikedVideo = await likeModel
      .find({ likedBy: userId })
      .select({ video: { $slice: -10 } })
      .select("-updatedAt -createdAt -disLikeVideo -comment -tweet -likedBy")
      .populate({
        path: "video",
        select: "title description thumbnail ",
      })
      .lean();

    if (!userLikedVideo) {
      throw new ApiError("failed to fetch like videos", 500);
    }
    return NextResponse.json(
      new ApiResponse(true, "all like video successfully", 200, userLikedVideo),

      {
        staus: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get like video route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
