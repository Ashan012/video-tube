import { dbconnect } from "@/lib/dbconnect";
import commentModel from "@/models/comments.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const { commentId } = searchParams.get("commentId");

    if (!isValidObjectId(commentId)) {
      throw new ApiError("comment id is invalid", 401);
    }
    const deletComment = await commentModel.findByIdAndDelete(commentId);

    if (!deletComment) {
      throw new ApiError("error on db during comment delete ", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "delete comment successfully", 200),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on delete comment route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
