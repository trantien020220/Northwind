import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})

// --- Customer API ---
export const getCustomers = async () => api.get(`/customers/`)
export const getCustomerById = async (id: string | number) => api.get(`/customers/${id}`)
export const createCustomer = async (data: any) => api.post(`/customers/`, data, { headers: { 'Content-Type': 'application/json' } })
export const updateCustomer = async (id: string | number, data: any) => api.put(`/customers/${id}`, data, { headers: { 'Content-Type': 'application/json' } })
export const deleteCustomer = async (id: string | number) => api.delete(`/customers/${id}`)

// --- Product API ---
export const getProducts = async () => api.get(`/products`)
export const getProductById = async (id: string | number) => api.get(`/products/${id}`)
export const createProduct = async (data: any) => api.post(`/products`, data, { headers: { 'Content-Type': 'application/json' } })
export const updateProduct = async (id: string | number, data: any) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'application/json' } })
export const deleteProduct = async (id: string | number) => api.delete(`/products/${id}`)

// --- Order API ---
export const getOrders = async () => api.get(`/orders`)
export const getOrderById = async (id: string | number) => api.get(`/orders/${id}`)
export const createOrder = async (data: any) => api.post(`/orders`, data, { headers: { 'Content-Type': 'application/json' } })
export const updateOrder = async (id: string | number, data: any) => api.put(`/orders/${id}`, data, { headers: { 'Content-Type': 'application/json' } })
export const deleteOrder = async (id: string | number) => api.delete(`/orders/${id}`)
export const getOrderDetails = async (id: string | number) => api.get(`/orderdetails/${id}`)

// --- Category API ---
export const getCategory = async () => api.get(`/category`)
export const getCategoryById = async (id: string | number) => api.get(`/category/${id}`)
export const createCategory = async (data: any) => api.post(`/category`, data, { headers: { 'Content-Type': 'application/json' } })
export const updateCategory = async (id: string | number, data: any) => api.put(`/category/${id}`, data, { headers: { 'Content-Type': 'application/json' } })
export const deleteCategory = async (id: string | number) => api.delete(`/category/${id}`)

// --- Supplier API ---
export const getSuppliers = async () => api.get(`/suppliers`)
export const getSupplierById = async (id: string | number) => api.get(`/suppliers/${id}`)
export const createSupplier = async (data: any) => api.post(`/suppliers`, data, { headers: { 'Content-Type': 'application/json' } })
export const updateSupplier = async (id: string | number, data: any) => api.put(`/suppliers/${id}`, data, { headers: { 'Content-Type': 'application/json' } })
export const deleteSupplier = async (id: string | number) => api.delete(`/suppliers/${id}`)

export default api
