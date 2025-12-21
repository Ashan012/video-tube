import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!isValidObjectId(videoId)) {
      throw new ApiError("is not valid id", 401);
    }

    const toggleStatus = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: !isPublished,
        },
      },
      { new: true }
    );
    if (!toggleStatus) {
      throw new ApiError("error on toggle status change", 500);
    }
    return NextResponse.json(
      new ApiResponse(
        true,
        "toggle publiction successfully",
        200,
        toggleStatus.isPublished
      ),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on delete video route",
        status: error?.status || 500,
      },
      {
        status: error?.status || 500,
      }
    );
  }
}
