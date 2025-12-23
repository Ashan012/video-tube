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

    const subscribedId = searchParams.get("subscribedId");
    if (!isValidObjectId(subscribedId)) {
      throw new ApiError("subscribed id is invalid");
    }

    const listOfSubscribedChannel = await subscriptionModel.find({
      subscriber: subscribedId,
    });

    console.log(listOfSubscribedChannel);
    if (
      Array.isArray(listOfSubscribedChannel) &&
      listOfSubscribedChannel.length === 0
    ) {
      return NextResponse.json(
        new ApiResponse(
          true,
          "They have no subscribed channel",
          200,
          listOfSubscribedChannel
        ),
        { status: 200 }
      );
    }
    if (!listOfSubscribedChannel) {
      throw new ApiError("Error on getting list of subscriberd channel", 500);
    }

    return NextResponse.json(
      new ApiResponse(
        true,
        "get subscribed channel list successfully",
        200,
        listOfSubscribedChannel
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
