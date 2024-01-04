interface ListData {
  id: string;
}

interface ListProps<T extends ListData> {
  title: string;
  data: T[];
}

export function List<T extends ListData>({ title, data }: ListProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-md text-main-dark font-semibold uppercase">
        {title}
      </h4>
      <table className="card">
        <colgroup>
          <col className="w-3/5" />
        </colgroup>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              {Object.entries(item)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <td
                    className="h-14 first:pl-6 last:pr-6"
                    key={item.id + "_" + key}
                  >
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
