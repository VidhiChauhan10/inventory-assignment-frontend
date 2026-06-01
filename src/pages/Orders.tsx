import { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus, ShoppingCart, ChevronLeft, ChevronRight, X, Minus,
  AlertTriangle, Eye, Package
} from 'lucide-react'
import { useOrders, useCreateOrder, useCancelOrder } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import { useCustomers } from '../hooks/useCustomers'
import { formatCurrency, formatDateTime, getStatusColor } from '../lib/utils'
import type { Order, OrderCreate, OrderItemCreate } from '../types'

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Order #{order.id}</h2>
            <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="p-6 space-y-5">
          <div className="glass rounded-xl p-4 border border-white/5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Customer</p>
            <p className="font-medium">{order.customer_name || `Customer #${order.customer_id}`}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 glass rounded-xl p-3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name || `Product #${item.product_id}`}</p>
                    <p className="text-xs text-muted-foreground">{item.product_sku} · qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(item.subtotal)}</p>
                    <p className="text-xs text-muted-foreground">@ {formatCurrency(item.unit_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between glass rounded-xl p-4 border border-white/5">
            <p className="font-medium">Total Amount</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(order.total_amount)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateOrderModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void
  onSubmit: (data: OrderCreate) => void
  isLoading: boolean
}) {
  const [customerId, setCustomerId] = useState<number>(0)
  const [items, setItems] = useState<OrderItemCreate[]>([{ product_id: 0, quantity: 1 }])

  const { data: customersData } = useCustomers(1, 100)
  const { data: productsData } = useProducts(1, 100)

  const addItem = () => setItems(prev => [...prev, { product_id: 0, quantity: 1 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const updateItem = (i: number, field: keyof OrderItemCreate, value: number) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const getProductPrice = (productId: number) => {
    const product = productsData?.items.find(p => p.id === productId)
    return product ? product.price : 0
  }

  const total = items.reduce((sum, item) => {
    if (!item.product_id || !item.quantity) return sum
    return sum + getProductPrice(item.product_id) * item.quantity
  }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items.filter(i => i.product_id > 0 && i.quantity > 0)
    if (!customerId) { toast.error('Please select a customer'); return }
    if (!validItems.length) { toast.error('Please add at least one item'); return }
    onSubmit({ customer_id: customerId, items: validItems })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold">Create New Order</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Select customer and add products</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Customer */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Customer *</label>
            <select
              className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
              style={{ background: 'hsl(222,47%,10%)', color: 'hsl(210,40%,98%)' }}
              value={customerId || ''}
              onChange={e => setCustomerId(Number(e.target.value))}
              required
            >
              <option value="" style={{ background: 'hsl(222,47%,10%)', color: 'hsl(215,20%,55%)' }}>Select a customer...</option>
              {customersData?.items.map(c => (
                <option key={c.id} value={c.id} style={{ background: 'hsl(222,47%,10%)', color: 'hsl(210,40%,98%)' }}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Items *</label>
              <button type="button" onClick={addItem}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    className="flex-1 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition"
                    style={{ background: 'hsl(222,47%,10%)', color: 'hsl(210,40%,98%)' }}
                    value={item.product_id || ''}
                    onChange={e => updateItem(i, 'product_id', Number(e.target.value))}
                  >
                    <option value="" style={{ background: 'hsl(222,47%,10%)', color: 'hsl(215,20%,55%)' }}>Select product...</option>
                    {productsData?.items.map(p => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={p.stock_quantity === 0}
                        style={{
                          background: 'hsl(222,47%,10%)',
                          color: p.stock_quantity === 0 ? 'hsl(215,20%,40%)' : 'hsl(210,40%,98%)'
                        }}
                      >
                        {p.name} (Stock: {p.stock_quantity})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 glass border border-white/10 rounded-xl px-2 py-2">
                    <button type="button" onClick={() => updateItem(i, 'quantity', Math.max(1, item.quantity - 1))}
                      className="text-muted-foreground hover:text-foreground transition">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number" min="1"
                      className="w-12 bg-transparent text-center text-sm focus:outline-none"
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <button type="button" onClick={() => updateItem(i, 'quantity', item.quantity + 1)}
                      className="text-muted-foreground hover:text-foreground transition">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      className="p-2 rounded-xl hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          {total > 0 && (
            <div className="flex items-center justify-between glass rounded-xl p-4 border border-emerald-500/20">
              <span className="text-sm text-muted-foreground">Estimated Total</span>
              <span className="text-lg font-bold text-emerald-400">{formatCurrency(total)}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition">
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Orders() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [cancelId, setCancelId] = useState<number | null>(null)

  const { data, isLoading } = useOrders(page, 10, statusFilter || undefined)
  const createMutation = useCreateOrder()
  const cancelMutation = useCancelOrder()

  const handleCreate = async (formData: OrderCreate) => {
    try {
      await createMutation.mutateAsync(formData)
      toast.success('Order placed successfully!')
      setShowCreateModal(false)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id)
      toast.success('Order cancelled and stock restored')
      setCancelId(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const statuses = ['', 'PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">{data?.total ?? 0} total orders</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition glow"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              statusFilter === s
                ? 'bg-primary/20 text-primary border-primary/30'
                : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
            }`}
          >
            {s || 'All Orders'}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : !data?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {statusFilter ? `No ${statusFilter} orders` : 'Create your first order to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Order</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Items</th>
                  <th className="text-right px-6 py-3 font-medium">Total</th>
                  <th className="text-center px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.items.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-mono font-medium">#{order.id}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customer_name || `Customer #${order.customer_id}`}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status) && (
                          <button
                            onClick={() => setCancelId(order.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition"
                            title="Cancel order"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground">Page {data.page} of {data.total_pages} · {data.total} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}

      {viewOrder && (
        <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}

      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative glass border border-white/10 rounded-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold">Cancel Order #{cancelId}</h3>
                <p className="text-xs text-muted-foreground">Stock will be restored automatically</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">Keep Order</button>
              <button onClick={() => handleCancel(cancelId!)} disabled={cancelMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition">
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
