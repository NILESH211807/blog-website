
import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import SearchUserInput from '../../components/admin-components/SearchUserInput';
import Confirm from '../../components/modal/Confirm';
import { useAdminBlockUnblockMutation, useGetAdminsQuery, useGetUsersQuery, useUserBlockUnblockMutation } from '../../features/api/apiSlice';
import MainLoader from '../../components/Loaders/MainLoader';
import { useSearchParams } from 'react-router-dom';
import ErrorComponent from '../../components/admin-components/Error';
import useDebounce from '../../hook/useDebounce';
import toast from 'react-hot-toast';
import CreateAdmin from '../../components/admin-components/CreateAdmin';
import { RiLockUnlockFill } from 'react-icons/ri';
import UpdateAdmin from '../../components/admin-components/UpdateAdmin';

const Admins = () => {

    const [showModel, setShowModel] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('query') || '';
    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, isError, error } = useGetAdminsQuery({
        page,
        search: debouncedSearch,
    });
    const admins = data?.data;
    const totalPages = data?.totalPages;

    const [
        adminBlockUnblock,
        { isLoading: adminBlockUnblockLoading },
    ] = useAdminBlockUnblockMutation();

    // Get user initials for avatar fallback
    const getUserInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    // block user handler
    const blockAdminhandler = async () => {
        const data = {
            userId: selectedUser?.id,
            active: !selectedUser?.active,
        };
        const result = await adminBlockUnblock(data);
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
                        <h1 className="text-xl sm:text-md capitalize font-bold text-base-content">Admins Management</h1>
                        <p className="text-base-content/80 text-sm mt-1 font-semibold">Manage all admins in the system</p>
                    </div>
                    <div className='w-full flex justify-between max-md:flex-col'>
                        <SearchUserInput title="Search Admins by email" />
                        <button onClick={() => setShowCreateAdmin(true)} type="button" className="px-5 max-w-38 h-[45px] text-sm cursor-pointer tracking-wide bg-primary text-white font-semibold rounded-sm max-md:mb-5">Create Admin</button>
                    </div>
                    <>
                        {/* admins Table */}
                        <div className="bg-base-100 rounded-sm border border-base-300 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-base-300">
                                    <thead className="bg-base-100">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Name</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Email</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Role</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Joined</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Status</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-base-content capitalize tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-base-100 divide-y divide-base-300">
                                        <>
                                            {admins?.length > 0 ? (
                                                admins?.map(admin => (
                                                    <tr key={admin?.id}>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                                    {admin?.profileImage ? (
                                                                        <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={admin?.profileImage} alt={admin?.name} />
                                                                    ) : (
                                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                                                            {getUserInitials(admin?.name)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-2 sm:ml-4">
                                                                    <div className="text-xs sm:text-sm font-medium text-base-content">{admin?.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="text-xs sm:text-sm text-base-content">{admin?.email}</div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="text-xs sm:text-sm text-base-content">{admin?.role}</div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                            <div className="text-xs sm:text-sm text-base-content">
                                                                {new Date(admin?.createdAt || admin?.updatedAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                                            <div className={`text-xs sm:text-sm ${admin.active ? 'text-green-500' : 'text-red-500'}`}>
                                                                {admin.active ? 'Active' : 'Blocked'}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <div className='tooltip' data-tip="Edit User">
                                                                    <button onClick={() => {
                                                                        setSelectedUser(admin);
                                                                        setShowEditModel(true);
                                                                    }} type='button' className="text-blue-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
                                                                        <FiEdit size={16} />
                                                                    </button>
                                                                </div>
                                                                {
                                                                    admin?.active ? (
                                                                        <div className="tooltip" data-tip="Block Admin">
                                                                            <button onClick={() => {
                                                                                setSelectedUser(admin);
                                                                                setShowModel(true);
                                                                            }} type='button' data-tooltip-id='block-user-tooltip' className="text-red-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
                                                                                <MdBlock size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="tooltip" data-tip="Unblock Admin">
                                                                            <button onClick={() => {
                                                                                setSelectedUser(admin);
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
                                                        No admin found matching your search criteria
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

            {
                showCreateAdmin && <CreateAdmin
                    showCreateAdmin={showCreateAdmin}
                    setShowCreateAdmin={setShowCreateAdmin}
                />
            }

            {showModel && <Confirm
                showModel={showModel}
                setShowModel={setShowModel}
                title="Confirmation Required"
                message={`Are you sure you want to ${selectedUser?.active ? 'block' : 'unblock'} ${selectedUser?.name}?`}
                className={`
                  ${selectedUser?.active ?
                        'text-white !hover:bg-red-600 !bg-red-500' :
                        'text-white !hover:bg-green-600 !bg-green-500'}
                `}
                onConfirm={blockAdminhandler}
                loading={adminBlockUnblockLoading}
                onCancel={() => {
                    setShowModel(false);
                    setSelectedUser("");
                }} />}

            <UpdateAdmin
                showEditModel={showEditModel}
                setShowEditModel={setShowEditModel}
                selectedUser={selectedUser}
            />

        </div>
    )
}

export default Admins
