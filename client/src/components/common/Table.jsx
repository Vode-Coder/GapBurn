export default function Table({ columns, rows, rowKey = 'id' }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-stone-500">
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-b border-stone-100 last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3 align-top">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
