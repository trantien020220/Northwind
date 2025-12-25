import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { User, Mail, Phone, Key, Save, Loader2 } from 'lucide-react'

export default function UserProfile() {
    const { user: currentUser, api } = useAuth()
    const { userId } = useParams()
    const navigate = useNavigate()
    const [profileUser, setProfileUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const isOwnProfile = !userId || profileUser?.id === currentUser?.id
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        if (!currentUser) {
            console.log('Waiting for currentUser to load...')
            return
        }

        const loadUser = async () => {
            setLoading(true)
            try {
                let profileData

                if (userId) {
                    console.log('Loading other user profile:', userId)
                    const res = await api.get(`/users/${userId}`)
                    profileData = res.data
                } else {
                    console.log('Loading own profile')
                    const res = await api.get('/users/me')
                    profileData = res.data
                }

                setProfileUser(profileData)
                setForm({
                    fullName: profileData.fullName || '',
                    phoneNumber: profileData.phoneNumber || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } catch (err) {
                setError('Failed to load profile')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [userId, currentUser, api])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setMessage('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            setError('New password and confirm password do not match')
            return
        }

        if (!profileUser?.id) {
            setError('Profile not loaded. Please refresh the page.')
            return
        }

        try {
            setLoading(true)

            const targetUserId = userId || profileUser.id;

            if (form.fullName || form.phoneNumber) {
                await api.put(`/users/${targetUserId}`, {
                    fullName: form.fullName,
                    phoneNumber: form.phoneNumber
                })
            }

            if (form.newPassword) {
                await api.post('/auth/change-password', {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                })
            }

            setMessage('Profile updated successfully!')
            setTimeout(() => navigate('/dashboard'), 100)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }


    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    if (!profileUser) return <div className="text-center text-red-600">User not found</div>

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {isOwnProfile ? 'My Profile' : `Profile of ${profileUser.userName}`}
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-100 p-4 rounded-full">
                            <User className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Username</p>
                            <p className="text-xl font-semibold">{profileUser.userName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-100 p-4 rounded-full">
                            <Mail className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-xl font-semibold">{profileUser.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-100 p-4 rounded-full">
                            <Phone className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="text-xl font-semibold">{profileUser.phoneNumber || 'Not set'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-100 p-4 rounded-full">
                            <Key className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Roles</p>
                            <p className="text-xl font-semibold">
                                {Array.isArray(profileUser.roles) ? profileUser.roles.join(', ') : 'No roles'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form chỉnh sửa */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Update Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    {/* Đổi mật khẩu */}
                    {isOwnProfile && (
                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-xl font-bold mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                        placeholder="Current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                        placeholder="New password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {message && <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">{message}</div>}
                    {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(isOwnProfile ? '/dashboard' : '/users')}
                            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}