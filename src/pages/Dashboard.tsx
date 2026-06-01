import { Package, Users, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react'
import { useDashboardStats } from '../hooks/useOrders'
import { formatCurrency } from '../lib/utils'

function StatCard({
  title, value, icon: Icon, color, subtitle
}: {
  title: string; value: string | number; icon: React.ElementType; color: string; subtitle?: string
}) {
  return (
    <div className="glass rounded-2xl p-6 card-hover border border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-medium text-foreground/80">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-white/5 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
            <div className="h-8 w-20 bg-white/10 rounded mb-2" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 glass rounded-2xl border border-red-500/20">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-400">Failed to load dashboard. Make sure the backend is running.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time overview of your inventory & orders</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.total_products ?? 0}
          icon={Package}
          color="bg-gradient-to-br from-purple-500 to-purple-700"
          subtitle="Active SKUs in catalog"
        />
        <StatCard
          title="Total Customers"
          value={stats?.total_customers ?? 0}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          subtitle="Registered customers"
        />
        <StatCard
          title="Total Orders"
          value={stats?.total_orders ?? 0}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          subtitle="All-time order count"
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(stats?.total_inventory_value ?? 0)}
          icon={DollarSign}
          color="bg-gradient-to-br from-orange-500 to-orange-700"
          subtitle="Total stock valuation"
        />
      </div>

      {/* Low stock alerts */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold text-sm">Low Stock Alerts</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {stats?.low_stock_items?.length ?? 0} items
          </span>
        </div>
        {!stats?.low_stock_items?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="w-10 h-10 text-emerald-400 mb-3" />
            <p className="text-sm font-medium text-foreground">All stock levels healthy!</p>
            <p className="text-xs text-muted-foreground mt-1">No products below threshold of 10 units</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {stats.low_stock_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  item.stock_quantity === 0
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {item.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
