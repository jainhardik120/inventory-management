import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env["NEXT_PUBLIC_BASE_URL"],
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env["NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL"],
  },
  skipValidation:
    process.env["SKIP_ENV_VALIDATION"] !== undefined &&
    process.env["SKIP_ENV_VALIDATION"] === "true",
  emptyStringAsUndefined: true,
});
