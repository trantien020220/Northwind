import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    Package2,
    Users,
    Box,
    Truck,
    Factory,
    Tags,
    AlertCircle
} from 'lucide-react'
import {getOrders} from "../api/orderApi.js";
import {getCustomers} from "../api/customerApi.js";
import {getProducts} from "../api/productApi.js";
import {getCategory} from "../api/categoryApi.js";
import {getSuppliers} from "../api/supplierApi.js";

export default function Dashboard() {
    const { api } = useAuth()
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        shippedOrders: 0,
        totalSuppliers: 0,
        totalCategories: 0
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [
                    ordersRes,
                    customersRes,
                    productsRes,
                    suppliersRes,
                    categoriesRes
                ] = await Promise.all([
                    getOrders(),
                    getCustomers(),
                    getProducts(),
                    getSuppliers(),
                    getCategory()
                ])

                const orders = ordersRes.data?.data || ordersRes.data || []
                const customers = customersRes.data?.data || customersRes.data || []
                const products = productsRes.data?.data || productsRes.data || []
                const suppliers = suppliersRes.data?.data || suppliersRes.data || []
                const categories = categoriesRes.data?.data || categoriesRes.data || []

                const shippedOrders = orders.filter(o => o.shippedDate !== null && o.shippedDate !== undefined)

                setStats({
                    totalOrders: orders.length,
                    totalCustomers: customers.length,
                    totalProducts: products.length,
                    shippedOrders: shippedOrders.length,
                    totalSuppliers: suppliers.length,
                    totalCategories: categories.length
                })
                setError('')
            } catch (err) {
                console.error('Dashboard data error:', err)
                setError('Failed to load some data. Using fallback values.')

                setStats({
                    totalOrders: 1428,
                    totalCustomers: 95,
                    totalProducts: 77,
                    shippedOrders: 1319,
                    totalSuppliers: 29,
                    totalCategories: 8
                })
            } finally {
                setLoading(false)
            }
        }

        loadAllData()
    }, [api])

    const statCards = [
        { label: 'Total Orders',       value: stats.totalOrders.toLocaleString(),     icon: Package2,  color: 'bg-blue-600' },
        { label: 'Total Customers',    value: stats.totalCustomers,                   icon: Users,     color: 'bg-emerald-600' },
        { label: 'Total Products',     value: stats.totalProducts,                    icon: Box,       color: 'bg-purple-600' },
        { label: 'Shipped Orders',     value: stats.shippedOrders.toLocaleString(),   icon: Truck,     color: 'bg-green-600' },
        { label: 'Total Suppliers',    value: stats.totalSuppliers,                   icon: Factory,   color: 'bg-orange-600' },
        { label: 'Total Categories',   value: stats.totalCategories,                  icon: Tags,      color: 'bg-cyan-600' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-xl text-gray-600">Loading dashboard data...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-10 text-white">
                <h2 className="text-3xl font-bold">DASHBOARD</h2>
                <p className="mt-3 text-lg opacity-90">
                    Welcome
                </p>
            </div>
            
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Data</h1>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.color} p-3 rounded-xl`}>
                                <card.icon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-600 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}