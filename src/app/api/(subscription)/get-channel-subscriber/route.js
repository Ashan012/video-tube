import { dbconnect } from "@/lib/dbconnect";
import subscriptionModel from "@/models/subscriptions.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");
    if (!isValidObjectId(channelId)) {
      throw new ApiError("channel id is invalid");
    }

    const listOfSubscriber = await subscriptionModel.find({
      channel: channelId,
    });

    console.log(listOfSubscriber);
    if (Array.isArray(listOfSubscriber) && listOfSubscriber.length === 0) {
      return NextResponse.json(
        new ApiResponse(
          true,
          "no one subscribe this channel",
          200,
          listOfSubscriber
        ),
        { status: 200 }
      );
    }
    if (!listOfSubscriber) {
      throw new ApiError("Error on getting list of subscriber", 500);
    }

    return NextResponse.json(
      new ApiResponse(
        true,
        "get channel subscriber list successfully",
        200,
        listOfSubscriber
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get subscriber list  ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
