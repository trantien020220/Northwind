import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {Link, useNavigate} from 'react-router-dom'

export default function Register() {
    const [form, setForm] = useState({
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState('')
    const {register} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        if (form.password !== form.confirmPassword) return setMessage('Passwords do not match')
        if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)) {
            setMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
            return
        }

        try {
            await register({
                userName: form.userName,
                fullName: form.fullName,
                phoneNumber: form.phoneNumber,
                email: form.email,
                password: form.password
            })
            setMessage('Success! Redirecting to login...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            const errors = err.response?.data?.errors
            if (errors) {
                const errorMsg = Object.values(errors)[0][0] || 'Registration failed'
                setMessage(errorMsg)
            } else {
                setMessage(err.response?.data?.message || 'Registration failed')
            }
        }
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     setMessage('')
    //
    //     // if (!form.username.trim()) return setMessage('Username is required')
    //     // if (!form.fullName.trim()) return setMessage('Full Name is required')
    //     // if (!form.phoneNumber.trim()) return setMessage('Phone Number is required')
    //     // if (!form.email.trim()) return setMessage('Email is required')
    //     // if (!form.password.trim()) return setMessage('Password is required')
    //     if (form.password !== form.confirmPassword) return setMessage('Passwords do not match')
    //     if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)) {
    //         setMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    //         return
    //     }
    //
    //     try {
    //         await api.post('/auth/register', {
    //             userName: form.userName,
    //             fullName: form.fullName,
    //             email: form.email,
    //             phoneNumber: form.phoneNumber,
    //             password: form.password
    //         })
    //         setMessage('Success! Redirecting to login...')
    //         setTimeout(() => navigate('/login'), 500)
    //     } catch (err) {
    //         const errors = err.response?.data?.errors
    //         if (errors) {
    //             const errorMsg = Object.values(errors)[0][0] || 'Registration failed'
    //             setMessage(errorMsg)
    //         } else {
    //             setMessage(err.response?.data?.message || 'Registration failed')
    //         }
    //     }
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
                <h2 className="text-3xl font-bold text-center text-accent mb-8">
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="User Name"
                        value={form.userName}
                        onChange={(e) => setForm({ ...form, userName: e.target.value })}
                        className="w-full px-5 py-4 border-2 rounded-xl focus:border-accent outline-none transition"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                        type="tel"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
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
                            message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition">
                        CREATE ACCOUNT
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        Have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}