import { useEffect, useState } from 'react'
import type { Product } from '../data/products'

interface DashboardProps {
  products: Product[]
  categories: string[]
}

function Dashboard({ products, categories }: DashboardProps) {
  const [lowStockThreshold, setLowStockThreshold] = useState(5)

  // Load the saved low-stock threshold
  useEffect(() => {
    const loadSettings = () => {
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
        console.error('Unable to load dashboard settings.')
      }
    }

    loadSettings()

    // Update when the browser storage changes
    window.addEventListener('storage', loadSettings)

    return () => {
      window.removeEventListener('storage', loadSettings)
    }
  }, [])

  // Dashboard Calculations
  const totalProducts = products.length

  const totalInventoryValue = products.reduce(
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

  const inStockProducts = products.filter(
    (product) => product.quantity > lowStockThreshold
  )

  const totalCategories = categories.length

  const totalStock = products.length || 1

  // Get five recently added products
  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString('en-PH')}`

  // Dashboard Summary Cards
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: '📦',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(totalInventoryValue),
      icon: '💰',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Low Stock',
      value: lowStockProducts.length.toString(),
      icon: '⚠️',
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Categories',
      value: totalCategories.toString(),
      icon: '🏷️',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="space-y-8">

      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's your product inventory overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">
                {stat.title}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-3">
                {stat.value}
              </h2>
            </div>

            <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        ))}

      </div>

      {/* Inventory Overview and Low Stock Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Inventory Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Inventory Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current product stock distribution.
          </p>

          <div className="space-y-6 mt-8">

            {/* In Stock */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  In Stock
                </span>

                <span className="text-sm font-bold text-green-600">
                  {inStockProducts.length} products
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${(inStockProducts.length / totalStock) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Stock */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Low Stock
                </span>

                <span className="text-sm font-bold text-orange-600">
                  {lowStockProducts.length} products
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${(lowStockProducts.length / totalStock) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Out of Stock */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Out of Stock
                </span>

                <span className="text-sm font-bold text-red-600">
                  {outOfStockProducts.length} products
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${(outOfStockProducts.length / totalStock) * 100}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Low Stock Alerts
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Products that need restocking.
          </p>

          {lowStockProducts.length === 0 &&
          outOfStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">✅</span>

              <p className="text-gray-500">
                All products have sufficient stock.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">

              {outOfStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {product.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                    Out of Stock
                  </span>
                </div>
              ))}

              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {product.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                    {product.quantity} left
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Products
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your latest products.
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No products available.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
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

                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {product.quantity}
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

export default Dashboard