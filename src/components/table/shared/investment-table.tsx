/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Investment } from "~/utils/interfaces";
import { Table } from "../table";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  type CategoryInputUpdateData,
  getCategoryInputCell,
  useProcessUpdateCategory,
} from "../category-input";
import { getInputEditableCell } from "../input";
import {
  useCreateInvestment,
  useDeleteInvestments,
  useListInvestments,
  useUpdateInvestment,
} from "~/hooks/api/investments";
import { useIsMobile } from "~/hooks/use-is-mobile";

const columnHelper = createColumnHelper<Investment>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<Investment, any>[] = [
  columnHelper.accessor("category", {
    header: () => <span>Category</span>,
    cell: (input) => getCategoryInputCell<Investment>(input, "investment"),
  }),
  columnHelper.accessor("contribution", {
    cell: (input) => getInputEditableCell<Investment>(input, "number"),
    header: () => <span>Contribution</span>,
  }),
  columnHelper.accessor("marketValue", {
    cell: (input) => getInputEditableCell<Investment>(input, "number"),
    header: () => <span>Market value</span>,
  }),
  columnHelper.accessor("previousMarketValue", {
    cell: (input) => (
      <div className="flex h-full w-full items-center bg-gray-100">
        {input.getValue()}
      </div>
    ),
    header: () => <span>Previous M.V.</span>,
  }),
];

interface InvestmentTableProps {
  filters: {
    start: string | null;
    end: string | null;
  };
}

export function InvestmentTable({ filters }: InvestmentTableProps) {
  const isMobile = useIsMobile();
  const listInvestments = useListInvestments(filters);
  const createInvestment = useCreateInvestment(filters);
  const updateInvestment = useUpdateInvestment(filters);
  const deleteInvestments = useDeleteInvestments(filters);
  const { processUpdateCategory } = useProcessUpdateCategory("investment");

  async function handleAddRow(
    columnId: keyof Omit<Investment, "id">,
    value: unknown,
  ) {
    let createValue = value;
    if (columnId === "category") {
      createValue = await processUpdateCategory(
        value as CategoryInputUpdateData,
      );
    }
    createInvestment.mutate({
      [columnId === "category" ? "categoryId" : columnId]: createValue,
      date: filters.start,
    });
  }

  async function handleUpdateRow(
    rowIndex: number,
    columnId: keyof Omit<Investment, "id">,
    value: unknown,
  ) {
    const investment = listInvestments.data?.[rowIndex];
    if (!investment) return;

    let updateValue = value;
    if (columnId === "category") {
      updateValue = await processUpdateCategory(
        value as CategoryInputUpdateData,
      );
    }

    let marketValueUpdate: { marketValue?: number } = {};
    if (columnId === "contribution" && !investment.marketValue) {
      marketValueUpdate = {
        marketValue: (value as number) + (investment.previousMarketValue ?? 0),
      };
    }

    if (investment[columnId] === updateValue) {
      return;
    }
    updateInvestment.mutate({
      id: investment.id,
      [columnId === "category" ? "categoryId" : columnId]: updateValue,
      ...marketValueUpdate,
    });
  }

  function handleDeleteRows(rowIds: string[]) {
    deleteInvestments.mutate({ ids: rowIds });
  }

  return (
    <Table
      id={`expenses-${filters.start}`}
      colSizes={
        isMobile ? ["w-[120px]", "w-[120px]", "w-[120px]", "w-[120px]"] : []
      }
      columns={columns}
      data={listInvestments.data ?? []}
      onAddRow={handleAddRow}
      onUpdateData={handleUpdateRow}
      onDeleteRows={handleDeleteRows}
    />
  );
}
