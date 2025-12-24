import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate} from "react-router-dom";
import { Plus, RefreshCw, Search, X, Save, AlertCircle } from 'lucide-react'
import { handleBackendValidation } from "../../components/handleBackendValidation";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender
} from '@tanstack/react-table'
import {createCustomer, getCustomers} from "../../api/customerApi.js";

export default function Customers() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const loadCustomers = async () => {
        try {
            setLoading(true)
            const res = await getCustomers()
            setData(res.data?.data || res.data || [])
        } catch (err) {
            console.error('Load error:', err)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers()
    }, [])
    
    const openCreateModal = (customer = {}) => {
        setErrors({});
        setModalData({
            customerId: customer.customerId || '',
            companyName: customer.companyName || '',
            contactName: customer.contactName || '',
            contactTitle: customer.contactTitle || '',
            address: customer.address || '',
            city: customer.city || '',
            region: customer.region || '',
            postalCode: customer.postalCode || '',
            country: customer.country || '',
            phone: customer.phone || '',
            fax: customer.fax || '',
        })
        setShowModal(true)
    }

    const handleCreate = async () => {
        const payload = { ...modalData };
        
        if (payload.customerId) {
            payload.customerId = payload.customerId.trim().toUpperCase();

        }
        try {
            await createCustomer(payload);
            alert("Created customer successfully!")
            loadCustomers();
            setShowModal(false);
            setModalData({});
        } catch (err) {
            handleBackendValidation(err, setErrors, navigate, "Create customer failed");
        }
    };
    
    const columns = useMemo(
        () => [
            {
                accessorKey: 'customerId',
                header: 'ID',
                size: 80,
                cell: ({ row }) => (
                    <Link
                        to={`/customers/${row.original.customerId}`}
                        className="text-cyan-600 hover:text-cyan-800 cursor-pointer font-semibold">
                        {row.original.customerId}
                    </Link>
                )
            },
            { accessorKey: 'companyName', header: 'Company Name', size: 250 },
            { accessorKey: 'contactName', header: 'Contact Name', size: 180 },
            { accessorKey: 'contactTitle', header: 'Title', size: 160 },
            { accessorKey: 'address', header: 'Address', size: 280 },
            { accessorKey: 'city', header: 'City', size: 120 },
            { accessorKey: 'region', header: 'Region', size: 100 },
            { accessorKey: 'postalCode', header: 'Postal Code', size: 120 },
            { accessorKey: 'country', header: 'Country', size: 120 },
            { accessorKey: 'phone', header: 'Phone', size: 160 },
            { accessorKey: 'fax', header: 'Fax', size: 160 }
        ],
        []
    );
    

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (loading) return <div className="flex justify-center py-32 text-xl">Loading customers...</div>

    return (
        <div>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">
                        Total: <strong className="text-cyan-600">{data.length}</strong> customers
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadCustomers}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>

                    <button
                        onClick={() => openCreateModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                        <Plus className="w-4 h-4" /> Add Customer
                    </button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        value={globalFilter || ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search customers..."
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:border-cyan-600 outline-none"/>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id}>
                            {hg.headers.map(h => (
                                <th key={h.id} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">
                    Showing {table.getState().pagination.pageIndex * 10 + 1} to{' '}
                    {Math.min((table.getState().pagination.pageIndex + 1) * 10, data.length)} of {data.length}
                </span>
                <div className="flex gap-2">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}>
                    <div
                        className="bg-white p-8 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Create Customer
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer ID */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Customer ID <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={modalData?.customerId ?? ''}
                                        onChange={(e) => setModalData({ ...(modalData || {}), customerId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-600 focus:outline-none"
                                        required
                                        disabled={!!modalData?._isEdit}
                                        style={modalData?._isEdit ? { backgroundColor: '#f3f4f6' } : {}}/>
                                    {errors?.customerId && (
                                        <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {errors.customerId}
                                        </p>
                                    )}
                                </div>

                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Company Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={modalData?.companyName ?? ''}
                                        onChange={(e) => setModalData({ ...(modalData || {}), companyName: e.target.value })}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition ${
                                            errors?.companyName ? 'border-red-500' : 'border-gray-300 focus:border-cyan-600'
                                        }`}
                                        required/>
                                    {errors?.companyName && (
                                        <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {errors.companyName}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Phone <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={modalData?.phone ?? ''}
                                        onChange={(e) => setModalData({ ...(modalData || {}), phone: e.target.value })}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition ${
                                            errors?.phone ? 'border-red-500' : 'border-gray-300 focus:border-cyan-600'
                                        }`}
                                        required/>
                                    {errors?.phone && (
                                        <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Country <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={modalData?.country ?? ''}
                                        onChange={(e) => setModalData({ ...(modalData || {}), country: e.target.value })}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition ${
                                            errors?.country ? 'border-red-500' : 'border-gray-300 focus:border-cyan-600'
                                        }`}
                                        required/>
                                    {errors?.country && (
                                        <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {errors.country}
                                        </p>
                                    )}
                                </div>

                                {/* Remaining fields */}
                                {['contactName', 'contactTitle', 'address', 'city', 'region', 'postalCode', 'fax'].map((field) => (
                                    <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </label>
                                        <input
                                            value={modalData?.[field] ?? ''}
                                            onChange={(e) => setModalData({ ...(modalData || {}), [field]: e.target.value })}
                                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-cyan-600 outline-none"/>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-8 border-t">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-bold">
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition font-medium flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {'Create Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
};