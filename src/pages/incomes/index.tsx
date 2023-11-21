import { IconDollarsign } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";

export default function Incomes() {
  return (
    <MainLayout>
      <PageLayout title="Incomes" icon={<IconDollarsign />}>
        <div>Incomes</div>
      </PageLayout>
    </MainLayout>
  );
}
