import { connectDB } from "@lib/db";
import UserModel from "@models";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@functions/sendVerificationEmail";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, email, password } = await request.json();

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUnverifiedUser = await UserModel.findOne({ email });

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUnverifiedUser) {
      if (existingUnverifiedUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already taken",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashed = await bcrypt.hash(password, 20);
        existingUnverifiedUser.password = hashed;
        existingUnverifiedUser.verifyCode = verifyCode;
        existingUnverifiedUser.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUnverifiedUser.save();
      }
    } else {
      // Register a new user if there is no existing email or username

      const hashed = await bcrypt.hash(password, 20);
      const expiryDate = new Date(Date.now() + 3600000);

      const newUser = new UserModel({
        username,
        email,
        password: hashed,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Happens if no returns have been made

    const verification = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    if (!verification.success) {
      return Response.json(
        {
          success: false,
          message: verification.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Created new User, Please Check your Inbox for a verification email",
      },
      { status: 201 }
    );
  } catch (signUpError) {
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      { status: 500 }
    );
  }
}
