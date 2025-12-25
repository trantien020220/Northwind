import { useAuth } from './AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false, requireSuperAdmin = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-600">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requireAdmin && !user.roles?.includes('Admin')) {
        return <Navigate to="/dashboard" replace />
    }

    if (requireSuperAdmin && !user.isSuperAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return <Layout>{children}</Layout>
}