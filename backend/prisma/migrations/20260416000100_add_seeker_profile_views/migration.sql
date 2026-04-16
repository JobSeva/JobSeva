CREATE TABLE "SeekerProfileView" (
  "id" TEXT NOT NULL,
  "seekerUserId" TEXT NOT NULL,
  "viewerUserId" TEXT NOT NULL,
  "viewerRole" TEXT NOT NULL,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SeekerProfileView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SeekerProfileView_seekerUserId_viewedAt_idx"
  ON "SeekerProfileView"("seekerUserId", "viewedAt");

CREATE INDEX "SeekerProfileView_viewerUserId_viewedAt_idx"
  ON "SeekerProfileView"("viewerUserId", "viewedAt");

ALTER TABLE "SeekerProfileView"
  ADD CONSTRAINT "SeekerProfileView_seekerUserId_fkey"
  FOREIGN KEY ("seekerUserId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SeekerProfileView"
  ADD CONSTRAINT "SeekerProfileView_viewerUserId_fkey"
  FOREIGN KEY ("viewerUserId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
