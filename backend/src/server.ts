import { app } from "./app";
import { env } from "./config/env";

if (process.env.NODE_ENV !== "production") {
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`JobSeva backend listening on port ${env.port}`);
  });
}

// Export the Express API for Vercel
export default app;
