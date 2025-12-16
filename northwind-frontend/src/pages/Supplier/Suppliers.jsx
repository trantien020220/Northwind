import { useState, useEffect, useMemo } from "react";
import {Download, Plus, RefreshCw, Save, Search} from "lucide-react";
import { Link } from "react-router-dom";
import {getSuppliers, createSupplier} from "../../api/supplierApi";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender
} from '@tanstack/react-table'


export default function Suppliers() {
    const [supplier, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({})

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            const res = await getSuppliers();
            setSuppliers(res.data.data || []);
        } catch (err) {
            console.error("Failed to load suppliers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);
    
    const openCreateModal = (supplier = {}) => {
        setModalData({
            supplierId: supplier.supplierId || '',
            companyName: supplier.companyName || '',
            contactName: supplier.contactName || '',
            contactTitle: supplier.contactTitle || '',
            address: supplier.address || '',
            city: supplier.city || '',
            region: supplier.region || '',
            postalCode: supplier.postalCode || '',
            country: supplier.country || '',
            phone: supplier.phone || '',
            fax: supplier.fax || '',
            homePage: supplier.homePage || '',
        })
        setShowModal(true)
    }


    const handleCreate = async () => {
        const payload = { ...modalData };

        try {
            await createSupplier(payload);
            alert("Created supplier successfully!")

            loadSuppliers();
            setShowModal(false);
            setModalData({});
        } catch (err) {
            console.error("Full error:", err.response?.data);
        }
    };
    
    const columns = useMemo(
        () => [
            {
                accessorKey: "supplierId",
                header: "ID",
                size: 80,
                cell: ({ row }) => (
                    <Link
                        to={`/suppliers/${row.original.supplierId}`}
                        className="text-blue-600 hover:underline"
                    >
                        {row.original.supplierId}
                    </Link>
                )
            },
            {
                accessorKey: "companyName",
                header: "Company Name",
                size: 80,
                cell: ({ row }) => (
                    <Link
                        to={`/suppliers/${row.original.supplierId}`}
                        className="text-blue-600 hover:underline"
                    >
                        {row.original.companyName}
                    </Link>
                )
            },
            { accessorKey: "contactName", header: "Contact Name", size: 180 },
            { accessorKey: "contactTitle", header: "Title", size: 160 },
            { accessorKey: "address", header: "Address", size: 240 },
            { accessorKey: "city", header: "City", size: 120 },
            { accessorKey: "country", header: "Country", size: 120 },
            { accessorKey: "phone", header: "Phone", size: 160 },
            { accessorKey: "homePage", header: "Home Page", size: 200 }
        ],
        []
    );

    const table = useReactTable({
        data: supplier,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (loading) return <div className="flex justify-center py-32 text-xl">Loading suppliers...</div>
    
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
                    <p className="text-gray-600 mt-1">
                        Total: <strong className="text-cyan-600">{supplier.length}</strong> suppliers
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadSuppliers} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>

                    <button onClick={() => openCreateModal()} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                        <Plus className="w-4 h-4" /> Add Supplier
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        value={globalFilter || ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search by supplier name..."
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:border-cyan-600 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 text-sm text-gray-800">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">
                  Showing {table.getState().pagination.pageIndex * 10 + 1} to{' '}
                    {Math.min((table.getState().pagination.pageIndex + 1) * 10, supplier.length)} of {supplier.length}
                </span>
                <div className="flex gap-2">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
                </div>
            </div>

            {/*{showForm && (*/}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-8 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            Add Supplier
                        </h2>

                        <div className="grid grid-cols-1 gap-4 mt-6">
                            
                            <div className="pr-4">

                                {[
                                    ["companyName", "Company Name"],
                                    ["contactName", "Contact Name"],
                                    ["contactTitle", "Title"],
                                    ["address", "Address"],
                                    ["city", "City"],
                                    ["country", "Country"],
                                    ["phone", "Phone"],
                                    ["homePage", "Home Page"]
                                ].map(([key, label, type]) => (
                                    <div className="mb-3" key={key}>
                                        <label className="font-medium">{label}</label>
                                        <input
                                            type={type || "text"}
                                            value={modalData[key] || ""}
                                            onChange={(e) =>
                                                setModalData(prev => ({ ...prev, [key]: e.target.value }))
                                            }
                                            className="border w-full p-2 rounded-lg mt-1"
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {"Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}