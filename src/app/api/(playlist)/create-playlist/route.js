import { dbconnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import playlistModel from "@/models/playlist.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req) {
  await dbconnect();
  try {
    const { name, description } = await req.json();

    if (!name || !description) {
      throw new ApiError("both feild are required", 401);
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("un authorize user", 404);
    }

    const createPlaylist = await playlistModel.create({
      name,
      description,
      owner: session._id,
    });

    if (!createPlaylist) {
      throw new ApiError("error on createplaylist", 501);
    }
    return NextResponse.json(
      new ApiResponse(
        true,
        "create playlist successfully",
        200,
        createPlaylist
      ),
      {
        status: error?.status || 400,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on create playlist route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
