import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, Package2, Building2, ShoppingCart,
    Tag, LogOut, Menu, X, TruckIcon, Users
} from 'lucide-react'

import { useState } from 'react'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customers', icon: Building2, label: 'Customers' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/products', icon: Package2, label: 'Products' },
    { path: '/categories', icon: Tag, label: 'Categories' },
    { path: '/suppliers', icon: TruckIcon, label: 'Suppliers' },
]

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
                    <div>
                        <h1 className="text-xl font-bold">Northwind</h1>
                        <p className="text-xs opacity-70">Logistics System</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-8 space-y-2 px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-all
                        ${location.pathname === item.path
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'hover:bg-slate-800'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}

                    {/* SUPER ADMIN ONLY */}
                    {user.isSuperAdmin && (
                        <Link to="/users" className={`flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-all
                        ${location.pathname === '/users' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
                            <Users className="w-5 h-5" />
                            Users Management
                        </Link>
                    )}
                </nav>


                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <div className="px-4 py-3 bg-slate-800/50 rounded-xl mb-3">
                        <p className="text-xs opacity-70">Signed in as</p>
                        <Link to="/profile" className="font-semibold truncate">{user?.username || 'User'}</Link>
                        {/*<p className="font-semibold truncate">{user?.username || 'User'}</p>*/}
                    </div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-4 px-5 py-3.5 hover:bg-red-900/30 rounded-xl transition">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="min-h-screen bg-gray-50 lg:pl-72">
                <header className="fixed top-0 left-0 right-0 lg:left-72 z-40 bg-white shadow-sm border-b h-16 flex items-center px-6">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="ml-auto flex items-center gap-6">
                        <span className="text-sm text-gray-600">Welcome back,</span>
                        <Link to="/profile" className="font-semibold text-cyan-600 hover:text-cyan-700 transition">
                            {user?.username}
                        </Link>
                    </div>
                </header>

                <main className="pt-16 min-h-screen">
                    <div className="p-6 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    )
}