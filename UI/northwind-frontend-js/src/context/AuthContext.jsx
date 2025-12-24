import { createContext, useContext, useState, useEffect } from 'react'
import api from "../api/api.js";

const AuthContext = createContext()


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    api.interceptors.request.use(config => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    }, error => Promise.reject(error))

    api.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                setUser(null)
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }
    )

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const fetchProfile = async () => {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    console.log('Token payload:', payload)

                    const res = await api.get('/users/me')
                    console.log('Profile response:', res.data)

                    setUser({
                        username: payload.sub || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Unknown',
                        email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Unknown',
                        fullName: res.data.fullName || '',
                        phoneNumber: res.data.phoneNumber || '',
                        roles: Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                            ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                            : (payload.role ? [payload.role] : []),
                        isSuperAdmin: payload.IsSuperAdmin === 'true'
                    })
                } catch (e) {
                    console.error('Error fetching profile:', e)
                } finally {
                    setLoading(false)
                }
            }
            fetchProfile()
        } else {
            setLoading(false)
        }
    }, [])

    // useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     if (token) {
    //         const fetchProfile = async () => {
    //             try {
    //                 const payload = JSON.parse(atob(token.split('.')[1]))
    //                 console.log('Token payload (useEffect):', payload) // Debug
    //
    //                 const res = await api.get('http://localhost:5000/api/users/me', {
    //                     headers: { Authorization: `Bearer ${token}` }
    //                 })
    //                 console.log('Profile response:', res.data) // Debug
    //
    //                 setUser({
    //                     username: payload.sub || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Unknown',
    //                     email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Unknown',
    //                     fullName: res.data.fullName || '',
    //                     phoneNumber: res.data.phoneNumber || '',
    //                     roles: Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
    //                         ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    //                         : (payload.role ? [payload.role] : []),
    //                     isSuperAdmin: Array.isArray(payload.IsSuperAdmin)
    //                         ? payload.IsSuperAdmin.includes('true')  // ← Xử lý mảng
    //                         : payload.IsSuperAdmin === 'true'
    //                 })
    //             } catch (e) {
    //                 console.error('Error fetching profile or decoding token:', e)
    //                 localStorage.removeItem('token')
    //             } finally {
    //                 setLoading(false)
    //             }
    //         }
    //         fetchProfile()
    //     } else {
    //         setLoading(false)
    //     }
    // }, [])

    const login = async (username, password) => {
        try {
            const res = await api.post('http://localhost:5000/api/auth/login', {
                userName: username,
                password: password
            })
            const token = res.data.token || res.data.accessToken || res.data
            localStorage.setItem('token', token)

            const payload = JSON.parse(atob(token.split('.')[1]))
            console.log('Token payload (login):', payload)

            setUser({
                username: payload.sub || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Unknown',
                email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 'Unknown',
                fullName: res.data.fullName || '',
                phoneNumber: res.data.phoneNumber || '',
                roles: Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                    ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    : (payload.role ? [payload.role] : []),
                isSuperAdmin: Array.isArray(payload.IsSuperAdmin)
                    ? payload.IsSuperAdmin.includes('true')  // ← Xử lý mảng
                    : payload.IsSuperAdmin === 'true'
            })
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message)
            throw new Error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            api
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)