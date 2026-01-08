import { ApiError } from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req) {
  await dbconnect();

  try {
    const { fullName, email } = await req.json();

    if (!fullName || !email) {
      throw new ApiError("Email and fullname are missing", 401);
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("user was not authorize", 404);
    }
    const userId = session._id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          email,
          fullName,
        },
      },
      { new: true }
    );

    if (!user) {
      throw new ApiError("user not found", 404);
    }

    return NextResponse.json(
      new ApiResponse(true, "Account details update successfully", 200),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Account detail failed",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
