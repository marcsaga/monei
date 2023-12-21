import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { colors, type CategoryColor } from "~/utils/interfaces";

export const categoryRouter = createTRPCRouter({
  createExpenseCategory: protectedProcedure
    .input(z.object({ name: z.string(), color: z.enum(colors) }))
    .mutation(async ({ input, ctx }) => {
      const expenseCategory = await ctx.db.category.create({
        data: {
          name: input.name,
          color: input.color,
          type: "EXPENSE",
          userId: ctx.session.user.id,
        },
      });
      return fromDTO(expenseCategory);
    }),

  listExpenseCategories: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const categories = await ctx.db.category.findMany({
        where: { userId: ctx.session.user.id, type: "EXPENSE" },
      });
      return categories.map(fromDTO);
    }),
});

interface CategoryDTO {
  id: string;
  name: string;
  color: string;
  type: string;
}

function fromDTO(category: CategoryDTO) {
  return {
    id: category.id,
    name: category.name,
    color: category.color as CategoryColor,
  };
}
