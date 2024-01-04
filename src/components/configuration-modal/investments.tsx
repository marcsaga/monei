import { InvestmentTable } from "../table/shared/investment-table";

export const InvestmentsSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-main-dark text-2xl font-semibold">
        Investments configuration
      </h2>
      <section>
        <h3 className="text-main-dark text-lg font-medium">
          Pre-monei.io investments
        </h3>
        <p className="text-main-dark mb-14 mt-2">
          Did you have investments before using Monei.io? This is the place to
          set them up! Set up your prior investments here, which won&apos;t be
          linked to any specific month but will be visible in the app.
        </p>
        <InvestmentTable filters={{ start: null, end: null }} />
      </section>
    </div>
  );
};
