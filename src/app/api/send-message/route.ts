import connectDB from "@lib/db";
import UserModel from "@models";
import { Message } from "@models";

export async function POST(request: Request) {
  await connectDB();

  const { username, content } = await request.json();

  try {
    // check if the user exists
    const user = await UserModel.findOne({ username });

    // return an error if the user is not found
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // return an error if the user is not accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Error, Failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Internal Error, Failed to send message",
      },
      { status: 500 }
    );
  }
}
