import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function GET() {
  // get total subscribes like and views
  //get all video that they upload on channel

  await dbconnect();
  try {
    const session = await getServerSession(authOptions);
    const userId = session._id;

    const dashboard = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "videos._id",
          foreignField: "video",
          as: "likedVideo",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscriber",
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
        },
      },

      {
        $addFields: {
          totalLikes: { $size: "$likedVideo" },
          totalSubscribers: { $size: "$subscriber" },
          totalViews: { $sum: "$videos.views" },
        },
      },
      {
        $project: {
          totalLikes: 1,
          totalSubscribers: 1,
          totalViews: 1,
          videos: {
            thumbnail: 1,
            title: 1,
            isPublished: 1,
            views: 1,
            createdAt: 1,
          },
        },
      },
    ]);
    if (!dashboard.length) {
      throw new ApiError("dashboard details not found", 500);
    }

    return NextResponse.json(
      new ApiResponse(
        true,
        "get dashboard details  successfully",
        200,
        dashboard[0]
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get subscriberd channel list  ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
