import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './context/ProtectedRoute.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customer/Customers'
import CustomerDetail from "./pages/Customer/CustomerDetail"
import Orders from './pages/Order/Orders'
import OrderDetail from "./pages/Order/OrderDetail"
import Products from "./pages/Product/Products"
import ProductDetail from './pages/Product/ProductDetail'
import Category from './pages/Category/Category'
import CategoryDetail from './pages/Category/CategoryDetail'
import Suppliers from './pages/Supplier/Suppliers'
import SupplierDetail from './pages/Supplier/SupplierDetail'
import Users from "./pages/User/Users";
import UserProfile from './pages/User/UserProfile'


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute requireUser><Dashboard /></ProtectedRoute>} />

            <Route path="/customers" element={<ProtectedRoute requireUser><Customers /></ProtectedRoute>} />
            <Route path="/customers/:id" element={<ProtectedRoute requireUser><CustomerDetail /></ProtectedRoute>} />

            <Route path="/orders" element={<ProtectedRoute requireUser><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute requireUser><OrderDetail /></ProtectedRoute>} />

            <Route path="/products" element={<ProtectedRoute requireUser><Products /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute requireUser><ProductDetail /></ProtectedRoute>} />

            <Route path="/categories" element={<ProtectedRoute requireUser><Category /></ProtectedRoute>} />
            <Route path="/categories/:id" element={<ProtectedRoute requireUser><CategoryDetail /></ProtectedRoute>} />

            <Route path="/suppliers" element={<ProtectedRoute requireUser><Suppliers /></ProtectedRoute>} />
            <Route path="/suppliers/:id" element={<ProtectedRoute requireUser><SupplierDetail /></ProtectedRoute>} />

            <Route path="/users" element={<ProtectedRoute requireSuperAdmin><Users /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute requireUser><UserProfile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute requireSuperAdmin><UserProfile /></ProtectedRoute>} />
        </Routes>
    )
}