import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiLock } from 'react-icons/fi';
import { MdOutlineMail } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../../hook/useAxios';
import { handleResponse } from '../../utils/responseHandler';
import toast from 'react-hot-toast';


// Admin login schema
const adminLoginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Please enter email'),
    password: yup.string()
        .required('Please enter password')
        .min(6, 'Password must be at least 6 characters')
});

const AdminLogin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { fetchData } = useAxios();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(adminLoginSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: '/api/admin/auth/login',
                method: 'POST',
                data
            });
            const { success, message } = handleResponse(response);
            if (success) {
                toast.success('Login successful');
                navigate('/admin', { replace: true });
            } else {
                toast.error(message);
            }
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-[95%] sm:max-w-md bg-base-100 rounded-md border border-base-300 py-5 px-5">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-base-content">Admin Portal</h1>
                    <p className="text-base-content/80 mt-2">Sign in to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <div className="w-full input focus-within:outline-none focus-within:border-primary relative">
                            <span className="px-1"><MdOutlineMail size={18} /></span>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter your email"
                                className="w-full font-medium text-md"
                                {...register('email')}
                                autoComplete="off"
                            />
                        </div>
                        {errors.email && <p className="text-error text-[13px] font-semibold">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="w-full input focus-within:outline-none focus-within:border-primary relative">
                            <span className="px-1"><FiLock size={18} /></span>
                            <input
                                id="password"
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="w-full font-medium text-md"
                                {...register('password')}
                                autoComplete="off"
                            />
                            {passwordVisible ?
                                <span onClick={() => setPasswordVisible(false)} className="cursor-pointer absolute right-3 p-2 rounded-full hover:bg-base-300">
                                    <FaEye size={16} />
                                </span> :
                                <span onClick={() => setPasswordVisible(true)} className="cursor-pointer absolute right-3 p-2 rounded-full hover:bg-base-300">
                                    <FaEyeSlash size={16} />
                                </span>}
                        </div>
                        {errors.password && <p className="text-error text-[13px] font-semibold">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-2"
                    >
                        {loading ? <span className="loading loading-spinner"></span> : 'Sign In'}
                    </button>
                    {/* <Link to="/admin" className="text-sm font-semibold text-primary">Go to Homepage</Link> */}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin
