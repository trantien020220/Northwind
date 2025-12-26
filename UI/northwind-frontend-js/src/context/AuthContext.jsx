import {createContext, useState, useEffect, useContext} from 'react'
import api from "../api/api.js";
import {getOwnUser, userRegister, userLogin} from "../api/userApi.js";


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

    const register = async ({ userName, fullName, phoneNumber, email, password }) => {
        try {
            const res = await userRegister({ userName, fullName, phoneNumber, email, password })
            return res.data
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    // const login = async (username, password) => {
    //     try {
    //         const res = await userLogin({ userName: username, password })
    //         const token = res.data.token
    //         localStorage.setItem('token', token)
    //
    //         const apiData = res.data
    //
    //         setUser({
    //             username: apiData.userName || username || 'Unknown',
    //             email: apiData.email || 'Unknown',
    //             fullName: apiData.fullName || '',
    //             phoneNumber: apiData.phoneNumber || '',
    //             roles: Array.isArray(apiData.roles) ? apiData.roles : [],
    //             isSuperAdmin: apiData.isSuperAdmin || false
    //         })
    //     } catch (err) {
    //         throw new Error(err.response?.data?.message || 'Invalid credentials')
    //     }
    // }

    const login = async (username, password) => {
        try {
            const loginRes = await userLogin({ userName: username, password });
            const token = loginRes.data.token;
            localStorage.setItem('token', token);

            const profileRes = await getOwnUser();
            const apiData = profileRes.data;

            setUser({
                id: apiData.id,
                username: apiData.userName || username || 'Unknown',
                email: apiData.email || 'Unknown',
                fullName: apiData.fullName || '',
                phoneNumber: apiData.phoneNumber || '',
                roles: Array.isArray(apiData.roles) ? apiData.roles : [],
                isSuperAdmin: apiData.isSuperAdmin || false
            });

            return true;
        } catch (err) {
            console.error('Login error:', err);
            throw new Error(err.response?.data?.message || 'Invalid credentials');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log('Token in localStorage:', token ? 'exists' : 'missing')

        if (token) {
            const loadProfile = async () => {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))

                    const res = await getOwnUser()

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
            register,
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