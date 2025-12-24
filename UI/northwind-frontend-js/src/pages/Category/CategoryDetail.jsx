import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { handleBackendValidation } from "../../components/handleBackendValidation";
import {
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../../api/categoryApi";


export default function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [errors, setErrors] = useState({});


    const loadCategoryDetail = async () => {
        try {
            const res = await getCategoryById(id);
            setCategory(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCategoryDetail();
    }, []);

    const openEditModal = () => {
        setErrors({});
        setModalData({
            categoryId: category.categoryId,
            categoryName: category.categoryName || "",
            description: category.description || "",
        });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            await updateCategory(id, modalData);
            alert("Category updated!");
            setShowModal(false);
            loadCategoryDetail();
        } catch (err) {
            handleBackendValidation(err, setErrors, navigate, "Update category failed");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await deleteCategory(id);
            alert("Category deleted");
            navigate("/categories");
        } catch (err) {
            handleBackendValidation(err, setErrors, navigate, "Delete category failed");
        }
    };

    if (!category) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            {/* BACK BUTTON */}
            <Link
                to="/categories"
                className="text-blue-600 underline mb-4 inline-block">
                ← Back to Categories
            </Link>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Category #{category.categoryId}</h1>

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

            {/* CATEGORY INFO */}
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                {[
                    ["Category ID", category.categoryId],
                    ["Category Name", category.categoryName],
                    ["Description", category.description],
                ].map(([label, value]) => (
                    <p key={label}>
                        <span className="font-semibold">{label}:</span> {value ?? "-"}
                    </p>
                ))}
            </div>

            {/* PRODUCT LIST */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Product List</h2>

            {category.products?.length ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        {["Product ID", "Name", "Price", "Stock"].map(h => (
                            <th key={h} className="px-3 py-2 border text-left">
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {category.products.map(product => (
                        <tr key={product.productId} className="hover:bg-gray-50">
                            {/* Product ID */}
                            <td className="px-3 py-2 border">
                                <Link
                                    to={`/products/${product.productId}`}
                                    className="text-cyan-600 hover:text-cyan-800 cursor-pointer font-semibold">
                                    {product.productId}
                                </Link>
                            </td>

                            {/* Product Name */}
                            <td className="px-3 py-2 border">
                                <Link
                                    to={`/products/${product.productId}`}
                                    className="text-cyan-600 hover:text-cyan-800 cursor-pointer font-semibold">
                                    {product.productName}
                                </Link>
                            </td>

                            <td className="px-3 py-2 border">{product.unitPrice}</td>
                            <td className="px-3 py-2 border">{product.unitsInStock}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                // <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-sm">
                //     <thead className="bg-gray-100">
                //     <tr>
                //         {[
                //             "Product ID", "Name", "Price", "Stock"
                //         ].map(h => (
                //             <th key={h} className="px-3 py-2 border text-left">{h}</th>
                //         ))}
                //     </tr>
                //     </thead>
                //
                //     <tbody>
                //     {category.products.map(products => (
                //         <tr key={products.productId} className="hover:bg-gray-50">
                //             <td className="px-3 py-2 border">{products.productId}</td>
                //             <td className="px-3 py-2 border">{products.productName}</td>
                //             <td className="px-3 py-2 border">{products.unitPrice}</td>
                //             <td className="px-3 py-2 border">{products.unitsInStock}</td>
                //         </tr>
                //     ))}
                //     </tbody>
                // </table>
            ) : (
                <p className="text-gray-600">This category has no product.</p>
            )}

            {/* EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-auto">
                    <div className="bg-white w-[600px] rounded-lg shadow p-5">
                        <h2 className="text-xl font-bold mb-4">Edit Category</h2>

                        <div className="grid gap-4">
                            {[
                                ["categoryName", "Category Name"],
                                ["description", "Description"]
                            ].map(([key, label]) => (
                                <div key={key}>
                                    <label className="font-medium">{label}</label>
                                    <input
                                        type="text"
                                        className="w-full border px-2 py-1 rounded mt-1"
                                        value={modalData[key] || ""}
                                        onChange={(e) =>
                                            setModalData(prev => ({ ...prev, [key]: e.target.value }))
                                        }/>

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