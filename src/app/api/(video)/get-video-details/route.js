import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import mongoose from "mongoose";
import likeModel from "@/models/like.model";
import commentModel from "@/models/comments.model";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId");
    if (!videoId) {
      throw new ApiError("videoId is missing", 400);
    }

    const session = await getServerSession(authOptions);

    const viewsUpdate = await VideoModel.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });
    const watchHistory = await UserModel.findByIdAndUpdate(session._id, {
      $push: { watchHistory: videoId },
    });
    const videoDetails = await VideoModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(videoId) } },

      // Video owner info

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      { $unwind: "$ownerDetails" },
      {
        $addFields: {
          ownerAvatar: "$ownerDetails.avatar",
          ownerFullName: "$ownerDetails.fullName",
          ownerUsername: "$ownerDetails.username",
        },
      },

      // Subscribers & Likes
      {
        $lookup: {
          from: "subscriptions",
          localField: "owner",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "videoLikes",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "disLikeVideo",
          as: "videoDisLikes",
        },
      },

      // Comments + comment owner info
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "videoComments",
        },
      },
      { $unwind: { path: "$videoComments", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "videoComments.owner",
          foreignField: "_id",
          as: "videoComments.ownerDetails",
        },
      },
      {
        $unwind: {
          path: "$videoComments.ownerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "videoComments.ownerAvatar": "$videoComments.ownerDetails.avatar",
          "videoComments.ownerFullName": "$videoComments.ownerDetails.fullName",
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          owner: { $first: "$owner" },
          description: { $first: "$description" },
          videoFile: { $first: "$videoFile" },
          views: { $first: "$views" },
          createdAt: { $first: "$createdAt" },
          ownerAvatar: { $first: "$ownerAvatar" },
          ownerFullName: { $first: "$ownerFullName" },
          ownerUsername: { $first: "$ownerUsername" },
          subscribers: { $first: "$subscribers" },
          videoLikes: { $first: "$videoLikes" },
          videoDisLikes: { $first: "$videoDisLikes" },
          videoComments: { $push: "$videoComments" },
        },
      },

      {
        $addFields: {
          videoLikesCount: { $size: "$videoLikes" },
          videoDisLikesCount: { $size: "$videoDisLikes" },
          subcribedChannel: { $size: "$subscribers" },
          isLiked: {
            $in: [
              new mongoose.Types.ObjectId(session._id),
              {
                $map: {
                  input: "$videoLikes",
                  as: "like",
                  in: "$$like.likedBy",
                },
              },
            ],
          },
          isDisLike: {
            $in: [
              new mongoose.Types.ObjectId(session._id),
              {
                $map: {
                  input: "$videoDisLikes",
                  as: "like",
                  in: "$$like.likedBy",
                },
              },
            ],
          },
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
          videoFile: 1,
          title: 1,
          owner: 1,
          description: 1,
          views: 1,
          createdAt: 1,
          ownerAvatar: 1,
          ownerFullName: 1,
          ownerUsername: 1,
          subcribedChannel: 1,
          isSubcribed: 1,
          videoLikesCount: 1,
          videoDisLikesCount: 1,
          isLiked: 1,
          isDisLike: 1,
          videoComments: {
            _id: 1,
            content: 1,
            owner: 1,
            ownerAvatar: 1,
            ownerFullName: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    if (!videoDetails.length) {
      throw new ApiError("videoDetails not found", 500);
    }

    return NextResponse.json(
      new ApiResponse(
        true,
        "get videoDetails  successfully",
        200,
        videoDetails[0]
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on videoDetails  fetching",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
