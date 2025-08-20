import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react'; // Import router
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { useToast } from '@/Contexts/ToastContext';

export default function UsersIndex({ users }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: '',
    });
    const { success, error } = useToast();

    const openDeleteModal = (userId, userName) => {
        setDeleteModal({
            isOpen: true,
            userId,
            userName,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            userId: null,
            userName: '',
        });
    };

    const handleDelete = () => {
        if (deleteModal.userId) {
            // Gunakan router.delete() bukan Link.delete()
            router.delete(route('admin.users.destroy', deleteModal.userId), {
                onSuccess: () => {
                    success('User deleted successfully!');
                    closeDeleteModal();
                },
                onError: () => {
                    error('Failed to delete user.');
                    closeDeleteModal();
                },
                onFinish: () => {
                    // Optional: cleanup jika diperlukan
                }
            });
        } else {
            closeDeleteModal();
        }
    };

    return (
        <AdminLayout title="Manage Users">
            <Head title="Manage Users" />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
            />

            <div className="mx-auto px-1 lg:px-8">
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Manage Users</h2>
                        <Link 
                            href={route('admin.users.create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Add New User
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users && users.data && users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link 
                                                    href={route('admin.users.show', user.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                                >
                                                    View
                                                </Link>
                                                <Link 
                                                    href={route('admin.users.edit', user.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(user.id, user.name)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users && users.links && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {users.from} to {users.to} of {users.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}