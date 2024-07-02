import { getServerSession } from "next-auth";
import authOptions from "@app/api/auth/[...nextauth]/options";
import connectDB from "@lib/db";
import UserModel from "@models";
import { User } from "next-auth";

export async function POST(request: Request) {
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
  const userId = user._id;
  // get the sent data
  const { acceptMessages } = await request.json();

  // updating accept-messages status
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to Update the user status to accept messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Successfully updated the user status of accepting messages",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Internal Error, Failed to Update the user status to accept messages",
      error
    );
    return Response.json(
      {
        success: false,
        message:
          "Internal Error, Failed to Update the user status to accept messages",
      },
      { status: 500 }
    );
  }
}

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
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
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
        message: "Successfully fetched the user status of accepting messages",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Internal Error, Failed to fetch the user status of accepting messages",
      error
    );
    return Response.json(
      {
        success: false,
        message:
          "Internal Error, Failed to fetch the user status of accepting messages",
      },
      { status: 500 }
    );
  }
}
