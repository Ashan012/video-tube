import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      throw new ApiError("username is missing", 400);
    }

    const session = await getServerSession(authOptions);
    const user = await UserModel.aggregate([
      {
        $match: {
          username: username.toLowerCase(),
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
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "userVideo",
        },
      },
      {
        $addFields: {
          totalSubscribers: {
            $size: "$subscribers",
          },
          // subcribedToChannel: {
          //   $size: "$subscribeTo",
          // },
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
          _id: 1,
          fullName: 1,
          username: 1,
          avatar: 1,
          coverImage: 1,
          totalSubscribers: 1,
          // subcribedToChannel: 1,
          isSubcribed: 1,
          userVideo: 1,
        },
      },
    ]);

    if (!user.length) {
      throw new ApiError("failed to fetch user details", 500);
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
