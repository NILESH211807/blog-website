import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../features/api/apiSlice';
import { logout as adminLogout } from '../../features/adminAuthSlice';

const AdminProfileDropdown = ({ admin, setShowDropdown, profileRef }) => {

    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle outside click to close dropdown
    const handleOutsideClick = (e) => {
        if (
            dropdownRef.current &&
            profileRef.current &&
            !dropdownRef.current.contains(e.target) &&
            !profileRef.current.contains(e.target)
        ) {
            setShowDropdown(false)
        }
    }

    // Add event listener for outside clicks
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, []);


    const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

    // handle logout
    const handleLogout = async () => {

        const result = await logout();

        if (result.error) {
            toast.error(result.error.data.message);
            return;
        }
        if (result.data.success) {
            toast.success('Logout successful');
            dispatch(adminLogout());
            navigate('/admin/login', { replace: true });
        }
    }


    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-12 w-56 bg-base-100 border border-base-300 rounded-md shadow-lg z-20">
            <div className="p-3 border-b border-base-200">
                <p className="font-semibold">{admin?.name}</p>
                <p className="text-sm text-base-content/70">{admin?.email}</p>
            </div>
            <div className="w-full">
                <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-base-300 border-t border-base-300 w-full text-left"
                    onClick={() => setShowDropdown(false)}>
                    <FiUser size={17} />
                    <span className='font-medium text-md'>My Profile</span>
                </Link>
                <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-base-300 border-t border-base-300 w-full text-left"
                    onClick={() => setShowDropdown(false)}>
                    <FiSettings size={16} />
                    <span className='font-medium text-md'>Settings</span>
                </Link>
                <button
                    className="flex items-center gap-3 px-4 border-t border-base-300 py-3 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white cursor-pointer w-full text-left rounded-b-md"
                    onClick={handleLogout}>
                    <FiLogOut size={16} />
                    <span className='font-medium text-md'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminProfileDropdown
