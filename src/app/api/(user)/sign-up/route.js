import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  dbconnect();
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const { username, email, fullName, password, avatar, coverImage } = data;

    if (
      !username ||
      !email ||
      !fullName ||
      !password ||
      !avatar ||
      !coverImage
    ) {
      throw new ApiError("All feilds are reuired", 401);
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const avatarUpload = await cloudinaryUpload(avatar);
    const coverImageUpload = await cloudinaryUpload(coverImage);

    if (!avatarUpload) {
      throw new ApiError("avatar upload failed", 401);
    }

    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
      fullName,
      avatar: avatarUpload.secure_url,
      coverImage: coverImageUpload.secure_url || "",
    });

    if (user) {
      return NextResponse.json(
        new ApiResponse(true, "user create successfully", 201, user),
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
        message: error?.message,
        status: error?.status,
      },
      { status: error?.status || 400 }
    );
  }
}
