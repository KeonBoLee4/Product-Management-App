import { useEffect, useState } from 'react'
import type { Product } from '../data/products'

interface InventoryProps {
  products: Product[]
}

function Inventory({ products }: InventoryProps) {
  const [search, setSearch] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState(5)

  // Read the saved low-stock threshold
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('productHubSettings')

      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        const threshold = Number(settings.lowStockThreshold)

        if (Number.isInteger(threshold) && threshold >= 1) {
          setLowStockThreshold(threshold)
        }
      }
    } catch {
      console.error('Unable to load inventory settings.')
    }
  }, [])

  const totalQuantity = products.reduce(
    (total, product) => total + product.quantity,
    0
  )

  const totalValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  )

  const lowStockProducts = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity <= lowStockThreshold
  )

  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0
  )

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Management
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor product quantities and stock availability.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {products.length}
          </h2>
          <span className="text-2xl">📦</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Stock Units</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {totalQuantity}
          </h2>
          <span className="text-2xl">📋</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Low Stock Products</p>
          <h2 className="text-2xl font-bold text-orange-600 mt-2">
            {lowStockProducts.length}
          </h2>
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {outOfStockProducts.length}
          </h2>
          <span className="text-2xl">🚫</span>
        </div>

      </div>

      {/* Inventory Value */}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-sm">
        <p className="text-blue-100">
          Total Inventory Value
        </p>

        <h2 className="text-3xl font-bold mt-2">
          ₱{totalValue.toLocaleString('en-PH')}
        </h2>

        <p className="text-sm text-blue-100 mt-2">
          Based on product price multiplied by available quantity.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inventory..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Inventory List
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current stock information for all products.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Quantity
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Inventory Value
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No inventory products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />

                        <span className="font-semibold text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      ₱{product.price.toLocaleString('en-PH')}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {product.quantity}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      ₱{(
                        product.price * product.quantity
                      ).toLocaleString('en-PH')}
                    </td>

                    <td className="px-6 py-4">
                      {product.quantity === 0 ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                          Out of Stock
                        </span>
                      ) : product.quantity <= lowStockThreshold ? (
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default Inventory