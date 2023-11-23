import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { Table } from "~/components/table";

export default function Expenses() {
  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <Table />
      </PageLayout>
    </MainLayout>
  );
}
