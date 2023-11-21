import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";

export default function Expenses() {
  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <div>Expenses</div>
      </PageLayout>
    </MainLayout>
  );
}
