import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import { ApiError } from "@/utils/ApiError";
import { dbconnect } from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import subscriptionModel from "@/models/subscriptions.model";
import { ApiResponse } from "@/utils/ApiResponse";
import VideoModel from "@/models/vidoes.model";

export async function POST(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!isValidObjectId(channelId)) {
      throw new ApiError("isnot valid objectID", 400);
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user not authorize", 404);
    }
    const userId = session._id;

    const channelOwner = await VideoModel.findById(channelId);

    if (!channelOwner) {
      throw new ApiError("error on get channel owner", 501);
    }

    const subscribe = await subscriptionModel.create({
      subscriber: userId,
      channel: channelOwner?.owner,
    });

    if (!subscribe) {
      throw new ApiError("error on db during subscription", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "toggle subscribe successfully", 200),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on toogle subscribe ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
