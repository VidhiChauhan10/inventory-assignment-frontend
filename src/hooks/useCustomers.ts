import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService } from '../services/customerService'
import type { CustomerCreate, CustomerUpdate } from '../types'

export const CUSTOMERS_KEY = 'customers'

export function useCustomers(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, page, pageSize, search],
    queryFn: () => customerService.list(page, pageSize, search),
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn: () => customerService.get(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerCreate) => customerService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerUpdate }) =>
      customerService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => customerService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  })
}
