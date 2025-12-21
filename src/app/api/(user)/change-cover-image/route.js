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

    const { coverImage } = data;

    if (!coverImage) {
      throw new ApiError("coverImage is missing", 404);
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("User was not authorize", 404);
    }
    const userId = session?._id;

    const coverImageUpload = await cloudinaryUpload(coverImage);

    if (!coverImageUpload) {
      throw new ApiError("coverImage upload failed", 500);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError("User not found ", 500);
    }
    user.coverImage = coverImageUpload.secure_url;
    const changeCoverImage = await user.save({ validateBeforeSave: false });

    if (!changeCoverImage) {
      throw new ApiError("coverImage upload failed", 500);
    }
    return NextResponse.json(
      new ApiResponse(true, "coverImage chnage successfully", 200),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on coverimage upload",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
