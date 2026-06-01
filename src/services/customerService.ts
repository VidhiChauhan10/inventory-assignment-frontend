import api from './api'
import type { Customer, CustomerCreate, CustomerUpdate, PaginatedResponse } from '../types'

export const customerService = {
  list: async (page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<Customer>> => {
    const params: Record<string, string | number> = { page, page_size: pageSize }
    if (search) params.search = search
    const res = await api.get('/api/customers', { params })
    return res.data
  },

  get: async (id: number): Promise<Customer> => {
    const res = await api.get(`/api/customers/${id}`)
    return res.data
  },

  create: async (data: CustomerCreate): Promise<Customer> => {
    const res = await api.post('/api/customers', data)
    return res.data
  },

  update: async (id: number, data: CustomerUpdate): Promise<Customer> => {
    const res = await api.put(`/api/customers/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/customers/${id}`)
  },
}
