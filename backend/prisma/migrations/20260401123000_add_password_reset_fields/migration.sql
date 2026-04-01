-- Add forgot-password fields to user records
ALTER TABLE "User"
ADD COLUMN "passwordResetToken" TEXT,
ADD COLUMN "passwordResetExpiresAt" TIMESTAMP(3);

CREATE INDEX "User_passwordResetToken_idx" ON "User"("passwordResetToken");
