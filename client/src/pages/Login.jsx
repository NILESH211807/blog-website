import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdOutlineMail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../hook/useAxios';
import Button from '../components/Button';
import { handleResponse } from '../utils/responseHandler';
import toast from 'react-hot-toast';
import { loginSchema } from '../validator/authValidator';
import { setUser } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import HelmetComponent from '../seo/Helmet';

const Login = () => {

    const { fetchData } = useAxios();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user]);


    // on submit
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: '/api/auth/login',
                method: 'POST',
                data
            });
            const { success, message } = handleResponse(response);
            if (success && message == "Login successful") {
                toast.success('Login successful');
                dispatch(setUser({ user: response.user }));
                navigate('/', { replace: true });
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
        <>
            <HelmetComponent
                title='Login || Blogs'
                description='Login to your account to access all the features of the website'
            />
            <div className='w-full min-h-screen flex items-center justify-center bg-base-300'>
                <div className="w-[95%] sm:max-w-md bg-base-100 rounded-md shadow-sm p-4 flex items-center justify-center flex-col">
                    <h2 className="text-center text-base-content text-xl font-bold my-2 uppercase">Login</h2>
                    <form method="post" onSubmit={handleSubmit(onSubmit)} className='w-full p-2'>
                        <div className='w-full input focus-within:outline-none focus-within:border-primary my-2'>
                            <span className="px-1"><MdOutlineMail size={16} /></span>
                            <input
                                type="text"
                                placeholder="Enter Email Address"
                                className='w-full font-medium text-md'
                                {...register('email')}
                                autoComplete='off'
                            />
                        </div>
                        {errors.email && <p className="text-error text-[13px] font-semibold">{errors.email.message}</p>}

                        <div className='w-full input focus-within:outline-none relative focus-within:border-primary my-2'>
                            <span className="px-1"><FiLock size={16} /></span>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Enter Password"
                                className='w-full font-medium text-md'
                                {...register('password')}
                                autoComplete='off'
                            />
                            {
                                passwordVisible ? <span onClick={() => setPasswordVisible(false)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-base-200'><FaEye size={16} /></span> :
                                    <span onClick={() => setPasswordVisible(true)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-base-200'><FaEyeSlash size={16} /></span>
                            }
                        </div>
                        {errors.password && <p className="text-error text-[13px] font-semibold">{errors.password.message}</p>}
                        <Button title='Login' loading={loading} />
                    </form>
                    {/* test login credentials */}
                    <p className='text-sm text-left w-full font-semibold my-2'>Test Login Credentials</p>
                    <div className='w-full bg-gray-100 px-4 py-2 rounded-md'>
                        <p className='text-sm font-semibold my-1'>Email: test@gmail.com</p>
                        <p className='text-sm font-semibold my-1'>Password: test@123</p>
                    </div>
                    <p className='text-sm font-semibold my-1'>Don't have an account? <Link to="/register" className='text-primary'>Register</Link></p>
                </div>
            </div>
        </>
    )
}

export default Login
