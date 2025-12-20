import { dbconnect } from "@/lib/dbconnect";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/models/users.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  await dbconnect();

  try {
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !oldPassword) {
      throw ApiError("error in password request", 401);
    }

    const userId = session?._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw ApiError("User was not authorize", 500);
    }
    const isPasswordValid = bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw ApiError("password was incorrect", 401);
    }

    const encryptPassword = bcrypt.hash(newPassword, 10);
    user.password = encryptPassword;
    const changePassword = await user.save({ validateBeforeSave: false });

    if (changePassword) {
      return NextResponse.json(
        new ApiResponse(true, "change password successfully", 201),
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on change password",
        staus: error?.status,
      },

      { status: error?.status || 400 }
    );
  }
}
