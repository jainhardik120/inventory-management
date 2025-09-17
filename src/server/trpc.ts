import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { treeifyError, ZodError } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Starting point for tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError ? treeifyError(error.cause) : null,
    },
  }),
});

// Not necessary, just for helping to see the timing of the tRPC function
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now(); // Start Time
  const result = await next(); // Execute actual tRPC function
  const end = Date.now(); // End Time
  console.info(`TRPC ${path} took ${end - start}ms to execute`);
  return result;
});

// Pass request headers, and database connection to the tRPC context
// This is used in the server -> server.ts
// This is used in the client -> api/trpc/[trpc]/route.ts
export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    db: db,
    ...opts,
  };
};

// Create a tRPC caller factory, to be used in the server -> server.ts
export const { createCallerFactory } = t;

// Create a tRPC router, to be used when creating any tRPC router -> routers/index.ts
export const createTRPCRouter = t.router;

// Create a public procedure, which can be used by anyone
// Will be used in routers
export const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    return next({
      ctx,
    });
  });

// Create a protected procedure, which can only be used by authenticated users
// Will check if the user is authenticated, and if not, will throw an error
// Using better-auth
// Will be used in routers
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({ headers: ctx.headers });
    console.log(JSON.stringify(session))
    if (session === null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  });
