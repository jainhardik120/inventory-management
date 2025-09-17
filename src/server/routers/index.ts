import { createCallerFactory, createTRPCRouter } from "@/server/trpc";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
import { categoryRouter } from "./category";

export const appRouter = createTRPCRouter({
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);
