import { useState } from 'react'
import type { Dispatch, SetStateAction, FormEvent } from 'react'
import type { Product } from '../data/products'

interface CategoriesProps {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
}

function Categories({
  products,
  setProducts,
  categories,
  setCategories,
}: CategoriesProps) {
  const [categoryName, setCategoryName] = useState('')

  const handleAddCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newCategory = categoryName.trim()

    if (!newCategory) {
      alert('Please enter a category name.')
      return
    }

    const alreadyExists = categories.some(
      (category) => category.toLowerCase() === newCategory.toLowerCase()
    )

    if (alreadyExists) {
      alert('This category already exists.')
      return
    }

    setCategories((previous) => [...previous, newCategory])
    setCategoryName('')
  }

  const handleEditCategory = (oldCategory: string) => {
    const newCategory = prompt(
      'Enter the new category name:',
      oldCategory
    )

    if (!newCategory || !newCategory.trim()) return

    const trimmedCategory = newCategory.trim()

    const alreadyExists = categories.some(
      (category) =>
        category.toLowerCase() === trimmedCategory.toLowerCase() &&
        category !== oldCategory
    )

    if (alreadyExists) {
      alert('This category already exists.')
      return
    }

    setCategories((previous) =>
      previous.map((category) =>
        category === oldCategory ? trimmedCategory : category
      )
    )

    setProducts((previous) =>
      previous.map((product) =>
        product.category === oldCategory
          ? { ...product, category: trimmedCategory }
          : product
      )
    )
  }

  const handleDeleteCategory = (categoryToDelete: string) => {
    const productsUsingCategory = products.filter(
      (product) => product.category === categoryToDelete
    )

    if (productsUsingCategory.length > 0) {
      alert(
        `Cannot delete "${categoryToDelete}" because ${productsUsingCategory.length} product(s) still use this category. Please reassign those products first.`
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryToDelete}"?`
    )

    if (!confirmed) return

    setCategories((previous) =>
      previous.filter((category) => category !== categoryToDelete)
    )
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Categories
        </h1>

        <p className="text-gray-500 mt-2">
          Organize and manage your product categories.
        </p>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Add Category
        </h2>

        <form
          onSubmit={handleAddCategory}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            + Add Category
          </button>
        </form>
      </div>

      {/* Category List */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            All Categories
          </h2>

          <span className="text-sm text-gray-500">
            {categories.length} categories
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <p className="text-gray-500">
              No categories available. Add your first category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {categories.map((category) => {
              const productCount = products.filter(
                (product) => product.category === category
              ).length

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                >

                  {/* Category Information */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      {category}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      {productCount}{' '}
                      {productCount === 1 ? 'product' : 'products'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">

                    <button
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-lg font-medium transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg font-medium transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              )
            })}

          </div>
        )}
      </div>

    </div>
  )
}

export default Categories