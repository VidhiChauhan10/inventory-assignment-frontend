export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
}

export interface ProductUpdate extends Partial<ProductCreate> {}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name?: string;
  product_sku?: string;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  customer_name?: string;
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
}

export interface OrderCreate {
  customer_id: number;
  items: OrderItemCreate[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  total_products: number;
  total_customers: number;
  total_orders: number;
  total_inventory_value: number;
  low_stock_items: { id: number; sku: string; name: string; stock_quantity: number }[];
}
