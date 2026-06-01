import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Landing from './pages/Landing'

export default function App() {
  return (
    <>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(222 47% 10%)',
            border: '1px solid hsl(217 32% 20%)',
            color: 'hsl(210 40% 98%)',
          },
        }}
      />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Inventory management app */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
