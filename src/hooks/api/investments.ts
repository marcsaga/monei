import { api } from "~/utils/api";

export interface InvestmentFilter {
  start: string;
  end: string;
}

export function useListInvestments({ start, end }: InvestmentFilter) {
  return api.investment.list.useQuery(
    { start: start, end: end },
    { staleTime: 60_000 },
  );
}

export function useUpdateInvestment({ start, end }: InvestmentFilter) {
  const context = api.useContext();
  return api.investment.update.useMutation({
    onSuccess: () => void context.investment.list.invalidate(),
  });
}

export function useCreateInvestment({ start, end }: InvestmentFilter) {
  const context = api.useContext();
  return api.investment.create.useMutation({
    onSuccess: () => void context.investment.list.invalidate(),
  });
}

export function useDeleteInvestments({ start, end }: InvestmentFilter) {
  const context = api.useContext();
  return api.investment.delete.useMutation({
    onMutate: ({ ids }) =>
      context.investment.list.setData(
        { start, end },
        (prev) => prev?.filter((investment) => !ids.includes(investment.id)),
      ),
  });
}
