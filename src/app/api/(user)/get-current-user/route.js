import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("user was not authorize", 400);
    }
    return NextResponse.json(
      new ApiResponse(true, "user fetch successfully", 200, session),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiResponse(false, "user not authorize", 404),
      {
        status: 400,
      }
    );
  }
}
