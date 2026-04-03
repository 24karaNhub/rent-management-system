export function Table({ columns, data, keyExtractor, emptyMessage = "No data available." }) {
  return (
    <div className="w-full overflow-x-auto text-sm animate-fade-in">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/60">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-4 px-6 font-semibold text-slate-500 uppercase tracking-wider text-xs whitespace-nowrap bg-slate-50/50 first:rounded-tl-lg last:rounded-tr-lg ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span className="text-sm">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor ? keyExtractor(row) : rowIndex}
                className="hover:bg-indigo-50/30 transition-colors duration-200 group"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`py-4 px-6 ${col.className || ""}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
