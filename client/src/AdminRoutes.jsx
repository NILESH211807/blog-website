import React, { Suspense, useEffect, useState } from 'react';
import AdminHeader from './components/admin-components/AdminHeader';
import Loader from './components/Loader';
import { setAdmin, setIsAuthenticated } from './features/adminAuthSlice';
import { useDispatch } from 'react-redux';
import useAxios from './hook/useAxios';
import { handleResponse } from './utils/responseHandler';

const AdminRoutes = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const { fetchAdminData } = useAxios();
    const dispatch = useDispatch();

    const fetchAdmin = async () => {
        setLoading(true);
        try {
            const response = await fetchAdminData({
                url: '/api/admin/profile',
                method: 'GET',
            });

            const { success, message, data } = handleResponse(response);

            if (success) {
                dispatch(setAdmin({ admin: data }));
                dispatch(setIsAuthenticated(true));
            } else {
                if (message !== "Unauthorized access. Please login.") {
                    dispatch(setIsAuthenticated(false));
                    dispatch(setAdmin(null));
                }
            }

        } catch (error) {
            const errorMessage = error?.message || 'Failed to authenticate admin';
            dispatch(setIsAuthenticated(false));
            dispatch(setAdmin(null));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);


    if (loading) return (
        <div className='w-full h-screen max-w-[1500px] bg-base-100 flex items-center justify-center'>
            <Loader />
        </div>
    )

    return (
        <>
            <AdminHeader />
            <Suspense fallback={
                <div className='w-full h-screen max-w-[1500px] bg-base-100 flex items-center justify-center'>
                    <Loader />
                </div>}>
                <main className='bg-base-200 max-w-[1500px] mx-auto'>
                    {children}
                </main>
            </Suspense>
        </>
    )
}

export default AdminRoutes;
