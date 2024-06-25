import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@lib/db";
import UserModel from "@models";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          // check if the user exists
          const user = await UserModel.findOne({
            $or: [
              {
                email: credentials.email,
              },
              {
                username: credentials.email,
              },
            ],
          });

          // if the user doesn't exist, throw an error
          if (!user) {
            throw new Error("No user Found with this Email");
          }

          // if the user exists, but is not verified, throw an error
          if (!user.isVerified) {
            throw new Error("Verify your Email before Logging In");
          }

          // Now we can check if the password is correct
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // if the password is correct, then finally return the user
          if (passwordMatch) return user;
          else throw new Error("Incorrect Password");
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

export default authOptions;