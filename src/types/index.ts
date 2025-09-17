import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.url().optional(),
});

export type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  userId: string;
  createdAt: Date;
};
