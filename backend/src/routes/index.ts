import { Router } from "express";

import { success } from "../common/http";
import { applicationsRouter } from "./applications.routes";
import { authRouter } from "./auth.routes";
import adminRouter from "./admin.routes";
import { companyJobsRouter } from "./company-jobs.routes";
import { companyRouter } from "./company.routes";
import { jobsRouter } from "./jobs.routes";
import { savedJobsRouter } from "./saved-jobs.routes";
import { seekerProfileRouter } from "./seeker-profile.routes";
import { messagesRouter } from "./messages.routes";
import { notificationsRouter } from "./notifications.routes";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json(success({ status: "ok" }));
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/applications", applicationsRouter);
apiRouter.use("/saved-jobs", savedJobsRouter);
apiRouter.use("/seeker/profile", seekerProfileRouter);
apiRouter.use("/company", companyRouter);
apiRouter.use("/company", companyJobsRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/notifications", notificationsRouter);

export { apiRouter };
