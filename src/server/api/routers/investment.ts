import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type CategoryColor, type Investment } from "~/utils/interfaces";
import { dayFromDate } from "~/utils/formatters/date";
import { Prisma } from "@prisma/client";

type DateFilter = {
  gte?: Date;
  lte?: Date;
  lt?: Date;
  gt?: Date;
} | null;

interface DateInput {
  start?: string | null | undefined;
  end?: string | null | undefined;
}

function getListInvestmentsDateFilter(input: DateInput): DateFilter {
  if (input.start === null && input.end === null) {
    return null;
  } else {
    return {
      gte: input.start ? new Date(input.start) : undefined,
      lte: input.end ? new Date(input.end) : undefined,
    };
  }
}

interface InvestmentPreviousValue {
  id: string;
  market_value: number | null;
}

export const investmentRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ start: z.string().nullish(), end: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const investments = await ctx.db.investment.findMany({
        include: { category: true },
        where: {
          userId: ctx.session.user.id,
          date: getListInvestmentsDateFilter(input),
        },
        orderBy: { createdAt: "asc" },
      });

      const categoryIDs = new Set(
        investments
          .filter(({ categoryId }) => !!categoryId)
          .map(({ categoryId }) => categoryId),
      );

      let previousByCategory = new Map<string, number | null>();
      if (input.start && categoryIDs.size > 0) {
        const dtos = await ctx.db.$queryRaw<InvestmentPreviousValue[]>`
        SELECT "id", (SELECT market_value FROM "investment" 
                      WHERE "category_id" = "category"."id" and "date" < ${new Date(
                        input.start,
                      )} 
                      ORDER BY "date" DESC LIMIT 1) as market_value
        FROM "category"
        WHERE "user_id" = ${ctx.session.user.id} 
        AND "type" = 'INVESTMENT'
        AND "id" in (${Prisma.join([...categoryIDs.values()])})
        GROUP BY "id"
      `;
        previousByCategory = new Map(
          dtos.map(({ id, market_value }) => [id, market_value]),
        );
      }

      return investments.map((investment) =>
        fromDTO({
          ...investment,
          previousMarketValue: investment.categoryId
            ? previousByCategory.get(investment.categoryId)
            : null,
        }),
      );
    }),

  create: protectedProcedure
    .input(
      z.object({
        date: z
          .string()
          .refine((val) => /\d{4}(-\d{2}){2}/g.test(val))
          .nullable(),
        contribution: z.number().nullish(),
        categoryId: z.string().nullish(),
        marketValue: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const investment = await ctx.db.investment.create({
        include: { category: true },
        data: {
          userId: ctx.session.user.id,
          contribution: input.contribution,
          categoryId: input.categoryId,
          marketValue: input.marketValue,
          date: input.date ? new Date(input.date) : input.date,
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
        marketValue: z.number().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.investment.update({
        where: { id: input.id },
        data: {
          contribution: input.contribution,
          categoryId: input.categoryId,
          marketValue: input.marketValue,
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

  getLatestInvestmentByCategory: protectedProcedure
    .input(z.object({ start: z.string(), end: z.string() }))
    .query(async ({ ctx, input }) => {
      const dtos = await ctx.db.$queryRaw<GroupedInvestmentDTO[]>`
        SELECT "id","name","color", (SELECT market_value FROM "investment" 
                                    WHERE "category_id" = "category"."id" and ("date" <= ${new Date(
                                      input.end,
                                    )} OR date is null) 
                                    ORDER BY "date" DESC NULLS LAST LIMIT 1) as market_value
        FROM "category"
        WHERE "user_id" = ${ctx.session.user.id} 
        AND "type" = 'INVESTMENT'
        GROUP BY "id"
      `;

      return dtos
        .map(fromGroupedInvestmentDTO)
        .sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0));
    }),
});

interface InvestmentDTO {
  id: string;
  date: Date | null;
  contribution: number | null;
  marketValue: number | null;
  previousMarketValue: number | null | undefined;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

function fromDTO(dto: InvestmentDTO): Investment {
  return {
    id: dto.id,
    date: dto.date ? dayFromDate(dto.date) : undefined,
    contribution: dto.contribution ?? undefined,
    marketValue: dto.marketValue ?? undefined,
    previousMarketValue: dto.previousMarketValue ?? undefined,
    category: dto.category
      ? {
          id: dto.category.id,
          name: dto.category.name,
          color: dto.category.color as CategoryColor,
        }
      : undefined,
  };
}

interface GroupedInvestmentDTO {
  id: string;
  name: string;
  color: string;
  market_value: number | null;
}

function fromGroupedInvestmentDTO(dto: GroupedInvestmentDTO) {
  return {
    id: dto.id,
    name: dto.name,
    color: dto.color as CategoryColor,
    marketValue: dto.market_value ?? undefined,
  };
}
