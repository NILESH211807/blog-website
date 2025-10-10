
import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import SearchUserInput from '../../components/admin-components/SearchUserInput';
import Confirm from '../../components/modal/Confirm';
import UserEditModal from '../../components/modal/UserEditModal';
import { useGetUsersQuery, useUserBlockUnblockMutation } from '../../features/api/apiSlice';
import MainLoader from '../../components/Loaders/MainLoader';
import { useSearchParams } from 'react-router-dom';
import ErrorComponent from '../../components/admin-components/Error';
import useDebounce from '../../hook/useDebounce';
import toast from 'react-hot-toast';
import { RiLockUnlockFill } from 'react-icons/ri';


const formattedDate = (date) => {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

const AdminUsers = () => {
    const [showModel, setShowModel] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('query') || '';
    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, isError, error, isFetching } = useGetUsersQuery({
        page,
        search: debouncedSearch,
    });
    const users = data?.data;
    const totalPages = data?.totalPages;


    // useUserBlockUnblockMutation
    const [
        userBlockUnblock,
        { isLoading: userBlockUnblockLoading },
    ] = useUserBlockUnblockMutation();


    // Get user initials for avatar fallback
    const getUserInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }


    // block user handler
    const blockUserhandler = async () => {
        const data = {
            userId: selectedUser?.id,
            active: !selectedUser?.active,
        };
        const result = await userBlockUnblock(data);
        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
        }
        setShowModel(false);
        setSelectedUser("");
    }



    if (isLoading) return <MainLoader />

    if (isError) return <ErrorComponent error={error} />

    return (
        <div className="w-full h-full">
            <div className="flex flex-col md:flex-row">
                <div className="min-h-screen flex-1 xl:ml-64 p-3 sm:p-4 md:p-6 overflow-auto">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-md capitalize font-bold text-base-content">Users Management</h1>
                        <p className="text-base-content/80 text-sm mt-1 font-semibold">Manage all users in the system</p>
                    </div>
                    {/* Search and Filter */}
                    <SearchUserInput />
                    <>
                        {/* Users Table */}
                        <div className="bg-base-100 rounded-sm border border-base-300 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-base-300">
                                    <thead className="bg-base-100">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">User</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Email</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Joined</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Status</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-base-100 divide-y divide-base-300">
                                        <>
                                            {users?.length > 0 ? (
                                                users?.map(user => (
                                                    <tr key={user?.id}>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                                    {user?.profileImage ? (
                                                                        <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user?.profileImage} alt={user?.username} />
                                                                    ) : (
                                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                                                            {getUserInitials(user?.name)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-2 sm:ml-4">
                                                                    <div className="text-xs sm:text-sm font-medium text-base-content">{user?.username}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="text-xs sm:text-sm text-base-content">{user?.email}</div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="text-xs sm:text-sm text-base-content">
                                                                {new Date(user?.createdAt || user?.updatedAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                                            <div className={`text-xs sm:text-sm ${user.active ? 'text-green-500' : 'text-red-500'}`}>
                                                                {user.active ? 'Active' : 'Blocked'}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <div className='tooltip' data-tip="Edit User">
                                                                    <button onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setShowEditModel(true);
                                                                    }} type='button' className="text-blue-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
                                                                        <FiEdit size={16} />
                                                                    </button>
                                                                </div>
                                                                {
                                                                    user?.active ? (
                                                                        <div className="tooltip" data-tip="Block User">
                                                                            <button onClick={() => {
                                                                                setSelectedUser(user);
                                                                                setShowModel(true);
                                                                            }} type='button' data-tooltip-id='block-user-tooltip' className="text-red-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
                                                                                <MdBlock size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="tooltip" data-tip="Unblock User">
                                                                            <button onClick={() => {
                                                                                setSelectedUser(user);
                                                                                setShowModel(true);
                                                                            }} type='button' data-tooltip-id='block-user-tooltip' className="text-green-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
                                                                                <RiLockUnlockFill size={16} />
                                                                            </button>
                                                                        </div>
                                                                    )

                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                                                        No users found matching your search criteria
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    </tbody>
                                </table>
                            </div>
                        </div>




                        <div className="flex justify-center mt-4 sm:mt-6">
                            <div className="join">
                                <button type='button'
                                    disabled={page == 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="join-item btn">«</button>
                                <button type='button' className="join-item btn">Page {page}</button>
                                <button type='button' disabled={page == totalPages}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="join-item btn">»</button>
                            </div>
                        </div>
                    </>
                </div>
            </div>

            <UserEditModal
                showEditModel={showEditModel}
                setShowEditModel={setShowEditModel}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser} />

            <Confirm
                showModel={showModel}
                setShowModel={setShowModel}
                title="Confirmation Required"
                message={`Are you sure you want to ${selectedUser?.active ? 'block' : 'unblock'} ${selectedUser?.username}?`}
                className={`
                  ${selectedUser?.active ?
                        'text-white !hover:bg-red-600 !bg-red-500' :
                        'text-white !hover:bg-green-600 !bg-green-500'}
                `}
                onConfirm={blockUserhandler}
                loading={userBlockUnblockLoading}
                onCancel={() => {
                    setShowModel(false);
                    setSelectedUser("");
                }} />
        </div>
    )
}

export default AdminUsers