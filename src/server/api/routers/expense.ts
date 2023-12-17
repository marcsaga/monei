import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const expenseRouter = createTRPCRouter({
  list: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const expenses = await ctx.db.expense.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return expenses.map(fromDTO);
  }),

  create: protectedProcedure
    .input(
      z.object({
        amount: z.number().nullish(),
        description: z.string().nullish(),
        date: z.date().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const expense = await ctx.db.expense.create({
        data: {
          userId: ctx.session.user.id,
          amount: input.amount,
          description: input.description,
          date: input.date,
        },
      });

      return fromDTO(expense);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().nullish(),
        description: z.string().nullish(),
        date: z.date().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const expense = await ctx.db.expense.update({
        where: { id: input.id },
        data: {
          amount: input.amount,
          description: input.description,
          date: input.date,
        },
      });

      return fromDTO(expense);
    }),
});

interface ExpenseDTO {
  id: string;
  userId: string;
  amount: number | null;
  description: string | null;
  date: Date | null;
}

function fromDTO(dto: ExpenseDTO) {
  return {
    id: dto.id,
    amount: dto.amount ?? undefined,
    description: dto.description ?? undefined,
    date: dto.date ?? undefined,
  };
}
