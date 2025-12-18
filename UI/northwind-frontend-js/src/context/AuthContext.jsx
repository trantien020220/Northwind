import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import api from "../api/api.js";

const AuthContext = createContext()

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token && token !== 'fake-admin-token') {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                setUser({
                    username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.sub || payload.name,
                    roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || []
                })
            } catch (e) {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                userName: username,
                password: password
            })
            const token = res.data.token || res.data.accessToken || res.data
            localStorage.setItem('token', token)

            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser({
                username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                    payload.sub ||
                    payload.name ||
                    username,
                roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                    payload.role ||
                    payload.roles || []
            })
        } catch (err) {
            throw new Error('Invalid credentials')
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