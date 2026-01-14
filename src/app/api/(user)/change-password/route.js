import { dbconnect } from "@/lib/dbconnect";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/models/users.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req) {
  await dbconnect();

  try {
    const { oldPassword, newPassword } = await req.json();
    console.log(oldPassword, newPassword);
    if (!oldPassword || !newPassword) {
      throw new ApiError("password is required", 401);
    }

    const session = await getServerSession(authOptions);
    console.log(session?._id);
    if (!session) {
      throw new ApiError("User was not authorize");
    }
    const user = await UserModel.findById(session?._id);

    console.log(user.username);
    if (user.username == "guest") {
      throw new ApiError("guest user can't change password", 401);
    }
    console.log("userpassword===>", user);
    if (!user) {
      throw new ApiError("User was not authorize", 404);
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError("password was incorrect", 401);
    }

    const encryptPassword = await bcrypt.hash(newPassword, 10);
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
