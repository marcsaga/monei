import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { dayFromDate } from "~/utils/date-formatters";
import { type CategoryColor, type Expense } from "~/utils/interfaces";

export const expenseRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ start: z.string().nullish(), end: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const expenses = await ctx.db.expense.findMany({
        include: { category: true },
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: input.start ? new Date(input.start) : undefined,
            lte: input.end ? new Date(input.end) : undefined,
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return expenses.map(fromDTO);
    }),

  create: protectedProcedure
    .input(
      z.object({
        date: z.string().refine((val) => /\d{4}(-\d{2}){2}/g.test(val)),
        amount: z.number().nullish(),
        description: z.string().nullish(),
        categoryId: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const expense = await ctx.db.expense.create({
        include: { category: true },
        data: {
          userId: ctx.session.user.id,
          amount: input.amount,
          description: input.description,
          categoryId: input.categoryId,
          date: new Date(input.date),
        },
      });

      return fromDTO(expense);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().nullish(),
        categoryId: z.string().nullish(),
        description: z.string().nullish(),
        date: z
          .string()
          .refine((val) => /\d{4}(-\d{2}){2}/g.test(val))
          .nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const expense = await ctx.db.expense.update({
        include: { category: true },
        where: { id: input.id },
        data: {
          amount: input.amount,
          description: input.description,
          categoryId: input.categoryId,
          date: input.date ? new Date(input.date) : undefined,
        },
      });

      return fromDTO(expense);
    }),

  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.expense.deleteMany({ where: { id: { in: input.ids } } });
    }),

  expensesByCategory: protectedProcedure
    .input(z.object({ start: z.string(), end: z.string() }))
    .query(async ({ ctx, input }) => {
      const byCategory = await ctx.db.expense.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        where: {
          userId: ctx.session.user.id,
          date: { gte: new Date(input.start), lte: new Date(input.end) },
        },
      });
      const categories = await ctx.db.category.findMany({
        where: { userId: ctx.session.user.id, type: "EXPENSE" },
      });
      const byCategoryMap = new Map(
        byCategory.map(({ categoryId, _sum }) => [categoryId, _sum.amount]),
      );

      const sorted = categories
        .map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color as CategoryColor,
          amount: byCategoryMap.get(category.id) ?? 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      sorted.push({
        id: "no-category",
        name: "No category",
        color: "gray",
        amount: byCategoryMap.get(null) ?? 0,
      });

      return sorted;
    }),
});

interface ExpenseDTO {
  id: string;
  userId: string;
  amount: number | null;
  description: string | null;
  date: Date | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

function fromDTO(dto: ExpenseDTO): Expense {
  return {
    id: dto.id,
    amount: dto.amount ?? undefined,
    description: dto.description ?? undefined,
    date: dto.date ? dayFromDate(dto.date) : undefined,
    category: dto.category
      ? {
          id: dto.category.id,
          name: dto.category.name,
          color: dto.category.color as CategoryColor,
        }
      : undefined,
  };
}
