import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customer/Customers'
import CustomerDetail from "./pages/Customer/CustomerDetail"
import Orders from './pages/Order/Orders'
import OrderDetail from "./pages/Order/OrderDetail.jsx"
import Products from "./pages/Product/Products.jsx"
import ProductDetail from './pages/Product/ProductDetail.jsx'
import Category from './pages/Category/Category.jsx'
import CategoryDetail from './pages/Category/CategoryDetail.jsx'
import Suppliers from './pages/Supplier/Suppliers.jsx'
import SupplierDetail from './pages/Supplier/SupplierDetail.jsx'



function Protected({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/customers" element={<Protected><Customers /></Protected>} />
            <Route path="/orders" element={<Protected><Orders /></Protected>} />
            <Route path="/customers/:id" element={<Protected><CustomerDetail /></Protected>} />
            <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
            <Route path="/products/" element={<Protected><Products /></Protected>} />
            <Route path="/products/:id" element={<Protected><ProductDetail /></Protected>} />
            <Route path="/categories/" element={<Protected><Category /></Protected>} />
            <Route path="/categories/:id" element={<Protected><CategoryDetail /></Protected>} />
            <Route path="/suppliers/" element={<Protected><Suppliers /></Protected>} />
            <Route path="/suppliers/:id" element={<Protected><SupplierDetail /></Protected>} />
        </Routes>
    )
}