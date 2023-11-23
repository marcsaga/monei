import dynamic from "next/dynamic";
import { useRef } from "react";
import { useRect } from "~/hooks/use-rect";

export const Table = () => {
  const ActiveTable = dynamic(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    () => import("active-table-react").then((mod) => mod.ActiveTable),
    {
      ssr: false,
    },
  );

  const content = [
    ["Description", "Cost (€)", "Category"],
    ["Dos palillos", 80, "Food"],
    ["T-Jove", 40, "Transport"],
  ];

  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={ref}>
      <ActiveTable
        style={{ width: "100%" }}
        tableStyle={{ border: "none", width: `${rect.width}px` }}
        columnDropdown={{ displaySettings: { isAvailable: false } }}
        customColumnsSettings={[
          { headerName: "Description", defaultColumnTypeName: "text" },
          { headerName: "Cost (€)", defaultColumnTypeName: "number" },
          { headerName: "Category", defaultColumnTypeName: "expenseCategory" },
        ]}
        customColumnTypes={[
          {
            name: "expenseCategory",
            label: {
              options: [
                { text: "Food" },
                { text: "Transport" },
                { text: "Rent" },
              ],
            },
          },
        ]}
        rowDropdown={{
          isInsertUpAvailable: false,
          isInsertDownAvailable: false,
          isMoveAvailable: false,
          canEditHeaderRow: false,
          displaySettings: {
            isAvailable: true,
            openMethod: { cellClick: true },
          },
        }}
        displayHeaderIcons={false}
        displayAddNewColumn={false}
        isHeaderTextEditable={false}
        content={content as unknown as string}
        isColumnResizable={false}
      />
    </div>
  );
};
