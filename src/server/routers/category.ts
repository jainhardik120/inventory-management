import { createTRPCRouter, protectedProcedure } from "../trpc";
import { productCategory } from "@/db/schema";
import { createCategorySchema } from "@/types";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(productCategory).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
  getAllCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(productCategory)
      .where(eq(productCategory.userId, ctx.session.user.id));
  }),
  updateCategory: protectedProcedure
    .input(z.object({ id: z.string(), createCategorySchema }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(productCategory)
        .set(input.createCategorySchema)
        .where(
          and(
            eq(productCategory.id, input.id),
            eq(productCategory.userId, ctx.session.user.id)
          )
        );
    }),
  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(productCategory)
        .where(
          and(
            eq(productCategory.id, input.id),
            eq(productCategory.userId, ctx.session.user.id)
          )
        );
    }),
});
