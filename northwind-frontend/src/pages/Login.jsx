import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const [form, setForm] = useState({
        username: 'admin',
        password: 'Admin@123'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(form.username, form.password)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-cyan-600 mb-2">Login</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-600 focus:outline-none transition text-gray-800 font-medium"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-600 focus:outline-none transition text-gray-800 font-medium"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg">
                        {loading ? 'Signing in...' : 'SIGN IN'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo account:</p>
                    <p className="font-mono text-gray-700">admin / Admin@123</p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}