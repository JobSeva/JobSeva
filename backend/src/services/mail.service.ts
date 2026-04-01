import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || env.emailUser,
        pass: process.env.EMAIL_PASS || env.emailPass,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("Transporter connection error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export const mailService = {
    async sendVerificationEmail(email: string, token: string, name: string) {
        const verificationUrl = `${process.env.FRONTEND_URL || env.frontendUrl}/verify-email?token=${token}`;

        // Log the link as a backup
        console.log("-----------------------------------------");
        console.log(`VERIFICATION LINK for ${email}:`);
        console.log(verificationUrl);
        console.log("-----------------------------------------");

        const mailOptions = {
            from: `"JobSeva" <${process.env.EMAIL_USER || env.emailUser}>`,
            to: email,
            subject: "Verify your JobSeva account",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome to JobSeva!</h2>
          <p style="color: #475569; line-height: 1.5;">Hi ${name},</p>
          <p style="color: #475569; line-height: 1.5;">Thank you for registering with JobSeva. Please verify your email address to activate your account and start your journey.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${verificationUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #f97316; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">If you did not create an account, no further action is required.</p>
        </div>
      `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error("Error sending verification email:", error);
            throw error;
        }
    },
};
