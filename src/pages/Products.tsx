import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search, Edit2, Trash2, Package, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts'
import { formatCurrency } from '../lib/utils'
import type { Product, ProductCreate } from '../types'

function ProductModal({
  product,
  onClose,
  onSubmit,
  isLoading,
}: {
  product?: Product
  onClose: () => void
  onSubmit: (data: ProductCreate) => void
  isLoading: boolean
}) {
  const [form, setForm] = useState<ProductCreate>({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    stock_quantity: product?.stock_quantity ?? 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 animate-fade-in">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product ? 'Update product details' : 'Fill in the product information'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">SKU *</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                placeholder="SKU-1001"
                value={form.sku}
                onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                placeholder="0.00"
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Product Name *</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
              placeholder="Gaming Laptop"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition resize-none"
              placeholder="Optional product description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Stock Quantity *</label>
            <input
              type="number"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
              placeholder="0"
              value={form.stock_quantity || ''}
              onChange={e => setForm(f => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Products() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading } = useProducts(page, 10, search)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleSubmit = async (formData: ProductCreate) => {
    try {
      if (editProduct) {
        await updateMutation.mutateAsync({ id: editProduct.id, data: formData })
        toast.success('Product updated successfully')
      } else {
        await createMutation.mutateAsync(formData)
        toast.success('Product created successfully')
      }
      setShowModal(false)
      setEditProduct(undefined)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Product deleted')
      setDeleteId(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data?.total ?? 0} products in catalog
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(undefined); setShowModal(true) }}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition glow"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
            placeholder="Search by name or SKU..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-muted-foreground hover:text-foreground transition">
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !data?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No products found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? 'Try a different search term' : 'Add your first product to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">SKU</th>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-right px-6 py-3 font-medium">Price</th>
                  <th className="text-right px-6 py-3 font-medium">Stock</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.items.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded-lg">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{product.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        product.stock_quantity === 0
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : product.stock_quantity <= 10
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {product.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditProduct(product); setShowModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground">
              Page {data.page} of {data.total_pages} · {data.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(undefined) }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass border border-white/10 rounded-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold">Delete Product</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
