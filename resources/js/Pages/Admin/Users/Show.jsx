import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ShowUser({ user }) {
    return (
        <AdminLayout title="User Details">
            <Head title="User Details" />

            <div className="mx-auto px-2 lg:px-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">User Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                            <p className="mt-1 text-lg font-medium">{user.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="mt-1 text-lg font-medium">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</label>
                            <p className="mt-1 text-lg font-medium">
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                            <p className="mt-1 text-lg font-medium">#{user.id}</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <Link
                            href={route('admin.users.index')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Back to List
                        </Link>
                        <Link
                            href={route('admin.users.edit', user.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Edit User
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}