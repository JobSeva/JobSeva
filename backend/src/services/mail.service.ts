import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || env.emailUser,
    pass: process.env.EMAIL_PASS || env.emailPass,
  },
});

// Verify connection configuration
transporter.verify(function (error, _success) {
  if (error) {
    console.error("Transporter connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const getVerificationEmailHtml = (
  name: string,
  verificationUrl: string,
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email – JobSeva</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Header card with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#f97316 100%);border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">JobSeva</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.8);font-weight:500;">India's Trusted Job Platform</p>
            </td>
          </tr>

          <!-- Main content card -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;border-radius:0;">

              <!-- Verify icon -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;background:linear-gradient(135deg,#ede9fe,#fed7aa);border-radius:50%;width:80px;height:80px;line-height:80px;text-align:center;">
                  <span style="font-size:38px;">✉️</span>
                </div>
              </div>

              <!-- Heading -->
              <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;text-align:center;">Verify Your Email Address</h2>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;text-align:center;line-height:1.6;">
                Almost there, <strong style="color:#0f172a;">${name}</strong>! Confirm your email to activate your JobSeva account and start your journey.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />

              <!-- Instruction -->
              <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
                Click the button below to verify your email address. This link is valid for <strong>24 hours</strong>.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:0 0 24px;">
                <a href="${verificationUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#f97316);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:12px;letter-spacing:0.3px;box-shadow:0 4px 15px rgba(124,58,237,0.35);">
                  ✓ &nbsp; Verify Email Address
                </a>
              </div>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#7c3aed;text-align:center;word-break:break-all;line-height:1.5;">
                <a href="${verificationUrl}" style="color:#7c3aed;text-decoration:none;">${verificationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#0f172a;">What happens next?</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#475569;">
                    <span style="color:#7c3aed;font-weight:700;margin-right:8px;">1.</span>Click the verification button above
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#475569;">
                    <span style="color:#7c3aed;font-weight:700;margin-right:8px;">2.</span>You'll be redirected to the login page
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#475569;">
                    <span style="color:#7c3aed;font-weight:700;margin-right:8px;">3.</span>Sign in and start exploring opportunities
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#ffffff;padding:24px 40px 32px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-align:center;">
                🔒 This is a secure, automated email from <strong style="color:#64748b;">JobSeva</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                If you didn't create an account, you can safely ignore this email — no action is required.
              </p>
            </td>
          </tr>

          <!-- Bottom spacing -->
          <tr><td style="height:32px;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getPasswordResetEmailHtml = (name: string, resetUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password - JobSeva</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .card { border-radius: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table class="container" width="500" cellpadding="0" cellspacing="0" style="width:500px;margin:0 auto;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <!-- Replace with actual hosted logo URL -->
              <img src="https://jobseva.com/JobSeva.png" alt="JobSeva Logo" width="160" style="display:block;outline:none;border:none;text-decoration:none;">
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td class="card" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);">
              
              <!-- Gradient Header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg, #7c3aed 0%, #f97316 100%);padding:40px 40px 30px;text-align:center;">
                    <div style="background:rgba(255,255,255,0.2);width:64px;height:64px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
                      <span style="font-size:32px;">🔑</span>
                    </div>
                    <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Reset Your Password</h1>
                  </td>
                </tr>
              </table>

              <!-- Body Content -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px;text-align:center;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#334155;font-weight:500;">
                      Hi ${name},
                    </p>
                    <p style="margin:0 0 32px;font-size:16px;line-height:24px;color:#64748b;">
                      We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg, #7c3aed 0%, #f97316 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:18px 36px;border-radius:14px;box-shadow:0 4px 6px -1px rgba(124, 58, 237, 0.2), 0 2px 4px -1px rgba(124, 58, 237, 0.1);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:32px 0 0;font-size:14px;color:#94a3b8;font-weight:500;">
                      This link expires in <span style="color:#f97316;">60 minutes</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer Background -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:18px;">
                      If you're having trouble clicking the button, copy and paste the link below into your web browser:
                    </p>
                    <p style="margin:12px 0 0;font-size:12px;color:#7c3aed;word-break:break-all;">
                      <a href="${resetUrl}" style="color:#7c3aed;text-decoration:none;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Final Footer -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                © 2026 JobSeva India
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">
                Securing your career journey.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;;

const getBackendBaseUrl = (): string => {
  return (
    process.env.BACKEND_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000"
  );
};

export const mailService = {
  async sendVerificationEmail(email: string, token: string, name: string) {
    const frontendUrl =
      process.env.FRONTEND_URL || env.frontendUrl || "http://localhost:8080";
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    // Log the link as a backup in case email fails
    console.log("-----------------------------------------");
    console.log(`VERIFICATION LINK for ${email}:`);
    console.log(verificationUrl);
    console.log("-----------------------------------------");

    const mailOptions = {
      from: `"JobSeva" <${process.env.EMAIL_USER || env.emailUser}>`,
      to: email,
      subject: "✉️ Verify your JobSeva account",
      html: getVerificationEmailHtml(name, verificationUrl),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email: string, token: string, name: string) {
    const backendBaseUrl = getBackendBaseUrl().replace(/\/$/, "");
    const resetUrl = `${backendBaseUrl}/api/auth/reset-password?token=${token}`;

    console.log("-----------------------------------------");
    console.log(`PASSWORD RESET LINK for ${email}:`);
    console.log(resetUrl);
    console.log("-----------------------------------------");

    const mailOptions = {
      from: `"JobSeva" <${process.env.EMAIL_USER || env.emailUser}>`,
      to: email,
      subject: "Reset your JobSeva password",
      html: getPasswordResetEmailHtml(name, resetUrl),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  },
};
