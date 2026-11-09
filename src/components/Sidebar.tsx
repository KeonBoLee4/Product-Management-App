interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Products', icon: '📦' },
    { name: 'Categories', icon: '🏷️' },
    { name: 'Inventory', icon: '📋' },
    { name: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">
          Product<span className="text-blue-400">Hub</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activePage === item.name
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          ProductHub © 2026
        </p>
        <p className="text-xs text-slate-500 mt-1">
          All rights reserved.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar