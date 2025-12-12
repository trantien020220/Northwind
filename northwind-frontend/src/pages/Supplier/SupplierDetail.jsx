import React, { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {Edit3, Trash2, ArrowLeft, Pencil} from "lucide-react";
import {getSupplierById, updateSupplier, deleteSupplier} from "../../api/supplierApi";

export default function SupplierDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [products, setProducts] = useState([]);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    
    async function loadSupplier() {
        try {
            const res = await getSupplierById(id);
            setSupplier(res.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadSupplier();
    }, []);

    const openEditModal = () => {
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
            _isEdit: !!supplier.supplierId
        })
        setShowModal(true);
    };


    const handleDelete = async () => {
        if (!window.confirm("Delete this supplier?")) return;
        try {
            await deleteSupplier(id);
            alert("Supplier deleted successfully");
            navigate("/suppliers");
        } catch (err) {
            console.error(err);
            alert("Failed to delete!");
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            await updateSupplier(id, modalData);
            alert("Supplier updated!");
            setShowModal(false);
            loadSupplier();
        } catch (err) {
            console.error(err.response?.data);
            alert("Update failed!");
        }
    };

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
    

    if (!supplier) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            {/* BACK BUTTON */}
            <Link
                to="/suppliers"
                className="text-blue-600 underline mb-4 inline-block"
            >
                ← Back to Suppliers
            </Link>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Supplier {supplier.companyName}</h1>

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

            {/* SUPPLIER INFO */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                {[
                    ["Company Name", supplier.companyName],
                    ["Contact Name", supplier.contactName],
                    ["Contact Title", supplier.contactTitle],
                    ["Address", supplier.address],
                    ["City", supplier.city],
                    ["Region", supplier.region],
                    ["Postal Code", supplier.postalCode],
                    ["Country", supplier.country],
                    ["Phone", supplier.phone],
                    ["Fax", supplier.fax],
                    ["Home Page", supplier.homePage],
                ].map(([label, value]) => (
                    <p key={label}>
                        <span className="font-semibold">{label}:</span> {value || "-"}
                    </p>
                ))}
            </div>

            {/* PRODUCT LIST */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Product List</h2>

            {supplier.products?.length ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        {[
                            "Product ID", "Name", "Price", "Stock"
                        ].map(h => (
                            <th key={h} className="px-3 py-2 border text-left">{h}</th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {supplier.products.map(products => (
                        <tr key={products.productId} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border">{products.productId}</td>
                            <td className="px-3 py-2 border">{products.productName}</td>
                            <td className="px-3 py-2 border">{products.unitPrice}</td>
                            <td className="px-3 py-2 border">{products.unitsInStock}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">This customer has no product.</p>
            )}

            {/* EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-auto">
                    <div className="bg-white w-[600px] rounded-lg shadow p-5">
                        <h2 className="text-xl font-bold mb-4">Edit Supplier</h2>
                        
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
                                ["fax", "Fax"],
                                ["homePage", "Home Page"],
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
