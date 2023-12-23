import { IconHome } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";

export default function Overview() {
  return (
    <MainLayout>
      <PageLayout title="Overview" icon={<IconHome />}>
        <div>Overview</div>
      </PageLayout>
    </MainLayout>
  );
}

Overview.auth = true;
