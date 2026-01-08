import { ApiError } from "@/utils/ApiError";
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req) {
  await dbconnect();

  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const { avatar } = data;

    if (!avatar) {
      throw new ApiError("avatar is missing", 404);
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("User was not authorize", 404);
    }
    const userId = session?._id;

    if (!userId) {
      throw new ApiError("user wasnot authorize", 404);
    }
    const avatarUpload = await cloudinaryUpload(avatar);

    if (!avatarUpload) {
      throw new ApiError(avatarUpload || "avatar upload failed");
    }

    const changeAvatar = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatarUpload.secure_url,
        },
      },
      { new: true }
    );
    if (!changeAvatar) {
      throw new ApiError("User not found ", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "Avatar chnage successfully", 200, changeAvatar),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "errpr on change avatar image",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
