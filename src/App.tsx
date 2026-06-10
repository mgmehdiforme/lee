import { Routes, Route, Navigate } from 'react-router-dom'
import './lib/fonts'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WorkOrders from './pages/WorkOrders'
import WorkOrderDetail from './pages/WorkOrderDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/work-orders" element={<WorkOrders />} />
      <Route path="/work-order/:id" element={<WorkOrderDetail />} />
    </Routes>
  )
}
