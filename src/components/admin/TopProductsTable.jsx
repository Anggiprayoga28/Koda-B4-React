import React from 'react';
import { Package } from 'lucide-react';

const TopProductsTable = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Top Products</h2>
      
      {products && products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sold</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{product.sold} pcs</td>
                  <td className="py-3 px-4 text-sm font-semibold text-#7A5538">
                    IDR {product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No product data available</p>
          <p className="text-sm text-gray-400 mt-2">Create some orders to see top products</p>
        </div>
      )}
    </div>
  );
};

export default TopProductsTable;