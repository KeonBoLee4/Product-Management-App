function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Product Management
        </h2>
        <p className="text-sm text-gray-500">
          Manage your store and products
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-blue-600 text-xl">
          🔔
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>
            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar