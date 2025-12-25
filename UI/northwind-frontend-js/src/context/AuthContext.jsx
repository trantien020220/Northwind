import { createContext, useState, useEffect } from 'react'
import api from "../api/api.js";
import {getOwnUsers} from "../api/userApi.js";

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

    const login = async (username, password) => {
        try {
            const res = await api.post('http://localhost:5000/api/auth/login', {
                userName: username,
                password: password
            })
            const token = res.data.token
            localStorage.setItem('token', token)

            const apiData = res.data

            setUser({
                username: apiData.userName || username || 'Unknown',
                email: apiData.email || 'Unknown',
                fullName: apiData.fullName || '',
                phoneNumber: apiData.phoneNumber || '',
                roles: Array.isArray(apiData.roles) ? apiData.roles : [],
                isSuperAdmin: apiData.isSuperAdmin || false
            })
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log('Token in localStorage:', token ? 'exists' : 'missing')

        if (token) {
            const loadProfile = async () => {
                try {
                    console.log('Starting to decode token...')
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    console.log('Token payload:', payload)

                    console.log('Calling /users/me...')
                    const res = await getOwnUsers()
                    console.log('API /users/me response:', res.data)

                    setUser({
                        username: payload.sub || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Unknown',
                        email: res.data.email || payload.email || 'Unknown',
                        fullName: res.data.fullName || '',
                        phoneNumber: res.data.phoneNumber || '',
                        roles: Array.isArray(res.data.roles) ? res.data.roles : [],
                        isSuperAdmin: res.data.isSuperAdmin || payload.IsSuperAdmin === 'true'
                    })
                    console.log('User set successfully')
                } catch (e) {
                    console.error('Error in loadProfile:', e.message, e.response?.data)
                } finally {
                    setLoading(false)
                }
            }
            loadProfile()
        } else {
            setLoading(false)
        }
    }, [])

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