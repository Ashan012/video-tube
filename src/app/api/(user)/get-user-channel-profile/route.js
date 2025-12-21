import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username");
    if (!username) {
      throw new ApiError("username is missing", 400);
    }

    const user = await UserModel.findOne({ username: username }).select(
      "-password"
    );
    console.log(user);

    if (!user) {
      throw new ApiError("user not found", 500);
    }

    return NextResponse.json(
      {
        success: true,
        message: "get channel profile successfully",
        data: user,
      },
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
