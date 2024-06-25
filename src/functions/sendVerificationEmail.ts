import resend from "@lib/email";
import VerificationEmail from "@resources/emails/VerificationEmail";
import ApiResponse from "@types/ApiResponse";

export default async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "team@ascendifyr.in",
      to: email,
      subject: "Mystry Message Verification",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to Send Verification Email" };
  }
}
