import { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, Search, X, Save, Square, CheckSquare } from "lucide-react";
import { getCategory, getSuppliers, getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../services/api";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table';


export default function Product() {
    const [products, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const loadCategories = () => getCategory();
    const loadSuppliers = () => getSuppliers();

    const [formData, setFormData] = useState({
        productId: 0,
        productName: "",
        supplierId: null,
        categoryId: null,
        quantityPerUnit: "",
        unitPrice: 0,
        unitsInStock: 0,
        unitsOnOrder: 0,
        reorderLevel: 0,
        discontinued: false
    });
    
    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await getProducts();
            setProducts(res.data.data);
        } catch (err) {
            console.error("Load failed:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProducts();
        loadSuppliers().then(res => setSuppliers(res.data.data));
        loadCategories().then(res => setCategories(res.data.data));
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'productId',
                header: 'ID',
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-800">
                        {row.original.productId}
                    </span>
                )
            },
            { accessorKey: 'productName', header: 'Product Name', size: 250 },
            { accessorKey: 'companyName', header: 'Supplier', size: 180 },
            { accessorKey: 'categoryName', header: 'Category', size: 180 },
            { accessorKey: 'quantityPerUnit', header: 'Quantity / Unit', size: 180 },
            { accessorKey: 'unitPrice', header: 'Unit Price', size: 180 },
            { accessorKey: 'unitsInStock', header: 'In Stock', size: 180 },
            { accessorKey: 'unitsOnOrder', header: 'On Order', size: 180 },
            { accessorKey: 'reorderLevel', header: 'Reorder Level', size: 180 },
            {
                accessorKey: "discontinued",
                header: "Discontinued",
                size: 120,
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        {row.original.discontinued ? (
                            <CheckSquare className="w-6 h-6 text-green-600" />
                        ) : (
                            <Square className="w-6 h-6 text-gray-600" />
                        )}
                    </div>
                )
            },
            {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit(row.original.productId)}
                            className="text-blue-600 hover:text-blue-800">
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(row.original.productId)}
                            className="text-red-600 hover:text-red-800">
                            Delete
                        </button>
                    </div>
                )
            }
        ],
        []
    );
    
    const table = useReactTable({
        data: products,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });
    
    const openCreate = () => {
        setIsEdit(false);
        setFormData({
            productId: 0,
            productName: '',
            supplierId: null,
            categoryId: null,
            quantityPerUnit: '',
            unitPrice: 0,
            unitsInStock: 0,
            unitsOnOrder: 0,
            reorderLevel: 0,
            discontinued: false,
        });
        setShowModal(true);
    };
    
    const openEdit = async (id) => {
        const res = await getProductById(id);
        setFormData(res.data.data);
        setIsEdit(true);
        setShowModal(true);
    };
    
    const handleSave = async () => {
        if (!formData.productName) {
            alert("Product name is required");
            return;
        }

        try {
            if (isEdit) {
                await updateProduct(formData.productId, formData);
                alert("Product Updated!");
            } else {
                await createProduct(formData);
                alert("Product Created!");
            }
            setShowModal(false);
            loadProducts();
        } catch (err) {
            console.error("Save failed:", err.response?.data || err);
            alert("Save failed");
        }
    };
    
    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };

    if (loading) return <div className="flex justify-center py-32 text-xl">Loading products...</div>
    
    return (
        <div>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">
                        Total: <strong className="text-cyan-600">{products.length}</strong> items
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadProducts}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl"
                        placeholder="Search products..."/>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((header) => (
                                <th key={header.id} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-t hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
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
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700">
                    Showing page {table.getState().pagination.pageIndex + 1}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50">
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-4 border-b">
                            <h2 className="text-2xl font-bold">
                                {isEdit ? "Edit Product" : "Create Product"}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* FORM */}
                        {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">*/}
                        <form className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Product Name</label>
                                    <input
                                        value={formData.productName}
                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Supplier */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Supplier</label>
                                    <select
                                        value={formData.supplierId ?? ""}
                                        onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg">
                                        <option value="">-- Select Supplier --</option>
                                        {suppliers.map(s => (
                                            <option key={s.supplierId} value={s.supplierId}>
                                                {s.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
    
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Category</label>
                                    <select
                                        value={formData.categoryId ?? ""}
                                        onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg">
                                        <option value="">-- Select Category --</option>
                                        {categories.map(c => (
                                            <option key={c.categoryId} value={c.categoryId}>
                                                {c.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
    
                                {/* Quantity Per Unit */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Quantity Per Unit</label>
                                    <input
                                        value={formData.quantityPerUnit ?? ""}
                                        onChange={(e) => setFormData({ ...formData, quantityPerUnit: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Unit Price */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Unit Price</label>
                                    <input
                                        type="number"
                                        value={formData.unitPrice}
                                        onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Units In Stock */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Units In Stock</label>
                                    <input
                                        type="number"
                                        value={formData.unitsInStock}
                                        onChange={(e) => setFormData({ ...formData, unitsInStock: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Units On Order */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Units On Order</label>
                                    <input
                                        type="number"
                                        value={formData.unitsOnOrder}
                                        onChange={(e) => setFormData({ ...formData, unitsOnOrder: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Reorder Level */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Reorder Level</label>
                                    <input
                                        type="number"
                                        value={formData.reorderLevel}
                                        onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"/>
                                </div>
    
                                {/* Discontinued */}
                                <div className="flex items-center gap-2 mt-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.discontinued}
                                        onChange={(e) => setFormData({ ...formData, discontinued: e.target.checked })}/>
                                    <label className="font-semibold">Discontinued</label>
                                </div>
                            </div>
                        </form>
                        {/* BUTTON */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {isEdit ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}