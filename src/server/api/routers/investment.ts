import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type CategoryColor, type Investment } from "~/utils/interfaces";
import { dayFromDate } from "~/utils/date-formatters";

export const investmentRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ start: z.string().nullish(), end: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const investments = await ctx.db.investment.findMany({
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

      const accumulated = await ctx.db.investment.groupBy({
        by: "categoryId",
        _sum: { contribution: true },
        where: {
          categoryId: {
            in: investments
              .filter(({ categoryId }) => categoryId !== null)
              .map(({ categoryId }) => categoryId) as string[],
          },
          userId: ctx.session.user.id,
          date: { lt: input.start ? new Date(input.start) : undefined },
        },
      });

      const accumulatedByCategory = new Map(
        accumulated.map(({ categoryId, _sum }) => [
          categoryId,
          _sum.contribution,
        ]),
      );

      return investments.map((investment) =>
        fromDTO({
          ...investment,
          accumulated:
            (accumulatedByCategory.get(investment.categoryId) ?? 0) +
            (investment.contribution ?? 0),
        }),
      );
    }),

  create: protectedProcedure
    .input(
      z.object({
        date: z.string().refine((val) => /\d{4}(-\d{2}){2}/g.test(val)),
        contribution: z.number().nullish(),
        categoryId: z.string().nullish(),
        totalValue: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const investment = await ctx.db.investment.create({
        include: { category: true },
        data: {
          userId: ctx.session.user.id,
          contribution: input.contribution,
          categoryId: input.categoryId,
          totalValue: input.totalValue,
          date: new Date(input.date),
        },
      });

      return { id: investment.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z
          .string()
          .refine((val) => /\d{4}(-\d{2}){2}/g.test(val))
          .nullish(),
        contribution: z.number().nullish(),
        categoryId: z.string().nullish(),
        totalValue: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.investment.update({
        where: { id: input.id },
        data: {
          contribution: input.contribution,
          categoryId: input.categoryId,
          totalValue: input.totalValue,
          date: input.date ? new Date(input.date) : undefined,
        },
      });

      return null;
    }),

  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.investment.deleteMany({ where: { id: { in: input.ids } } });
    }),
});

interface InvestmentDTO {
  id: string;
  date: Date;
  contribution: number | null;
  accumulated: number | null | undefined;
  totalValue: number | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

function fromDTO(dto: InvestmentDTO): Investment {
  return {
    id: dto.id,
    date: dayFromDate(dto.date),
    contribution: dto.contribution ?? undefined,
    accumulated: dto.accumulated ?? undefined,
    totalValue: dto.totalValue ?? undefined,
    category: dto.category
      ? {
          id: dto.category.id,
          name: dto.category.name,
          color: dto.category.color as CategoryColor,
        }
      : undefined,
  };
}
