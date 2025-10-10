import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FiUser, FiLock } from 'react-icons/fi'
import { MdOutlineEmail } from 'react-icons/md'
import { FaAt, FaEye, FaEyeSlash, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa'
import { GrInstagram } from 'react-icons/gr'
import { useCreateAdminMutation } from '../../features/api/apiSlice'
import Button from '../Button'
import { IoMdLock } from 'react-icons/io';
import { yupResolver } from '@hookform/resolvers/yup';

const createSchema = yup.object({
    name: yup
        .string()
        .required('Please enter name')
        .min(3, 'Name must be at least 3 characters')
        .max(30, 'Name cannot exceed 30 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .transform(value => value?.replace(/\s+/g, ' ')),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Please enter email'),
    password: yup
        .string()
        .required('Please enter password')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters'),
    role: yup.string().required('Please select a role'),
});

const CreateAdmin = ({
    showCreateAdmin,
    setShowCreateAdmin
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(createSchema)
    });

    const [createAdmin, { isLoading: createAdminLoading }] = useCreateAdminMutation();

    const onSubmit = async (data) => {
        console.log(data);
        const result = await createAdmin(data);
        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
            setShowCreateAdmin(false);
        }
    };

    return (
        <dialog id="user_edit_modal" className="modal modal-bottom sm:modal-middle" open={showCreateAdmin}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-xl mb-8">Create Admin</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                    <span className="text-[#808080]"><FiUser size={18} /></span>
                                    <input
                                        type="text"
                                        className="w-full font-medium text-sm"
                                        placeholder="Full Name"
                                        {...register('name')}
                                    />
                                </div>
                            </div>
                            {errors.name && <p className="text-error text-[13px] font-semibold -mt-2">{errors.name.message}</p>}

                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><MdOutlineEmail size={18} /></span>
                                <input
                                    type="email"
                                    className="w-full font-medium text-sm"
                                    placeholder="Enter Email Address"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <p className="text-error text-[13px] font-semibold -mt-2">{errors.email.message}</p>}

                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                <span className="text-[#808080]"><IoMdLock size={20} /></span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full font-medium text-sm"
                                    placeholder="Enter Password"
                                    {...register('password')}
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-200'>
                                    {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                </span>
                            </div>
                            {errors.password && <p className="text-error text-[13px] font-semibold -mt-2">{errors.password.message}</p>}

                            <select defaultValue="admin" className="select h-[45px] bg-base-200 border-transparent font-medium focus:border-primary w-full shadow-none focus:outline-none"
                                {...register('role')}>
                                <option disabled={true}>Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                            {errors.role && <p className="text-error text-[13px] font-semibold -mt-2">{errors.role.message}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-action">
                        <button type="button" className="btn shadow-none border-none" onClick={() => setShowCreateAdmin(false)}>Cancel</button>
                        <Button type='submit' loading={createAdminLoading} title='Add Admin' className='!w-[130px] !m-0 !bg-primary !hover:bg-primary-focus !text-white !border-none' />
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default CreateAdmin
