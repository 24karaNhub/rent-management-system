export function Table({ columns, data, keyExtractor, emptyMessage = "No data available." }) {
  return (
    <div className="w-full overflow-x-auto text-sm animate-fade-in">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-brand-ink/10">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-4 px-6 font-mono font-medium text-brand-chalk uppercase tracking-widest text-[10px] whitespace-nowrap bg-brand-plaster/30 first:rounded-tl-xl last:rounded-tr-xl ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-ink/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-brand-chalk">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-8 h-8 text-brand-chalk/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span className="text-xs font-mono tracking-tight">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor ? keyExtractor(row) : rowIndex}
                className="hover:bg-brand-plaster/40 transition-colors duration-150 group text-brand-ink"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`py-4 px-6 text-sm font-medium ${col.className || ""}`}>
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
