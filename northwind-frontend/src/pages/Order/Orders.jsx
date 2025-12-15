import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Download, Search, Save } from 'lucide-react'
import { format } from 'date-fns'
import {createOrder, getOrders} from "../../api/orderApi.js";
import {getProducts} from "../../api/productApi.js";
import {getCustomer} from "../../api/customerApi.js";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table'


export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [products, setProducts] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    

    const initialForm = {
        customerId: "",
        orderDate: "",
        requiredDate: "",
        shippedDate: "",
        freight: 0,
        shipVia: 1,
        shipCountry: ""
    }
    const [form, setForm] = useState(initialForm)

    useEffect(() => {
        loadOrders();
        loadProducts();

        if (selectedOrder) {
            loadOrderDetails(selectedOrder.orderId);
        } else {
            setOrderDetails([]);
        }
    }, [selectedOrder]);


    const loadProducts = async () => {
        try {
            const res = await getProducts()
            setProducts(res.data.data || res.data)
        } catch (err) {
            console.error("Error loading products:", err)
        }
    }

    const loadOrders = async () => {
        try {
            setLoading(true)

            const [ordersRes, customersRes] = await Promise.all([
                getOrders(),
                getCustomer()
            ])
            const orders = ordersRes.data.data || ordersRes.data || []
            const customers = customersRes.data.data || customersRes.data || []

            const orderData = orders.map(order => {
                const customer = customers.find(c => c.customerId === order.customerId)

                return {
                    ...order,
                    customerName: customer?.companyName || 'Unknown',
                    status:
                        order.shippedDate
                            ? 'Shipped'
                            : order.requiredDate && new Date(order.requiredDate) < new Date()
                                ? 'Delayed'
                                : 'Processing'
                }
            })

            setOrders(orderData)

        } catch (err) {
            console.error("Error loading orders:", err)
        } finally {
            setLoading(false)
        }
    }

    const loadOrderDetails = async (orderId) => {
        setLoadingDetails(true);
        setDetailsError('');
        try {
            const res = await api.get(`/orderdetails/${orderId}`);
            const details = res.data?.data ?? res.data ?? [];
            setOrderDetails(details);
        } catch (err) {
            console.error('Failed to load order details:', err);
            setDetailsError('Failed to load items.');
            setOrderDetails([]);
        } finally {
            setLoadingDetails(false);
        }
    };

    const openCreateForm = () => {
        setModalData(initialForm);
        setOrderDetails([]);
        setShowModal(true);
    };


    const handleCreate = async () => {
        if (orderDetails.length === 0) {
            alert("Order must have at least one product.");
            return;
        }
        const payload = {
            customerId: modalData.customerId,
            orderDate: modalData.orderDate || null,
            requiredDate: modalData.requiredDate || null,
            shippedDate: modalData.shippedDate || null,
            freight: Number(modalData.freight) || 0,
            shipCity: modalData.shipCity || null,
            shipCountry: modalData.shipCountry || null,
            shipAddress: modalData.shipAddress || null,
            shipVia: 1,
            orderDetails: orderDetails.map(d => ({
                productId: d.productId,
                unitPrice: d.unitPrice,
                quantity: d.quantity,
                discount: 0
            }))
        };
        alert("Order create successfully");
        await createOrder(payload);
    };

    
    const addProductToOrder = (productId) => {
        const prod = products.find(p => p.productId === Number(productId))
        if (!prod) return
        
        if (orderDetails.some(x => x.productId === prod.productId)) return

        setOrderDetails(prev => [
            ...prev,
            {
                productId: prod.productId,
                productName: prod.productName,
                quantity: 1,
                unitPrice: prod.unitPrice || 0,
                discount: 0
            }
        ])
    }

    // const removeDetail = (productId) => {
    //     setOrderDetails(prev => prev.filter(x => x.productId !== productId))
    // }

    const columns = useMemo(() => [
        {
            accessorKey: 'orderId',
            header: 'Order ID',
            cell: ({ row }) => (
                <span
                    onClick={() => navigate(`/orders/${row.original.orderId}`)}
                    className="text-cyan-600 hover:text-cyan-800 cursor-pointer font-semibold"
                >
            {row.original.orderId}
        </span>
            ),
            size: 90
        },
        {
            accessorKey: 'customerName',
            header: 'Customer',
            cell: ({ row }) => (
                <span
                    onClick={() => navigate(`/customers/${row.original.customerId}`)}
                    className="text-cyan-600 hover:text-cyan-800 cursor-pointer font-semibold"
                >
            {row.original.customerName}
        </span>
            ),
            size: 90
        },
        {
            accessorKey: 'orderDate',
            header: 'Order Date',
            cell: ({ getValue }) => format(new Date(getValue()), 'dd/MM/yyyy'),
            size: 120
        },
        {
            accessorKey: 'requiredDate',
            header: 'Required',
            cell: ({ getValue }) => getValue() ? format(new Date(getValue()), 'dd/MM/yyyy') : '-',
            size: 120
        },
        {
            accessorKey: 'shippedDate',
            header: 'Shipped',
            cell: ({ getValue }) => getValue() ? format(new Date(getValue()), 'dd/MM/yyyy') : '-',
            size: 120
        },
        { accessorKey: 'freight', header: 'Freight', cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`, size: 100 },
        { accessorKey: 'shipVia', header: 'Ship Via', size: 100 },
    ], [])

    const table = useReactTable({
        data: orders,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })

    // const safeToFixed = (num, digits = 2) => {
    //     const n = Number(num);
    //     return isNaN(n) ? "0.00" : n.toFixed(digits);
    // };

    const exportCSV = () => {
        const headers = ['Order ID', 'Customer', 'Order Date', 'Required Date', 'Shipped Date', 'Freight', 'Status']
        const rows = orders.map(o => [
            o.orderId,
            o.customerName,
            o.orderDate ? format(new Date(o.orderDate), 'dd/MM/yyyy') : '',
            o.requiredDate ? format(new Date(o.requiredDate), 'dd/MM/yyyy') : '',
            o.shippedDate ? format(new Date(o.shippedDate), 'dd/MM/yyyy') : '',
            o.freight,
            o.status
        ])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'orders.csv'
        a.click()
    }

    if (loading) return <div className="flex items-center justify-center h-96 text-xl">Loading orders...</div>

    return (
        <div>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">
                        Total: <strong className="text-cyan-600">{orders.length}</strong> orders
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadOrders} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    
                    <button
                        onClick={() => openCreateForm()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                    >
                        <Plus className="w-4 h-4" /> Add Order
                    </button>
                    
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Download className="w-4 h-4" /> Export
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
                        placeholder="Search by customer name, order ID..."
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:border-cyan-600 outline-none"
                    />
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
                        <tr key={row.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(row.original)}>
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
                    {Math.min((table.getState().pagination.pageIndex + 1) * 10, orders.length)} of {orders.length}
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
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-8 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            Add New Order
                        </h2>

                        <div className="grid grid-cols-2 gap-6">

                            {/* LEFT - ORDER INFO */}
                            <div className="pr-4">
                                <h3 className="text-lg font-semibold mb-3">Order Information</h3>

                                {[
                                    ["customerId", "Customer ID"],
                                    ["orderDate", "Order Date", "date"],
                                    ["requiredDate", "Required Date", "date"],
                                    ["shippedDate", "Shipped Date", "date"],
                                    ["freight", "Freight", "number"],
                                    ["shipCountry", "Ship Country"],
                                    ["shipCity", "Ship City"],
                                    ["shipAddress", "Ship Address"]
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

                            {/* RIGHT - PRODUCT SELECTION */}
                            <div className="overflow-y-auto max-h-[70vh]">
                                <h3 className="text-lg font-semibold mb-3">Order Products</h3>

                                {/* Add Product */}
                                <div className="mb-4">
                                    <label className="font-medium">Select Product</label>
                                    <select
                                        className="border w-full p-2 rounded-lg"
                                        onChange={e => {
                                            addProductToOrder(e.target.value);
                                            e.target.value = "";
                                        }}
                                    >
                                        <option value="">-- Select Product --</option>

                                        {products.map(p => (
                                            <option
                                                key={p.productId}
                                                value={p.productId}
                                                disabled={orderDetails.some(d => d.productId === p.productId)}
                                            >
                                                {p.productName} (${p.unitPrice})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product Table */}
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="bg-gray-100 border-b">
                                            <th className="text-left p-3">Product</th>
                                            <th className="text-right p-3">Unit Price</th>
                                            <th className="text-right p-3">Quantity</th>
                                            <th className="text-right p-3">Total</th>
                                            <th className="text-center p-3">Remove</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {orderDetails.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    No products selected
                                                </td>
                                            </tr>
                                        )}

                                        {orderDetails.map((detail, index) => {
                                            const product = products.find(
                                                p => p.productId === detail.productId
                                            );
                                            const price =
                                                product?.unitPrice ??
                                                detail.unitPrice ??
                                                0;

                                            return (
                                                <tr key={detail.productId} className="border-b">
                                                    <td className="p-3">{product?.productName}</td>

                                                    <td className="p-3 text-right">
                                                        ${price.toFixed(2)}
                                                    </td>

                                                    <td className="p-3 text-right">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={detail.quantity}
                                                            onChange={e => {
                                                                const qty = Number(e.target.value);
                                                                setOrderDetails(prev => {
                                                                    const updated = [...prev];
                                                                    updated[index].quantity = qty;
                                                                    return updated;
                                                                });
                                                            }}
                                                            className="border p-1 w-20 rounded-lg text-right"
                                                        />
                                                    </td>

                                                    <td className="p-3 text-right font-semibold">
                                                        ${(price * detail.quantity).toFixed(2)}
                                                    </td>

                                                    <td className="text-center p-3">
                                                        <button
                                                            onClick={() =>
                                                                setOrderDetails(prev =>
                                                                    prev.filter(
                                                                        d =>
                                                                            d.productId !==
                                                                            detail.productId
                                                                    )
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                                        >
                                                            X
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
                            >
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