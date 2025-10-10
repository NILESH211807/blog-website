import React, { useCallback, useEffect, useRef } from 'react'
import { FaRegUserCircle, FaRegWindowRestore } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { MdModeEdit } from 'react-icons/md'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { LuBookmarkCheck } from 'react-icons/lu'

const HeaderMenu = ({ showMenu, setShowMenu, showMenuBtnRef, modalRef, user }) => {

    const menuRef = useRef(null);

    // handle outside click hide menu
    const handleOutSideClick = useCallback((e) => {
        if (menuRef.current &&
            !showMenuBtnRef.current.contains(e.target) &&
            !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    }, [showMenu]);

    useEffect(() => {
        window.addEventListener('mousedown', handleOutSideClick);
        return () => {
            window.removeEventListener('mousedown', handleOutSideClick);
        }
    }, []);

    const menuBtnClick = useCallback(() => {
        modalRef.current.showModal()
    }, [showMenu]);

    return (
        <>
            <div className='w-60 absolute right-0 top-12 shadow-xl border border-base-300 rounded-md bg-base-100 z-50' ref={menuRef}>
                <div className="border-b border-base-300 overflow-hidden">
                    <div className="flex items-center gap-3 sm:gap-5 py-2 px-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-base-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {user?.profileImage ? (
                                <img src={user?.profileImage} alt="Profile" className='w-full h-full rounded-full object-cover' />
                            ) : (
                                <FiUser size={20} className="sm:text-2xl" />
                            )}
                        </div>
                        <div className='flex flex-col overflow-hidden'>
                            <p className="font-semibold capitalize text-xs sm:text-sm truncate">{user?.name || user?.username || "@username"}</p>
                            {user?.email && (
                                <p className="font-semibold text-xs text-base-content/60 truncate">{user?.email}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full" onClick={() => setShowMenu(false)}>
                    <Link to='/new-story' className="flex items-center border-b border-base-300 px-4 py-3 gap-3 hover:bg-base-300">
                        <MdModeEdit size={18} />
                        <p className="text-sm font-medium">New Story</p>
                    </Link>


                    <Link to='/profile' className="flex items-center border-b border-base-300 px-4 py-3 gap-3 hover:bg-base-300">
                        <FaRegUserCircle size={18} />
                        <p className="text-sm font-medium">Profile</p>
                    </Link>

                    <Link to='/my-stories' className="flex items-center border-b border-base-300 px-4 py-3 gap-3 hover:bg-base-300">
                        <FaRegWindowRestore size={18} />
                        <p className="text-sm font-medium">My Stories</p>
                    </Link>

                    <button
                        type='button'
                        onClick={menuBtnClick}
                        className="w-full cursor-pointer flex items-center text-error px-4 py-3 gap-3  hover:bg-base-300">
                        <RiLogoutCircleRLine size={18} />
                        <p className="text-sm font-medium">Logout</p>
                    </button>
                </div>
            </div>
        </>
    )
}

export default HeaderMenu;
