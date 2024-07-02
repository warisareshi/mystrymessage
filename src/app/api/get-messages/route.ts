import connectDB from "@lib/db";
import { getServerSession } from "next-auth";
import UserModel from "@models";
import { User } from "next-auth";
import authOptions from "@app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  // if a user is not logged in, return an error
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  // get the user id
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: foundUser[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Error, Failed to fetch the user messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal Error, Failed to fetch the user messages",
      },
      { status: 500 }
    );
  }
}
