import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
]

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full glass border-r border-white/5">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold gradient-text">InventoryPro</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
            <button
              className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary shadow-sm shadow-primary/10 border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )
                }
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground">v1.0.0 · Production Ready</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 glass shrink-0">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
