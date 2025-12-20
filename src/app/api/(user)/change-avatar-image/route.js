import { ApiError } from "@/utils/ApiError";
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";

export async function POST(req) {
  await dbconnect();

  try {
    const { avatarImage } = await req.formData();
    if (!avatarImage) {
      throw new ApiError("avatarImage is missing", 404);
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("User was not authorize", 404);
    }
    const userId = session?._id;

    const avatarUpload = await cloudinaryUpload(avatarImage);

    if (!avatarUpload) {
      throw new ApiError(avatarUpload || "avatar upload failed");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError("User not found ", 500);
    }
    user.avatar = avatarUpload;
    const changeAvatar = await user.save({ validateBeforeSave: false });

    if (!changeAvatar) {
      throw new ApiError("Avatar upload failed", 500);
    }
    return NextResponse.json(
      new ApiResponse(true, "Avatar chnage successfully", 200),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        status: error?.status,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
