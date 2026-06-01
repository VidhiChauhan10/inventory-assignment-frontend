import api from './api'
import type { Order, OrderCreate, PaginatedResponse, DashboardStats } from '../types'

export const orderService = {
  list: async (page = 1, pageSize = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const params: Record<string, string | number> = { page, page_size: pageSize }
    if (status) params.status = status
    const res = await api.get('/api/orders', { params })
    return res.data
  },

  get: async (id: number): Promise<Order> => {
    const res = await api.get(`/api/orders/${id}`)
    return res.data
  },

  create: async (data: OrderCreate): Promise<Order> => {
    const res = await api.post('/api/orders', data)
    return res.data
  },

  cancel: async (id: number): Promise<Order> => {
    const res = await api.patch(`/api/orders/${id}/cancel`)
    return res.data
  },
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/api/dashboard')
    return res.data
  },
}
