import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService, dashboardService } from '../services/orderService'
import type { OrderCreate } from '../types'

export const ORDERS_KEY = 'orders'
export const DASHBOARD_KEY = 'dashboard'

export function useOrders(page = 1, pageSize = 10, status?: string) {
  return useQuery({
    queryKey: [ORDERS_KEY, page, pageSize, status],
    queryFn: () => orderService.list(page, pageSize, status),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => orderService.get(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: OrderCreate) => orderService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: [DASHBOARD_KEY] })
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => orderService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: [DASHBOARD_KEY] })
    },
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [DASHBOARD_KEY],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000,
  })
}
