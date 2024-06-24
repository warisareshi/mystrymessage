import { z } from "zod";

// SIGN-UP SCHEMA
const usernameSchema = z
  .string()
  .min(2, "Atleast 2 Characters")
  .max(20, "Maximum 20 Characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

const signUpSchema = z.object({
  username: usernameSchema,

  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// SIGN-IN SCHEMA
const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

// VERIFY SCHEMA
const verifySchema = z.object({
  verifyCode: z.string().length(6, "Verify code must be 6 digits long"),
});

// ACCEPT MESSAGE SCHEMA
const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

// MESSAGE SCHEMA
const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be be less than 10 characters")
    .max(300, "Content must not exceed 300 characters"),
});

export {signUpSchema, signInSchema, verifySchema, acceptMessageSchema, messageSchema};