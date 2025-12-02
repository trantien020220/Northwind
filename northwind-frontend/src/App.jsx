import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'


function Protected({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}