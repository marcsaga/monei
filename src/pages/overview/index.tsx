import { IconHome } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { usePreLoadExpenses } from "../expenses";

export default function Overview() {
  usePreLoadExpenses();
  return (
    <MainLayout>
      <PageLayout title="Overview" icon={<IconHome />}>
        <div>Overview</div>
      </PageLayout>
    </MainLayout>
  );
}

Overview.auth = true;
