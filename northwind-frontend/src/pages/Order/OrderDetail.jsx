import React, { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { parseISO, format } from 'date-fns';
import { Trash2, Pencil } from "lucide-react";
import {deleteOrder, getOrderById, getOrderDetails, updateOrder} from "../../api/orderApi.js";
import {getProducts} from "../../api/productApi.js";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    
    async function loadOrder() {
        try {
            const res = await getOrderById(id);
            setOrder(res.data.data);
        } catch (err) {
            console.error(err);
        }
    }
    
    const loadProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadOrderDetails = async () => {
        setLoading(true);
        try {
            const res = await getOrderDetails(id);
            setOrderDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
        loadProducts();
        loadOrderDetails();
    }, [id]);

    const openEditModal = () => {
        setModalData({ ...order });
        setShowModal(true);
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        return dateString.split("T")[0];
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this order?")) return;
        try {
            await deleteOrder(id);
            alert("Order deleted successfully");
            navigate("/orders");
        } catch (err) {
            console.error(err);
            alert("Failed to delete order");
        }
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                ...modalData,
                orderDetails: orderDetails.map(d => ({
                    orderId: order.orderId,
                    productId: d.productId,
                    quantity: d.quantity,
                    unitPrice: d.unitPrice,
                    discount: d.discount
                }))
            };

            await updateOrder(id, payload);

            alert("Order updated!");
            setShowModal(false);
            loadOrder();
            loadOrderDetails();
        } catch (err) {
            console.error(err.response?.data);
            
            alert("Update failed!");
        }
    };
    

    // const validateForm = () => {
    //     return true;
    // };

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

    if (!order) return <p className="p-6">Loading...</p>;

    const fmt = (d) => d ? format(parseISO(d), "dd/MM/yyyy") : "-";
    const safeToFixed = (n) => Number(n || 0).toFixed(2);

    return (
        <div className="p-6">
            {/* BACK BUTTON */}
            <Link
                to="/orders"
                className="text-blue-600 underline mb-4 inline-block"
            >
                ← Back to Orders
            </Link>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>

                <div className="flex gap-3">
                    <button
                        onClick={openEditModal}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2"
                    >
                        <Pencil size={18} /> Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            {/* ORDER INFO */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                {[
                    ["Customer ID", order.customerId],
                    ["Employee ID", order.employeeId],
                    ["Ship Name", order.shipName],
                    ["Order Date", order.orderDate],
                    ["Required Date", order.requiredDate],
                    ["Shipped Date", order.shippedDate],
                    ["Ship Via", order.shipVia],
                    ["Freight", order.freight],
                    ["Ship Address", order.shipAddress],
                    ["Ship Region", order.shipRegion],
                    ["Ship City", order.shipCity],
                    ["Postal Code", order.shipCity],
                    ["Ship Country", order.shipCountry],

                ].map(([label, value]) => (
                    <p key={label}>
                        <span className="font-semibold">{label}:</span>{" "}
                        {label.includes("Date")
                            ? formatDateDisplay(value)
                            : (value || "-")}
                    </p>
                ))}
            </div>

            {/* CUSTOMER ITEMS */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Order Detail</h2>

            {loading ? (
                <p>Loading items...</p>
            ) : orderDetails.length === 0 ? (
                <p>No items in this order.</p>
            ) : (
                <table className="w-full bg-white rounded-xl shadow overflow-hidden">
                    <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Quantity</th>
                        <th className="p-3 text-right">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderDetails.map((d) => {
                        const product = products.find((p) => p.productId === d.productId);
                        const price = d.unitPrice ?? product?.unitPrice ?? 0;

                        return (
                            <tr key={d.productId} className="border-b">
                                <td className="p-3">{product?.productName || "Unknown"}</td>
                                <td className="p-3 text-right">${safeToFixed(price)}</td>
                                <td className="p-3 text-right">{d.quantity}</td>
                                <td className="p-3 text-right font-semibold">
                                    ${safeToFixed(price * d.quantity)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {/* EDIT ORDER MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-white p-8 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">
                            Edit Order #{order.orderId}
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            
                            <div className="pr-4">
                                <h3 className="text-lg font-semibold mb-3">Order Information</h3>

                                {[
                                    // ["customerId", "Customer ID"],
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
                                            value={
                                                type === "date"
                                                    ? (modalData[key]?.split("T")[0] || "")
                                                    : (modalData[key] || "")
                                            }
                                            onChange={(e) =>
                                                setModalData(prev => ({ ...prev, [key]: e.target.value }))
                                            }
                                            className="border w-full p-2 rounded-lg mt-1"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="overflow-y-auto max-h-[70vh]">
                                <h3 className="text-lg font-semibold mb-3">Edit Products</h3>
                                
                                <div className="mb-4">
                                    <label className="font-medium">Add Product</label>
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
                                                    No products in this order
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
                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
