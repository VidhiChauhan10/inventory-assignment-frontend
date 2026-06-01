import api from './api'
import type { Product, ProductCreate, ProductUpdate, PaginatedResponse } from '../types'

export const productService = {
  list: async (page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, string | number> = { page, page_size: pageSize }
    if (search) params.search = search
    const res = await api.get('/api/products', { params })
    return res.data
  },

  get: async (id: number): Promise<Product> => {
    const res = await api.get(`/api/products/${id}`)
    return res.data
  },

  create: async (data: ProductCreate): Promise<Product> => {
    const res = await api.post('/api/products', data)
    return res.data
  },

  update: async (id: number, data: ProductUpdate): Promise<Product> => {
    const res = await api.put(`/api/products/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`)
  },

  stats: async () => {
    const res = await api.get('/api/products/stats')
    return res.data
  },
}
