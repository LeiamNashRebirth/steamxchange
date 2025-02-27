import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Verify } from "@/env/secrets";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Verify.email,
    pass: Verify.password,
  },
});

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const mailOptions = {
      from: `stemXchange <your-stemxchange-email@gmail.com>`,
      to: email,
      subject: "Your stemXchange Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; 
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">

            <img src="https://raw.githubusercontent.com/LeiamNashRebirth/LeiamNashRebirth/refs/heads/main/logo.png" 
              alt="STEMXchange Logo" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 10px;" />

            <h2 style="color: #4F46E5; margin: 20px 0 10px;">Your Verification Code</h2>
            <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
              Use the code below to verify your account. This code will expire in <b>5 minutes</b>.
            </p>

            <p id="otpCode" style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 5px; 
              text-decoration: underline; margin-bottom: 20px;">
              ${otp}
            </p>
            <p style="color: #777; font-size: 12px; margin-top: 20px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
