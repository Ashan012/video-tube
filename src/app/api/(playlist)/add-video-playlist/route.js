import { dbconnect } from "@/lib/dbconnect";
import playlistModel from "@/models/playlist.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbconnect();
  try {
    const { playlistId, videoId } = await req.json();

    if (!isValidObjectId(playlistId)) {
      throw new ApiError("playlist id is not valid", 401);
    }

    if (!isValidObjectId(videoId)) {
      throw new ApiError("video id is not valid", 401);
    }

    const addVideoOnPlaylist = await playlistModel.findOne({ _id: playlistId });

    addVideoOnPlaylist.video.push(videoId);

    const response = await addVideoOnPlaylist.save({
      validateBeforeSave: false,
    });

    if (!response) {
      throw new ApiError("error on add video in db", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "add video successfully", 200, response),
      { status: 200 }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on add video on playlist route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
