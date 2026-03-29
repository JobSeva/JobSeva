import { app } from "./app";
import { env } from "./config/env";

// Vercel serverless functions do not need to listen on a port
// locally, or if we are not on Vercel, we can start the server.
if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`JobSeva backend listening on port ${env.port}`);
  });
}

// Export the Express API for Vercel
export default app;
module.exports = app;
