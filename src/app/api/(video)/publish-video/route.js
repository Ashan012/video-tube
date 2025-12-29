import { dbconnect } from "@/lib/dbconnect";
import { ApiError } from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import videoModel from "@/models/vidoes.model";
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";

export async function POST(req) {
  await dbconnect();

  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const { videoFile, thumbnail, title, description } = data;

    if (!videoFile || !thumbnail || !title || !description) {
      throw new ApiError("all feilds are required", 401);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("user was not authorize", 404);
    }
    const userId = session._id;

    const videoUpload = await cloudinaryUpload(videoFile, "video", "userVideo");
    const thumbnailUpload = await cloudinaryUpload(thumbnail);

    if (!videoUpload || !thumbnailUpload) {
      throw new ApiError("error on cloudinary upload", 500);
    }

    const createVideo = await videoModel.create({
      title,
      description,
      videoFile: videoUpload.secure_url,
      thumbnail: thumbnailUpload.secure_url,
      duration: videoUpload.duration || 0,
      owner: userId,
    });
    if (!createVideo) {
      throw new ApiError("video upload failed", 500);
    }
    return NextResponse.json(
      {
        success: true,
        message: "upload video successfully",
        status: 200,
        data: createVideo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on publish video",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
