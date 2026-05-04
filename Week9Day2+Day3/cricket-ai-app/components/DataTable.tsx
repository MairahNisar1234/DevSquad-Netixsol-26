// components/chat/DataTable.tsx
export const DataTable = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]).filter(k => k !== 'player_id' && k !== 'image_url');

  return (
    <div className="my-2 w-full overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr>
              {headers.map(header => (
                <th key={header} className="px-4 py-3 whitespace-nowrap">
                  {header.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {headers.map(header => (
                  <td key={header} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};