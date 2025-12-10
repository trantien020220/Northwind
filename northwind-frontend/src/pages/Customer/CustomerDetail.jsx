import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCustomerById, deleteCustomer, updateCustomer } from "../../api/customerApi";

export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [errors, setErrors] = useState({});
    
    
    useEffect(() => {
        loadCustomer();
    }, [id]);

    async function loadCustomer() {
        try {
            const res = await getCustomerById(id);
            setCustomer(res.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    // -----------------------------------------------------------------------
    // 🔵 OPEN EDIT MODAL
    // -----------------------------------------------------------------------
    const openEditModal = () => {
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

    // -----------------------------------------------------------------------
    // 🔴 DELETE CUSTOMER
    // -----------------------------------------------------------------------
    const handleDelete = async () => {
        if (!window.confirm("Delete this customer?")) return;
        try {
            await deleteCustomer(id);
            alert("Customer deleted successfully");
            navigate("/customers");
        } catch (err) {
            console.error(err);
            alert("Failed to delete order");
        }
    };

    // -----------------------------------------------------------------------
    // 🟢 SAVE CHANGES
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // 🟡 VALIDATION
    // -----------------------------------------------------------------------
    const validateForm = () => {
        const newErrors = {};

        if (!modalData.companyName?.trim())
            newErrors.companyName = "Company Name is required";

        const phoneDigits = modalData.phone?.replace(/\D/g, '') || '';
        if (!modalData.phone?.trim())
            newErrors.phone = "Phone number is required";
        else if (phoneDigits.length < 9 || phoneDigits.length > 11)
            newErrors.phone = "Phone must be from 9–11 digits";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    if (!customer) return <p>Loading...</p>;

    return (
        <div className="p-6">
            {/* BACK BUTTON */}
            <Link
                to="/customers"
                className="text-blue-600 underline mb-4 inline-block"
            >
                ← Back to Customers
            </Link>

            {/* HEADER + ACTION BUTTONS */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Customer Detail</h1>

                <div className="flex gap-3">
                    <button
                        onClick={openEditModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
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
            <h2 className="text-xl font-semibold mt-8 mb-4">Orders</h2>

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
                                    className="text-blue-600 hover:underline"
                                >
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

            {/* --------------------------------------------------------------- */}
            {/* EDIT MODAL */}
            {/* --------------------------------------------------------------- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-auto">
                    <div className="bg-white w-[600px] rounded-lg shadow p-5">
                        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

                        {/* FORM 2 COLUMN */}
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
                                            setModalData(prev => ({ ...prev, [key]: e.target.value }))
                                        }
                                    />

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
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*{showModal && (*/}
            {/*    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">*/}
            {/*        <div className="bg-white w-[480px] rounded-lg shadow p-5">*/}
            {/*            <h2 className="text-xl font-bold mb-3">Edit Customer</h2>*/}
            
            {/*            /!* Form fields *!/*/}
            {/*            {[*/}
            {/*                ["companyName", "Company Name"],*/}
            {/*                ["contactName", "Contact Name"],*/}
            {/*                ["contactTitle", "Contact Title"],*/}
            {/*                ["address", "Address"],*/}
            {/*                ["city", "City"],*/}
            {/*                ["region", "Region"],*/}
            {/*                ["postalCode", "Postal Code"],*/}
            {/*                ["country", "Country"],*/}
            {/*                ["phone", "Phone"],*/}
            {/*                ["fax", "Fax"]*/}
            {/*            ].map(([key, label]) => (*/}
            {/*                <div className="mb-3" key={key}>*/}
            {/*                    <label className="font-medium">{label}</label>*/}
            {/*                    <input*/}
            {/*                        type="text"*/}
            {/*                        className="w-full border px-2 py-1 rounded mt-1"*/}
            {/*                        value={modalData[key] || ""}*/}
            {/*                        onChange={(e) =>*/}
            {/*                            setModalData(prev => ({ ...prev, [key]: e.target.value }))*/}
            {/*                        }*/}
            {/*                    />*/}
            {/*                    {errors[key] && (*/}
            {/*                        <p className="text-red-600 text-sm">{errors[key]}</p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            ))}*/}
            
            {/*            /!* Buttons *!/*/}
            {/*            <div className="flex justify-end gap-3 mt-5">*/}
            {/*                <button*/}
            {/*                    onClick={() => setShowModal(false)}*/}
            {/*                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"*/}
            {/*                >*/}
            {/*                    Cancel*/}
            {/*                </button>*/}
            
            {/*                <button*/}
            {/*                    onClick={handleUpdate}*/}
            {/*                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"*/}
            {/*                >*/}
            {/*                    Save*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

        </div>
    );
}





// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { getCustomerById } from "../../api/customerApi";
//
// export default function CustomerDetail() {
//     const { id } = useParams();
//     const [customer, setCustomer] = useState(null);
//
//     useEffect(() => {
//         fetchCustomer();
//     }, [id]);
//
//     async function fetchCustomer() {
//         try {
//             const res = await getCustomerById(id);
//             setCustomer(res.data.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     if (!customer) return <p>Loading...</p>;
//
//     return (
//         <div className="p-6">
//             {/* Customer Info */}
//             <h1 className="text-2xl font-bold mb-4">Customer Detail</h1>
//
//             <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
//                 <p><span className="font-semibold">Customer ID:</span> {customer.customerId}</p>
//                 <p><span className="font-semibold">Company Name:</span> {customer.companyName}</p>
//                 <p><span className="font-semibold">Contact Name:</span> {customer.contactName}</p>
//                 <p><span className="font-semibold">Contact Title:</span> {customer.contactTitle}</p>
//                 <p><span className="font-semibold">Address:</span> {customer.address}</p>
//                 <p><span className="font-semibold">City:</span> {customer.city}</p>
//                 <p><span className="font-semibold">Region:</span> {customer.region}</p>
//                 <p><span className="font-semibold">Postal Code:</span> {customer.postalCode}</p>
//                 <p><span className="font-semibold">Country:</span> {customer.country}</p>
//                 <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
//                 <p><span className="font-semibold">Fax:</span> {customer.fax}</p>
//             </div>
//
//             {/* Orders */}
//             <h2 className="text-xl font-semibold mt-8 mb-4">Order List</h2>
//
//             {customer.orders?.length > 0 ? (
//                 <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-sm">
//                     <thead className="bg-gray-100">
//                     <tr>
//                         <th className="px-3 py-2 border">Order ID</th>
//                         <th className="px-3 py-2 border">Order Date</th>
//                         <th className="px-3 py-2 border">Required Date</th>
//                         <th className="px-3 py-2 border">Shipped Date</th>
//                         <th className="px-3 py-2 border">Ship Via</th>
//                         <th className="px-3 py-2 border">Freight</th>
//                         <th className="px-3 py-2 border">Ship Name</th>
//                         <th className="px-3 py-2 border">Address</th>
//                         <th className="px-3 py-2 border">City</th>
//                         <th className="px-3 py-2 border">Region</th>
//                         <th className="px-3 py-2 border">Postal Code</th>
//                         <th className="px-3 py-2 border">Country</th>
//                     </tr>
//                     </thead>
//
//                     <tbody>
//                     {customer.orders.map(order => (
//                         <tr key={order.orderId} className="hover:bg-gray-50">
//                             {/* Click vào Order để mở detail */}
//                             <td className="px-3 py-2 border">
//                                 <Link
//                                     to={`/orders/${order.orderId}`}
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     {order.orderId}
//                                 </Link>
//                             </td>
//
//                             <td className="px-3 py-2 border">{order.orderDate?.split("T")[0]}</td>
//                             <td className="px-3 py-2 border">{order.requiredDate?.split("T")[0]}</td>
//                             <td className="px-3 py-2 border">{order.shippedDate?.split("T")[0]}</td>
//                             <td className="px-3 py-2 border">{order.shipVia}</td>
//                             <td className="px-3 py-2 border">{order.freight}</td>
//                             <td className="px-3 py-2 border">{order.shipName}</td>
//                             <td className="px-3 py-2 border">{order.shipAddress}</td>
//                             <td className="px-3 py-2 border">{order.shipCity}</td>
//                             <td className="px-3 py-2 border">{order.shipRegion}</td>
//                             <td className="px-3 py-2 border">{order.shipPostalCode}</td>
//                             <td className="px-3 py-2 border">{order.shipCountry}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p className="text-gray-600">This customer have no order yet.</p>
//             )}
//         </div>
//     );
//
// }
