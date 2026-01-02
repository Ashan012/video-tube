import { dbconnect } from "@/lib/dbconnect";
import subscriptionModel from "@/models/subscriptions.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";

export async function GET() {
  await dbconnect();
  try {
    const session = await getServerSession(authOptions);
    const userId = session._id;
    const listOfSubscribedChannel = await subscriptionModel
      .find({
        channel: userId,
      })
      .select("-channel -updatedAt -createdAt")
      .populate({
        path: "subscriber",
        select: "fullName avatar ",
      })
      .lean();

    if (
      Array.isArray(listOfSubscribedChannel) &&
      listOfSubscribedChannel.length === 0
    ) {
      return NextResponse.json(
        new ApiResponse(
          true,
          "They have no subscribers ",
          200,
          listOfSubscribedChannel
        ),
        { status: 200 }
      );
    }
    if (!listOfSubscribedChannel) {
      throw new ApiError("Error on getting list of subscriber ", 500);
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
