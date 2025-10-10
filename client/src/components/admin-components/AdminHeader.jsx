import React, { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiUser, FiSettings, FiLogOut, FiBell, FiX, FiMenu, FiHome, FiUsers, FiFileText, FiUserPlus } from 'react-icons/fi'
import ThemeToggle from '../ThemeToggle'
import AdminSidebar from './AdminSidebar'
import AdminProfileDropdown from './AdminProfileDropdown'
import { useSelector } from 'react-redux'

const AdminHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const profileRef = useRef(null)
    const { admin } = useSelector((state) => state.adminAuth);

    const [isOpen, setIsOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (

        <>
            <header className="w-full bg-base-100/80 backdrop-blur-md h-16 border-b border-base-300 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
                <button
                    className="p-2 rounded-full hidden max-xl:block cursor-pointer hover:bg-base-300"
                    onClick={toggleSidebar}>{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div className="flex items-center max-xl:absolute max-xl:left-1/2 max-xl:-translate-x-1/2">
                    <Link to="/admin" className="text-xl font-bold">
                        Admin Portal
                    </Link>
                </div>

                {/* Right side - Profile and notifications */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Theme toggle */}
                    <ThemeToggle />
                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            ref={profileRef}
                            className="flex items-center gap-2 hover:bg-base-200 py-2 px-3 rounded-full cursor-pointer"
                            onClick={() => setShowDropdown(!showDropdown)}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300">
                                {admin?.profileImage ? (
                                    <img
                                        src={admin?.profileImage}
                                        alt="Admin"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                                        <FiUser size={16} />
                                    </div>)}
                            </div>
                            <span className="font-medium hidden md:block">{admin?.name?.split(' ')[0]}</span>
                        </button>
                        {/* Dropdown menu */}
                        {showDropdown && (
                            <AdminProfileDropdown admin={admin} setShowDropdown={setShowDropdown} profileRef={profileRef} />
                        )}
                    </div>
                </div>
            </header>
            {/* Sidebar */}
            <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}

export default AdminHeader
