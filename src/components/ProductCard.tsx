import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onViewDetails: (product: Product) => void
}

function ProductCard({
  product,
  onEdit,
  onDelete,
  onViewDetails,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">

      {/* Product Image */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="p-5">

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            {product.category}
          </span>

          {product.quantity < 5 && (
            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-800">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          ⭐ {product.rating.toFixed(1)} / 5
        </p>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-blue-600">
            ₱{product.price.toLocaleString('en-PH')}
          </p>

          <p className="text-sm text-gray-500">
            Qty: {product.quantity}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-5">

          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition"
          >
            View Details
          </button>

          <button
            onClick={() => onEdit(product)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Edit
          </button>

        </div>

        <button
          onClick={() => onDelete(product.id)}
          className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition"
        >
          Delete Product
        </button>

      </div>
    </div>
  )
}

export default ProductCard