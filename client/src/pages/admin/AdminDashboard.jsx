import React, { useState } from 'react';
import { FiUsers, FiFileText, FiUserCheck, FiUserX, FiEdit } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Confirm from '../../components/modal/Confirm';
import { useGetDashboardStatsQuery, useUserBlockUnblockMutation } from '../../features/api/apiSlice';
import MainLoader from '../../components/Loaders/MainLoader';
import toast from 'react-hot-toast';
import UserEditModal from '../../components/modal/UserEditModal';
import { RiLockUnlockFill } from 'react-icons/ri';

const StatCard = ({ title, value, icon, color }) => (
   <div className="bg-base-100 rounded-md border border-base-300 px-3 sm:px-4 py-4 sm:py-6 flex items-center">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${color}`}>
         {icon}
      </div>
      <div className="sm:ml-6 ml-5">
         <p className="text-lg sm:text-2xl font-bold">{value?.toLocaleString()}</p>
         <h3 className="text-gray-500 capitalize sm:text-sm font-medium">{title}</h3>
      </div>
   </div>
);

const AdminDashboard = () => {
   const [showModel, setShowModel] = useState(false);
   const [selectedUser, setSelectedUser] = useState("");
   const [showEditModel, setShowEditModel] = useState(false);


   const { data, isLoading, isError, error } = useGetDashboardStatsQuery();
   const dashboardStats = data?.data;

   // userBlockUnblock 
   const [
      userBlockUnblock,
      { isLoading: userBlockUnblockLoading },
   ] = useUserBlockUnblockMutation();

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


   if (isLoading) {
      return (
         <MainLoader />
      );
   }

   if (isError) {
      return (
         <div className="w-full h-screen flex items-center justify-center">
            <p className='text-red-500 text-center mt-10'>
               {error?.message || error?.data?.message || 'Failed to load dashboard data'}
            </p>
         </div>
      );
   }

   return (
      <div className="w-full h-full">
         <div className="flex flex-col md:flex-row">
            <div className="flex-1 xl:ml-64 p-3 sm:p-4 md:p-6 overflow-auto">
               <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-md capitalize font-bold text-base-content">Dashboard</h1>
                  <p className="text-base-content/80 text-sm mt-1 font-semibold">Manage all users in the system</p>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8 max-md:space-2">
                  <StatCard
                     title="Total Users"
                     value={dashboardStats?.totalUsers}
                     icon={<FiUsers className="text-white text-lg sm:text-xl" />}
                     color="bg-blue-500"
                  />
                  <StatCard
                     title="Active Users"
                     value={dashboardStats?.activeUsers}
                     icon={<FiUserCheck className="text-white text-lg sm:text-xl" />}
                     color="bg-green-500"
                  />
                  <StatCard
                     title="Blocked Users"
                     value={dashboardStats?.blockedUsers}
                     icon={<FiUserX className="text-white text-lg sm:text-xl" />}
                     color="bg-red-500"
                  />
                  <StatCard
                     title="Total Blogs"
                     value={dashboardStats?.totalBlogs}
                     icon={<FiFileText className="text-white text-lg sm:text-xl" />}
                     color="bg-purple-500"
                  />
               </div>

               {/* Recent Users */}
               <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-base-300">
                     <h2 className="text-base sm:text-lg font-semibold text-base-content">Recently Joined Users</h2>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-base-300">
                        <thead className="bg-base-200">
                           <tr>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold">User</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold">Email</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold">Joined</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold">Status</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="bg-base-100 divide-y divide-base-300">
                           {dashboardStats?.recentJoinedUsers?.map(user => (
                              <tr key={user?.id}>
                                 <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                       <img
                                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`}
                                          alt={user?.name}
                                       />
                                       <div className="ml-2 sm:ml-4 text-xs sm:text-sm font-medium">{user?.username}</div>
                                    </div>
                                 </td>
                                 <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">{user?.email}</td>
                                 <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                                    {new Date(user?.createdAt || user?.updatedAt).toLocaleDateString()}
                                 </td>
                                 <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                    <span className={user.active ? 'text-green-500' : 'text-red-500'}>
                                       {user.active ? 'active' : 'blocked'}
                                    </span>
                                 </td>
                                 <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                    <div className="flex space-x-2">
                                       <div className="tooltip" data-tip="Edit User">
                                          <button
                                             onClick={() => {
                                                setSelectedUser(user);
                                                setShowEditModel(true);
                                             }}
                                             type='button'
                                             className="text-blue-600 cursor-pointer hover:bg-base-300 p-2 rounded-sm">
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
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <div className="bg-base-200 px-3 sm:px-4 py-2 border-t border-base-300 text-right">
                     <Link to="/admin/users" className="text-primary hover:text-primary-focus text-xs sm:text-sm font-medium">
                        View all users →
                     </Link>
                  </div>
               </div>
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
            onCancel={() => {
               setShowModel(false);
               setSelectedUser("");
            }}
            loading={userBlockUnblockLoading}
         />
      </div>
   );
};

export default AdminDashboard;
