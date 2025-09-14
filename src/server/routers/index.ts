import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/server/trpc";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
import z from "zod";

export const appRouter = createTRPCRouter({
  helloWorld: publicProcedure.input(z.string()).query(async ({ input }) => {
    await new Promise((f) => setTimeout(f, 5000));
    return `hello from api ${input}`;
  }),
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);
