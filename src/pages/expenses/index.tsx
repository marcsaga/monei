import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { ExpenseTable } from "../../components/expense/expense-table";

export default function Expenses() {
  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <ExpenseTable />
      </PageLayout>
    </MainLayout>
  );
}
