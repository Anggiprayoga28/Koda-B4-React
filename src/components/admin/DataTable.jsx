import React from 'react';

/**
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column configuration array
 * @param {Array} props.data - Data array to display
 * @param {Function} [props.onRowClick] - Handler when row is clicked
 * @param {string} [props.emptyMessage='No data found'] - Message when data is empty
 */
const DataTable = ({ columns, data, onRowClick, emptyMessage = "No data found" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                className="text-left py-4 px-6 text-sm font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-4 px-6 text-sm text-gray-800">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;