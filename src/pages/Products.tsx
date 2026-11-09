import { useState } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'

import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'

interface ProductsProps {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
  categories: string[]
  cart: Record<number, number>
  setCart: Dispatch<SetStateAction<Record<number, number>>>
}

interface ProductFormData {
  name: string
  category: string
  description: string
  specification: string
  rating: string
  price: string
  quantity: string
  image: string
}

const emptyForm: ProductFormData = {
  name: '',
  category: '',
  description: '',
  specification: '',
  rating: '',
  price: '',
  quantity: '',
  image: '',
}

function Products({
  products,
  setProducts,
  categories,
  cart,
  setCart,
}: ProductsProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(emptyForm)

  // Add a product to the cart
  const handleAddToCart = (product: Product) => {
    const currentQuantity = cart[product.id] || 0

    if (currentQuantity >= product.quantity) {
      alert('You cannot add more than the available stock.')
      return
    }

    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }))
  }

  // Increase cart quantity
  const increaseCartQuantity = (product: Product) => {
    const currentQuantity = cart[product.id] || 0

    if (currentQuantity >= product.quantity) {
      alert('You have reached the available stock limit.')
      return
    }

    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }))
  }

  // Decrease cart quantity
  const decreaseCartQuantity = (productId: number) => {
    setCart((prev) => {
      const currentQuantity = prev[productId] || 0

      if (currentQuantity <= 1) {
        const updatedCart = { ...prev }
        delete updatedCart[productId]
        return updatedCart
      }

      return {
        ...prev,
        [productId]: currentQuantity - 1,
      }
    })
  }

  // Open form for adding a product
  const openAddForm = () => {
    setEditingProduct(null)
    setFormData({
      ...emptyForm,
      category: categories[0] || '',
    })
    setShowForm(true)
  }

  // Open form for editing a product
  const openEditForm = (product: Product) => {
    setEditingProduct(product)

    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      specification: product.specification,
      rating: String(product.rating),
      price: String(product.price),
      quantity: String(product.quantity),
      image: product.image,
    })

    setShowForm(true)
  }

  // Handle form changes
  const handleChange = (
    field: keyof ProductFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add or update a product
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const name = formData.name.trim()
    const description = formData.description.trim()
    const specification = formData.specification.trim()
    const image = formData.image.trim()
    const price = Number(formData.price)
    const quantity = Number(formData.quantity)
    const rating = Number(formData.rating)

    if (
      !name ||
      !formData.category ||
      !description ||
      !specification ||
      !image ||
      formData.price === '' ||
      formData.quantity === '' ||
      formData.rating === ''
    ) {
      alert('Please complete all product fields.')
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert('Please enter a valid price greater than zero.')
      return
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      alert('Quantity must be a whole number and cannot be negative.')
      return
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      alert('Rating must be between 1 and 5.')
      return
    }

    const productData = {
      name,
      category: formData.category,
      description,
      specification,
      rating,
      price,
      quantity,
      image,
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productData }
            : product
        )
      )

      // Keep cart quantity within available stock
      setCart((prev) => {
        const currentCartQuantity = prev[editingProduct.id] || 0

        if (currentCartQuantity > quantity) {
          const updatedCart = { ...prev }

          if (quantity === 0) {
            delete updatedCart[editingProduct.id]
          } else {
            updatedCart[editingProduct.id] = quantity
          }

          return updatedCart
        }

        return prev
      })

      alert('Product updated successfully!')
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...productData,
      }

      setProducts((prev) => [...prev, newProduct])

      alert('Product added successfully!')
    }

    setShowForm(false)
    setEditingProduct(null)
    setFormData(emptyForm)
  }

  // Delete a product
  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) return

    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    )

    setCart((prev) => {
      const updatedCart = { ...prev }
      delete updatedCart[id]
      return updatedCart
    })

    if (selectedProduct?.id === id) {
      setSelectedProduct(null)
    }
  }

  // Search and category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Calculate shopping cart items
  const cartItems = products.filter(
    (product) => (cart[product.id] || 0) > 0
  )

  // Calculate overall total using reduce
  const overallTotal = cartItems.reduce(
    (total, product) =>
      total + product.price * (cart[product.id] || 0),
    0
  )

  const totalCartQuantity = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  )

  // Dedicated Product Details View
  if (selectedProduct) {
    const currentProduct =
      products.find((product) => product.id === selectedProduct.id)

    if (!currentProduct) {
      setSelectedProduct(null)
      return null
    }

    return (
      <div className="space-y-6">

        <button
          onClick={() => setSelectedProduct(null)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium transition"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full h-80 object-cover rounded-xl"
            />

            <div className="space-y-5">

              <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {currentProduct.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-800">
                {currentProduct.name}
              </h1>

              <p className="text-yellow-500 font-semibold">
                ⭐ {currentProduct.rating.toFixed(1)} / 5
              </p>

              <p className="text-3xl font-bold text-blue-600">
                ₱{currentProduct.price.toLocaleString('en-PH')}
              </p>

              <div>
                <h2 className="font-bold text-gray-800 mb-2">
                  Product Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>

              <div>
                <h2 className="font-bold text-gray-800 mb-2">
                  Product Specifications
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {currentProduct.specification}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Available Quantity
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {currentProduct.quantity} units
                </p>

                {currentProduct.quantity < 5 && (
                  <span className="text-red-600 text-sm font-semibold">
                    Low Stock
                  </span>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Inventory Value (Price × Available Quantity)
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  ₱{(
                    currentProduct.price * currentProduct.quantity
                  ).toLocaleString('en-PH')}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(currentProduct)}
                disabled={
                  currentProduct.quantity === 0 ||
                  (cart[currentProduct.id] || 0) >= currentProduct.quantity
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >
                + Add to Cart
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your products and inventory.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          + Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Product List
          </h2>

          <span className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="space-y-3">

                <ProductCard
                  product={product}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  onViewDetails={setSelectedProduct}
                />

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={
                    product.quantity === 0 ||
                    (cart[product.id] || 0) >= product.quantity
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
                >
                  {product.quantity === 0
                    ? 'Out of Stock'
                    : (cart[product.id] || 0) >= product.quantity
                      ? 'Stock Limit Reached'
                      : '+ Add to Cart'}
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart */}
      <section className="bg-white rounded-xl shadow-sm p-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🛒 Shopping Cart
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review your selected products.
            </p>
          </div>

          <span className="text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
            {totalCartQuantity} items
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Your shopping cart is empty.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Add products to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {cartItems.map((product) => {
              const cartQuantity = cart[product.id] || 0
              const subtotal = product.price * cartQuantity

              return (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-100 pb-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ₱{product.price.toLocaleString('en-PH')} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseCartQuantity(product.id)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                    >
                      −
                    </button>

                    <span className="font-semibold w-6 text-center">
                      {cartQuantity}
                    </span>

                    <button
                      onClick={() => increaseCartQuantity(product)}
                      disabled={cartQuantity >= product.quantity}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>

                  <div className="sm:text-right sm:min-w-28">
                    <p className="text-xs text-gray-500">
                      Subtotal
                    </p>
                    <p className="font-bold text-blue-600">
                      ₱{subtotal.toLocaleString('en-PH')}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Overall Total */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Overall Total
                </p>
                <h3 className="text-3xl font-bold text-gray-800">
                  ₱{overallTotal.toLocaleString('en-PH')}
                </h3>
              </div>

              <button
                onClick={() => setCart({})}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-lg font-semibold transition"
              >
                Clear Cart
              </button>
            </div>

          </div>
        )}
      </section>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Feature Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {categories.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      Create a category before adding a product.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter product description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Specifications
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.specification}
                  onChange={(e) => handleChange('specification', e.target.value)}
                  placeholder="Enter product specifications"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', e.target.value)}
                    placeholder="4.5"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={categories.length === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Products