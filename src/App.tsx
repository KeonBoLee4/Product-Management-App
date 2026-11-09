import Settings from './pages/Settings'
import Inventory from './pages/Inventory'
import { useState } from 'react'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'

import { initialProducts, type Product } from './data/products'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [categories, setCategories] = useState<string[]>(() =>
    Array.from(new Set(initialProducts.map((product) => product.category)))
  )

  // Shopping cart: product ID and selected quantity
  const [cart, setCart] = useState<Record<number, number>>({})

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
  return (
    <Dashboard
      products={products}
      categories={categories}
    />
  )

      case 'Products':
        return (
          <Products
            products={products}
            setProducts={setProducts}
            categories={categories}
            cart={cart}
            setCart={setCart}
          />
        )

      case 'Categories':
        return (
          <Categories
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
          />
        )

      case 'Inventory':
  return <Inventory products={products} />

      case 'Settings':
  return <Settings />

      default:
  return (
    <Dashboard
      products={products}
      categories={categories}
    />
  )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App