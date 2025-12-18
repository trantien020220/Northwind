import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import {
  getProductById,
  updateProduct,
  deleteProduct
} from "../../api/productApi";
import { getSuppliers } from "../../api/supplierApi";
import { getCategory } from "../../api/categoryApi";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const loadProductDetail = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProductDetail();
    getSuppliers().then(res => setSuppliers(res.data.data));
    getCategory().then(res => setCategories(res.data.data));
  }, []);

  const openEditModal = () => {
    setErrors({});
    setFormData({
      productId: product.productId,
      productName: product.productName || "",
      supplierId: product.supplierId ?? null,
      categoryId: product.categoryId ?? null,
      quantityPerUnit: product.quantityPerUnit || "",
      unitPrice: product.unitPrice ?? null,
      unitsInStock: product.unitsInStock ?? null,
      unitsOnOrder: product.unitsOnOrder ?? null,
      reorderLevel: product.reorderLevel ?? null,
      discontinued: product.discontinued ?? false
    });
    setShowModal(true);
  };

  const handleBackendValidation = (err) => {
    const responseErrors = err.response?.data?.errors;
    if (!responseErrors) {
      alert("Save failed");
      return;
    }

    const formattedErrors = {};
    Object.keys(responseErrors).forEach(key => {
      formattedErrors[key.charAt(0).toLowerCase() + key.slice(1)] =
        responseErrors[key][0];
    });

    setErrors(formattedErrors);
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(id, formData);
      alert("Product updated!");
      setShowModal(false);
      loadProductDetail();
    } catch (err) {
      handleBackendValidation(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      alert("Product deleted");
      navigate("/products");
    } catch (err) {
      handleBackendValidation(err);
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* BACK */}
      <Link to="/products" className="text-blue-600 underline">
        ← Back to Products
      </Link>

      {/* HEADER */}
      <div className="flex justify-between items-center mt-4 mb-8">
        <h1 className="text-3xl font-bold">{product.productName}</h1>

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

      {/* PRODUCT INFO */}
      <div className="bg-white shadow rounded-lg p-4 border">
        {[
          ["Product ID", product.productId],
          ["Product Name", product.productName],
          ["Supplier", product.companyName],
          ["Category", product.categoryName],
          ["Quantity / Unit", product.quantityPerUnit],
          ["Unit Price", product.unitPrice],
          ["Units In Stock", product.unitsInStock],
          ["Units On Order", product.unitsOnOrder],
          ["Reorder Level", product.reorderLevel],
          ["Discontinued", product.discontinued ? "Yes" : "No"]
        ].map(([label, value]) => (
          <p key={label}>
            <span className="font-semibold">{label}:</span> {value ?? "-"}
          </p>
        ))}
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div
            className="bg-white w-[700px] rounded-lg shadow p-6"
            onClick={(e) => e.stopPropagation()}>

            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                    <label className="font-medium">Product Name</label>
                    <input
                    value={formData.productName}
                    onChange={(e) =>
                        setFormData({ ...formData, productName: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded mt-1"/>
                    {errors.productName && (
                    <p className="text-red-500 text-sm">{errors.productName}</p>
                    )}
                </div>

                {/* Supplier */}
                <div>
                    <label className="font-medium">Supplier</label>
                    <select
                    value={formData.supplierId ?? ""}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        supplierId: e.target.value ? Number(e.target.value) : null
                        })
                    }
                    className="w-full border px-2 py-1 rounded mt-1">
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map(s => (
                        <option key={s.supplierId} value={s.supplierId}>
                        {s.companyName}
                        </option>
                    ))}
                    </select>
                    {errors.supplierId && (
                    <p className="text-red-500 text-sm">{errors.supplierId}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="font-medium">Category</label>
                    <select
                    value={formData.categoryId ?? ""}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        categoryId: e.target.value ? Number(e.target.value) : null
                        })
                    }
                    className="w-full border px-2 py-1 rounded mt-1">
                    <option value="">-- Select Category --</option>
                    {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                        </option>
                    ))}
                    </select>
                    {errors.categoryId && (
                    <p className="text-red-500 text-sm">{errors.categoryId}</p>
                    )}
                </div>

                    {/* Quantity Per Unit */}
                <div>
                    <label className="font-medium">Quantity Per Unit</label>
                    <input
                        value={formData.quantityPerUnit}
                        onChange={(e) =>
                        setFormData({ ...formData, quantityPerUnit: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded mt-1"
                    />
                    {errors.quantityPerUnit && (
                        <p className="text-red-500 text-sm">{errors.quantityPerUnit}</p>
                    )}
                </div>


            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-cyan-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
