import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId");
    if (!videoId) {
      throw new ApiError("videoId is missing", 400);
    }

    const session = await getServerSession(authOptions);
    const res = await VideoModel.findById(videoId);

    const userId = res.owner;

    console.log("userId===>", userId);

    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribeTo",
        },
      },

      {
        $addFields: {
          subcribedChannel: { $size: "$subscribers" },
          subcribedToChannel: { $size: "$subscribeTo" },
          isSubcribed: {
            $in: [
              new mongoose.Types.ObjectId(session._id),
              {
                $map: {
                  input: "$subscribers",
                  as: "sub",
                  in: "$$sub.subscriber",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          fullName: 1,
          avatar: 1,
          subcribedChannel: 1,
          subcribedToChannel: 1,
          isSubcribed: 1,
        },
      },
    ]);

    if (!user.length) {
      throw new ApiError("user not found", 404);
    }

    return NextResponse.json(
      new ApiResponse(true, "get current user successfully", 200, user[0]),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on channel profile fetching",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
