import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiUser } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { FaEye, FaEyeSlash, FaRegCircleUser } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../hook/useAxios';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { registerSchema } from '../validator/authValidator';
import { handleResponse } from '../utils/responseHandler';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/authSlice';
import HelmetComponent from '../seo/Helmet';


const Register = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const { fetchData } = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    });

    // handle onSubmit 
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: '/api/auth/signup',
                method: 'POST',
                data
            });
            const { success, message } = handleResponse(response);
            if (success && message == "User created successfully") {
                toast.success('Account created successfully');
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
                title='Create Account - Blogs'
                description='Register to your account to access all the features of the website'
            />
            <div className='w-full min-h-screen flex items-center justify-center bg-base-300'>
                <div className="w-[95%] sm:max-w-md bg-base-100 rounded-md shadow-sm p-4 flex items-center justify-center flex-col">
                    <h2 className="text-center text-base-content text-xl font-bold my-2 uppercase">Create Account</h2>
                    <form method="post" onSubmit={handleSubmit(onSubmit)} className='w-full p-2'>
                        <div className='w-full input focus-within:outline-none focus-within:border-primary my-2'>
                            <span className="px-1"><FiUser size={16} /></span>
                            <input
                                type="text"
                                placeholder="Enter Full Name"
                                className='w-full font-medium text-md'
                                {...register('name')}
                                autoComplete='off'
                            />
                        </div>
                        {errors.name && <p className="text-error text-[13px] font-semibold">{errors.name.message}</p>}

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

                        <div className='w-full input focus-within:outline-none focus-within:border-primary my-2'>
                            <span className="px-1"><FaRegCircleUser size={16} /></span>
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className='w-full font-medium text-md'
                                {...register('username')}
                                autoComplete='off'
                            />
                        </div>
                        {errors.username && <p className="text-error text-[13px] font-semibold">{errors.username.message}</p>}

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
                        <Button title='Register' loading={loading} />
                    </form>
                    <p className='text-sm font-semibold my-1'>Already have an account? <Link to="/login" className='text-primary'>Login</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register
