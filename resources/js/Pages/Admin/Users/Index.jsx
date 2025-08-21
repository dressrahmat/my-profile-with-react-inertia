import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudLayout from '@/Components/CrudLayout';
import DataTable from '@/Components/DataTable';
import FilterSection from '@/Components/FilterSection';
import BulkActions from '@/Components/BulkActions';
import Pagination from '@/Components/Pagination';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { useToast } from '@/Contexts/ToastContext';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiPlus, FiX, FiUserPlus, FiChevronUp, FiChevronDown, FiDownload, FiMoreVertical } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';


export default function UsersIndex({ users, filters: initialFilters }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    isOpen: false,
    count: 0,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
  const [sortConfig, setSortConfig] = useState({
    key: initialFilters?.sort || 'created_at',
    direction: initialFilters?.direction || 'desc',
  });
  const { success, error } = useToast();

  // Debounced search implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialFilters?.search) {
        router.get(route('admin.users.index'), 
          { search: searchTerm, sort: sortConfig.key, direction: sortConfig.direction },
          { preserveState: true, replace: true }
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, sortConfig]);

  // Handle select/deselect all users
  useEffect(() => {
    if (selectAll && users && users.data) {
      setSelectedUsers(users.data.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [selectAll]);

  // Reset select all when users data changes
  useEffect(() => {
    setSelectAll(false);
    setSelectedUsers([]);
  }, [users]);

  // Handle individual user selection
  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const openDeleteModal = (userId, userName) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  };

  const openBulkDeleteModal = () => {
    setBulkDeleteModal({
      isOpen: true,
      count: selectedUsers.length,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: '',
    });
  };

  const closeBulkDeleteModal = () => {
    setBulkDeleteModal({
      isOpen: false,
      count: 0,
    });
  };

  const handleDelete = () => {
    if (deleteModal.userId) {
      router.delete(route('admin.users.destroy', deleteModal.userId), {
        onSuccess: () => {
          success('User deleted successfully!');
          closeDeleteModal();
        },
        onError: () => {
          error('Failed to delete user.');
          closeDeleteModal();
        }
      });
    } else {
      closeDeleteModal();
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      router.post(route('admin.users.bulk-destroy'), {
        ids: selectedUsers
      }, {
        onSuccess: () => {
          success(`${selectedUsers.length} user(s) deleted successfully!`);
          setSelectedUsers([]);
          setSelectAll(false);
          closeBulkDeleteModal();
        },
        onError: () => {
          error('Failed to delete selected users.');
          closeBulkDeleteModal();
        }
      });
    }
  };

  const handleExport = () => {
    if (selectedUsers.length > 0) {
      router.post(route('admin.users.export'), {
        ids: selectedUsers
      }, {
        onSuccess: () => {
          success('Export initiated successfully!');
        },
        onError: () => {
          error('Failed to export users.');
        }
      });
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortConfig({ key: 'created_at', direction: 'desc' });
    router.get(route('admin.users.index'), {}, { preserveState: true });
  };

  // Fungsi untuk mendapatkan ikon sort yang sesuai
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FiChevronUp className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FiChevronUp className="ml-1 h-4 w-4" /> 
      : <FiChevronDown className="ml-1 h-4 w-4" />;
  };

  // Kolom untuk DataTable
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      onSort: handleSort,
      sortIcon: getSortIcon('name'),
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="font-medium text-indigo-800 dark:text-indigo-100">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      onSort: handleSort,
      sortIcon: getSortIcon('email'),
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
      )
    },
    {
      key: 'created_at',
      label: 'Joined Date',
      sortable: true,
      onSort: handleSort,
      sortIcon: getSortIcon('created_at'),
      render: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    }
  ];

  // Empty state component
  const emptyState = (
    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
      <FiUserPlus className="h-12 w-12 mb-3 opacity-50" />
      <p className="text-lg font-medium">No users found</p>
      <p className="mt-1 text-sm">Get started by creating a new user</p>
      <div className="mt-6">
        <Link href={route('admin.users.create')}>
          <PrimaryButton className="flex items-center">
            <FiPlus className="mr-2 h-5 w-5" />
            Add New User
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );

  // Row actions
  const rowActions = (user) => (
    <div className="flex justify-end space-x-2">
      <Link 
        href={route('admin.users.show', user.id)}
        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
        title="View user"
      >
        <FiEye className="h-5 w-5" />
      </Link>
      <Link 
        href={route('admin.users.edit', user.id)}
        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
        title="Edit user"
      >
        <FiEdit className="h-5 w-5" />
      </Link>
      <button
        onClick={() => openDeleteModal(user.id, user.name)}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
        title="Delete user"
      >
        <FiTrash2 className="h-5 w-5" />
      </button>
    </div>
  );

  // Create button
  const createButton = (
    <Link href={route('admin.users.create')}>
      <PrimaryButton className="flex items-center">
        <FiUserPlus className="mr-2 h-5 w-5" />
        Add User
      </PrimaryButton>
    </Link>
  );

  return (
    <AdminLayout title="Manage Users">
      <Head title="Manage Users" />

      {/* Confirmation Modal for single delete */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
      />

      {/* Confirmation Modal for bulk delete */}
      <ConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={handleBulkDelete}
        title="Confirm Bulk Delete"
        message={`Are you sure you want to delete ${bulkDeleteModal.count} selected user(s)? This action cannot be undone.`}
        confirmText={`Delete ${bulkDeleteModal.count} Users`}
        cancelText="Cancel"
      />

      <CrudLayout
        title="User Management"
        description="Manage all system users, their roles and permissions"
        createButton={createButton}
        filters={
          <FilterSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearFilters={clearFilters}
          />
        }
      >
        {/* Flash Messages */}
        {flash.success && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {flash.success}
                </p>
              </div>
            </div>
          </div>
        )}

        {flash.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {flash.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedUsers.length}
          onBulkDelete={openBulkDeleteModal}
          onBulkExport={handleExport}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users.data}
          selectedItems={selectedUsers}
          onSelectItem={handleUserSelection}
          onSelectAll={() => setSelectAll(!selectAll)}
          selectAll={selectAll}
          emptyState={emptyState}
          rowActions={rowActions}
          keyField="id"
        />

        {/* Pagination */}
        <Pagination data={users} />
      </CrudLayout>
    </AdminLayout>
  );
}