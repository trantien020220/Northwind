import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { getUsers, updateUserRole, deleteUser } from "../../api/userApi";
import { handleBackendValidation } from "../../components/handleBackendValidation";
import { useAuth } from '../../context/AuthContext'

export default function Users() {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const { user } = useAuth();
    const isSuperAdmin = user?.isSuperAdmin === true;

    const loadUsers = async () => {
        const res = await getUsers();
        setUsers(res.data.data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChangeRole = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole)
            alert("Role updated")
            loadUsers()
        } catch (err) {
            handleBackendValidation(err, setErrors, "Update role failed")
        }
    };


    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await deleteUser(id)
                if (res.data.success) {
                    alert('User deleted successfully')
                    loadUsers()
                }
            } catch (err) {
                const msg = err.response?.data?.message || 'Error deleting user'
                alert(msg)
            }
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            <table className="w-full border bg-white">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-center">Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.map(u => (
                    <tr key={u.id} className="border-t">
                        <td className="px-6 py-4">
                            <Link to={`/profile/${u.id}`} className="text-cyan-600 hover:text-cyan-800 font-medium underline">
                                {u.userName}
                            </Link>
                        </td>
                        <td className="p-3">{u.email}</td>

                        <td className="p-3">
                            <select
                                disabled={!isSuperAdmin}
                                value={u.roles[0]}
                                onChange={e =>
                                    handleChangeRole(u.id, e.target.value)
                                }
                                className="border rounded px-2 py-1 disabled:bg-gray-100"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </td>

                        <td className="p-3 text-center">
                            <button
                                onClick={() => handleDelete(u.id)}
                                disabled={u.userName === 'admin'}
                                title={u.userName === 'admin' ? 'Cannot delete SuperAdmin' : 'Delete'}
                                className="text-red-600 hover:text-red-800 disabled:opacity-40"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {!isSuperAdmin && (
                <p className="mt-4 text-sm text-gray-500">
                    * Only admin can change roles or delete users
                </p>
            )}
        </div>
    );
}
