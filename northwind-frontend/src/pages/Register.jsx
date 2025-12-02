import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState('')
    const { api } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) {
            setMessage('Passwords do not match')
            return
        }

        try {
            await api.post('/auth/register', {
                userName: form.username,
                email: form.email,
                password: form.password
            })
            setMessage('Success!')
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to register')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
                <h2 className="text-3xl font-bold text-center text-accent mb-8">
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full px-5 py-4 border-2 rounded-xl focus:border-accent outline-none transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-5 py-4 border-2 rounded-xl focus:border-accent outline-none transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-5 py-4 border-2 rounded-xl focus:border-accent outline-none transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="w-full px-5 py-4 border-2 rounded-xl focus:border-accent outline-none transition"
                        required
                    />

                    {message && (
                        <div className={`p-4 rounded-lg text-center font-medium ${
                            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition"
                    >
                        CREATE ACCOUNT
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    ####
                </p>
            </div>
        </div>
    )
}