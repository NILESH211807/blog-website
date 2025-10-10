import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Header from './components/Header';
import Loader from './components/Loader';
import useAxios from './hook/useAxios';
import { setIsAuthenticated, setUser } from './features/authSlice';
import { handleResponse } from './utils/responseHandler';

const ProtectedRoutes = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const { fetchData } = useAxios();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: '/api/user',
                method: 'GET',
            });

            const { success, message, data } = handleResponse(response);

            if (success) {
                dispatch(setUser({ user: data }));
                dispatch(setIsAuthenticated(true));
            } else {
                if (message !== "Unauthorized access. Please login.") {
                    toast.error(message);
                    dispatch(setIsAuthenticated(false));
                    dispatch(setUser(null));
                }
            }
        } catch (error) {
            const errorMessage = error?.message || 'Failed to authenticate user';
            toast.error(errorMessage);
            dispatch(setIsAuthenticated(false));
            dispatch(setUser(null));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen bg-base-100 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!isAuthenticated && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <main className="bg-base-100">
            <Header />
            {children}
        </main>
    );
};

export default ProtectedRoutes;