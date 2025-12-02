import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [form, setForm] = useState({ username: 'admin', password: 'Admin@123' })
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(form.username, form.password)
            navigate('/dashboard')
        } catch {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
                <h1 className="text-3xl font-bold text-center text-accent mb-8">Northwind</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" placeholder="Username" value={form.username}
                           onChange={e => setForm({...form, username: e.target.value})}
                           className="w-full px-4 py-3 border rounded-lg focus:border-accent outline-none" />
                    <input type="password" placeholder="Password" value={form.password}
                           onChange={e => setForm({...form, password: e.target.value})}
                           className="w-full px-4 py-3 border rounded-lg focus:border-accent outline-none" />
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-cyan-700">
                        SIGN IN
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Demo: admin / Admin@123
                </p>
            </div>
        </div>
    )
}