import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, Search, X, Save } from "lucide-react";
import {
    getCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../api/categoryApi.js";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table";


export default function Category() {
    const [categories, setCategories] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        categoryId: 0,
        categoryName: "",
        description: "",
    });

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await getCategory();
            setCategories(res.data.data);
        } catch (err) {
            console.error("Load failed:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCategories();
    }, []);
    
    const openCreate = () => {
        setIsEdit(false);
        setErrors({});
        setFormData({
            categoryId: 0,
            categoryName: "",
            description: "",
        });
        setShowModal(true);
    };

    const openEdit = async (id) => {
        setErrors({});
        const res = await getCategoryById(id);
        setFormData(res.data.data);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await updateCategory(formData.categoryId, formData);
                alert("Updated!");
            } else {
                await createCategory(formData);
                alert("Created!");
            }
            setShowModal(false);
            loadCategories();
        } catch (err) {
            handleBackendValidation(err);
        }
    };
    
    const handleDelete = async (id) => {
        if (!confirm("Delete this category?")) return;

        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err) {
            handleBackendValidation(err);
        }
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

    const columns = useMemo(
        () => [
            {
                accessorKey: "categoryId",
                header: "ID",
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-800">
                        {row.original.categoryId}
                    </span>
                ),
            },
            { accessorKey: "categoryName", header: "Category Name", size: 250 },
            { accessorKey: "description", header: "Description", size: 300 },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit(row.original.categoryId)}
                            className="text-blue-600 hover:text-blue-800">
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.categoryId)}
                            className="text-red-600 hover:text-red-800">
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: categories,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (loading) return <div className="flex justify-center py-32 text-xl">Loading categories...</div>

    return (
        <div>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">
                        Total:{" "}
                        <strong className="text-cyan-600">
                            {categories.length}
                        </strong>{" "}
                        categories
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadCategories}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                        <Plus className="w-4 h-4" /> Add Category
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
                        placeholder="Search categories..."/>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-t hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 text-sm">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
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
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-4 border-b">
                            <h2 className="text-2xl font-bold">
                                {isEdit ? "Edit Category" : "Create Category"}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* FORM */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Category Name
                                </label>
                                <input
                                    value={formData.categoryName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoryName: e.target.value,
                                        }) || setErrors({ ...errors, categoryName: null })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"/>
                                {errors.categoryName && (
                                    <p className="text-red-500 text-sm">{errors.categoryName}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description ?? ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}/>
                            </div>
                        </div>

                        {/* FOOTER */}
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
