import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCustomerById, deleteCustomer, updateCustomer } from "../../api/customerApi";
import {Pencil, Trash2} from "lucide-react";

export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [errors, setErrors] = useState({});
    
    async function loadCustomer() {
        try {
            const res = await getCustomerById(id);
            setCustomer(res.data.data);
        } catch (err) {
            console.error(err);
        }
    }
    
    useEffect(() => {
        loadCustomer();
    }, [id]);
    
    const openEditModal = () => {
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
            _isEdit: !!customer.customerId
        })
        setShowModal(true);
    };
    
    const handleDelete = async () => {
        if (!window.confirm("Delete this customer?")) return;
        try {
            await deleteCustomer(id);
            alert("Customer deleted successfully");
            navigate("/customers");
        } catch (err) {
            console.error(err);
            alert("Failed to delete!");
        }
    };
    
    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            await updateCustomer(id, modalData);
            alert("Customer updated!");
            setShowModal(false);
            loadCustomer();
        } catch (err) {
            console.error(err.response?.data);
            alert("Update failed!");
        }
    };
    
    if (!customer) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            {/* BACK BUTTON */}
            <Link
                to="/customers"
                className="text-blue-600 underline mb-4 inline-block">
                ← Back to Customers
            </Link>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Customer {customer.companyName}</h1>

                <div className="flex gap-3">
                    <button
                        onClick={openEditModal}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2">
                        <Pencil size={18} /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                {[
                    ["Customer ID", customer.customerId],
                    ["Company Name", customer.companyName],
                    ["Contact Name", customer.contactName],
                    ["Contact Title", customer.contactTitle],
                    ["Address", customer.address],
                    ["City", customer.city],
                    ["Region", customer.region],
                    ["Postal Code", customer.postalCode],
                    ["Country", customer.country],
                    ["Phone", customer.phone],
                    ["Fax", customer.fax],
                ].map(([label, value]) => (
                    <p key={label}>
                        <span className="font-semibold">{label}:</span> {value || "-"}
                    </p>
                ))}
            </div>

            {/* ORDER LIST */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Orders List</h2>

            {customer.orders?.length ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        {[
                            "Order ID", "Order Date", "Required Date", "Shipped Date", "Ship Via",
                            "Freight", "Ship Name", "Address", "City", "Region", "Postal Code", "Country"
                        ].map(h => (
                            <th key={h} className="px-3 py-2 border text-left">{h}</th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {customer.orders.map(order => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border">
                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="text-blue-600 hover:underline">
                                    {order.orderId}
                                </Link>
                            </td>

                            <td className="px-3 py-2 border">{order.orderDate?.split("T")[0]}</td>
                            <td className="px-3 py-2 border">{order.requiredDate?.split("T")[0]}</td>
                            <td className="px-3 py-2 border">{order.shippedDate?.split("T")[0]}</td>
                            <td className="px-3 py-2 border">{order.shipVia}</td>
                            <td className="px-3 py-2 border">{order.freight}</td>
                            <td className="px-3 py-2 border">{order.shipName}</td>
                            <td className="px-3 py-2 border">{order.shipAddress}</td>
                            <td className="px-3 py-2 border">{order.shipCity}</td>
                            <td className="px-3 py-2 border">{order.shipRegion}</td>
                            <td className="px-3 py-2 border">{order.shipPostalCode}</td>
                            <td className="px-3 py-2 border">{order.shipCountry}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">This customer has no orders.</p>
            )}
            
            {/* EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-auto">
                    <div className="bg-white w-[600px] rounded-lg shadow p-5">
                        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ["companyName", "Company Name"],
                                ["contactName", "Contact Name"],
                                ["contactTitle", "Contact Title"],
                                ["address", "Address"],
                                ["city", "City"],
                                ["region", "Region"],
                                ["postalCode", "Postal Code"],
                                ["country", "Country"],
                                ["phone", "Phone"],
                                ["fax", "Fax"]
                            ].map(([key, label]) => (
                                <div key={key}>
                                    <label className="font-medium">{label}</label>
                                    <input
                                        type="text"
                                        className="w-full border px-2 py-1 rounded mt-1"
                                        value={modalData[key] || ""}
                                        onChange={(e) =>
                                            setModalData(prev => ({ ...prev, [key]: e.target.value }))}/>
                                    {errors[key] && (
                                        <p className="text-red-600 text-sm">{errors[key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
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