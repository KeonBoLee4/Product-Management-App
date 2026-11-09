import { useEffect, useState } from 'react'

interface StoreSettings {
  storeName: string
  description: string
  currency: string
  lowStockThreshold: number
}

const defaultSettings: StoreSettings = {
  storeName: 'ProductHub',
  description: 'Product Management System',
  currency: 'PHP',
  lowStockThreshold: 5,
}

function Settings() {
  const [storeName, setStoreName] = useState(defaultSettings.storeName)
  const [description, setDescription] = useState(defaultSettings.description)
  const [currency, setCurrency] = useState(defaultSettings.currency)
  const [lowStockThreshold, setLowStockThreshold] = useState('5')
  const [message, setMessage] = useState('')

  // Load saved settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('productHubSettings')

      if (savedSettings) {
        const settings: Partial<StoreSettings> = JSON.parse(savedSettings)

        setStoreName(settings.storeName ?? defaultSettings.storeName)
        setDescription(settings.description ?? defaultSettings.description)
        setCurrency(settings.currency ?? defaultSettings.currency)
        setLowStockThreshold(
          String(settings.lowStockThreshold ?? defaultSettings.lowStockThreshold)
        )
      }
    } catch {
      setMessage('Unable to load saved settings.')
    }
  }, [])

  // Hide notification after 2 seconds
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(() => {
      setMessage('')
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [message])

  // Save settings
  const handleSave = () => {
    const threshold = Number(lowStockThreshold)

    if (!storeName.trim() || !description.trim()) {
      setMessage('Please complete all store information.')
      return
    }

    if (
      lowStockThreshold.trim() === '' ||
      !Number.isInteger(threshold) ||
      threshold < 1
    ) {
      setMessage('Low stock threshold must be a whole number greater than zero.')
      return
    }

    const settings: StoreSettings = {
      storeName: storeName.trim(),
      description: description.trim(),
      currency,
      lowStockThreshold: threshold,
    }

    try {
      localStorage.setItem(
        'productHubSettings',
        JSON.stringify(settings)
      )

      setMessage('Settings saved successfully!')
    } catch {
      setMessage('Unable to save settings. Please try again.')
    }
  }

  return (
    <div className="space-y-8">

      {/* Success / Error Notification */}
      {message && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
            message.includes('successfully')
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <span className="text-xl">
            {message.includes('successfully') ? '✓' : '⚠'}
          </span>

          <span className="font-semibold text-sm">
            {message}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your store information and system preferences.
        </p>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Store Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your store's basic information.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Name
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter store description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            System Preferences
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Customize your inventory settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Currency
            </label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PHP">PHP (₱ Philippine Peso)</option>
              <option value="USD">USD ($ US Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Low Stock Threshold
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-400 mt-2">
              Products with quantities at or below this number are considered low stock.
            </p>
          </div>

        </div>
      </div>

      {/* Save Button - No White Container */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Save Settings
        </button>
      </div>

    </div>
  )
}

export default Settings