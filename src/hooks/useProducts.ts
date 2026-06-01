import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'
import type { ProductCreate, ProductUpdate } from '../types'

export const PRODUCTS_KEY = 'products'

export function useProducts(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, page, pageSize, search],
    queryFn: () => productService.list(page, pageSize, search),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => productService.get(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductCreate) => productService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) =>
      productService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  })
}

export function useInventoryStats() {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => productService.stats(),
    refetchInterval: 30000,
  })
}
