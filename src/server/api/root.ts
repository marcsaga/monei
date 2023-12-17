import { createTRPCRouter } from "~/server/api/trpc";
import { expenseRouter } from "./routers/expense";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
