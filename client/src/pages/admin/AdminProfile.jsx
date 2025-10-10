import React, { useRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { IoMdLock, IoMdMail } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Button from '../../components/Button';
import { RiUserSettingsFill } from "react-icons/ri";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useChangeAdminPasswordMutation, useUpdateAdminProfileMutation } from '../../features/api/apiSlice';
import toast from 'react-hot-toast';
import { setAdmin } from '../../features/adminAuthSlice';
import useAxios from '../../hook/useAxios';

const changePasswordSchema = yup.object({
    currentPassword: yup.string().required('Please enter current password'),
    newPassword: yup.string()
        .required('Please enter new password')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters'),
    confirmPassword: yup.string()
        .required('Please enter confirm password')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
});

const profileUpdateSchema = yup.object({
    name: yup.string().optional().trim()
        .transform(value => value?.replace(/\s+/g, ' '))
        .min(3, 'Name must be at least 3 characters')
        .max(30, 'Name cannot exceed 30 characters'),
});

const AdminProfile = () => {

    const { admin } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("personalInfo");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { fetchAdminData } = useAxios();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset,
        formState: { errors: errorsPassword }
    } = useForm({
        resolver: yupResolver(changePasswordSchema)
    });

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile }
    } = useForm({
        resolver: yupResolver(profileUpdateSchema)
    });

    // useChangeAdminPasswordMutation
    const [
        updateAdminProfile, { isLoading: updateAdminProfileLoading }
    ] = useUpdateAdminProfileMutation();

    // useChangeAdminPasswordMutation
    const [
        changeAdminPassword, { isLoading: changeAdminPasswordLoading }
    ] = useChangeAdminPasswordMutation();


    const handlePasswordChange = async (data) => {
        const result = await changeAdminPassword(data);
        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
            reset(); // Reset the form after successful password change
        }
    };

    const handleProfileUpdate = async (data) => {
        if (data.name === admin?.name) return toast.error('No changes made');

        const result = await updateAdminProfile(data);
        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
            dispatch(setAdmin({ admin: result?.data?.data }));
        }
    };

    // handleProfileImageChange
    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            const imageType = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

            if (!imageType.includes(file.type)) {
                toast.error('Only JPEG, PNG, WEBP, and JPG images are allowed');
                return;
            }

            if (file.size > 1024 * 1024 * 5) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }

    }

    // handleProfileImageUpdate
    const handleProfileImageUpdate = async () => {
        if (!imageFile) return toast.error("Please select an image");

        const formData = new FormData();
        formData.append('profile_image', imageFile);

        try {

            setIsLoading(true);

            const result = await fetchAdminData({
                url: '/api/admin/update-profile-image',
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (result?.success && result?.message == "Profile image uploaded successfully") {
                toast.success('Profile image uploaded successfully');
                dispatch(setAdmin({ admin: { ...admin, profileImage: result.data.imageUrl } }));
                setImagePreview(null);
                setImageFile(null);
                fileInputRef.current.value = '';
            }

        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-full">
            <div className="flex flex-col md:flex-row">
                <div className="min-h-screen flex-1 xl:ml-64 p-3 sm:p-4 md:p-6 overflow-auto">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-md capitalize font-bold text-base-content">Admin Profile</h1>
                    </div>

                    {/* Profile Card */}
                    <div className='flex gap-2 max-[800px]:flex-col'>
                        <div className="bg-base-100 w-80 max-[800px]:w-full rounded-sm border border-base-300 p-6 flex items-center flex-col">
                            <label htmlFor="admin_profile_image">
                                <div className="w-26 h-26 cursor-pointer rounded-full overflow-hidden border border-base-300 mt-5">
                                    {
                                        admin?.profileImage || imagePreview ? (
                                            <img
                                                src={imagePreview || admin?.profileImage}
                                                alt="Admin"
                                                className="w-full h-full object-cover"
                                            />) : (
                                            <div className='w-full bg-base-200 text-base-content/50 h-full flex items-center justify-center'>
                                                <FaUser size={30} />
                                            </div>
                                        )
                                    }
                                </div>
                            </label>
                            <input
                                type="file"
                                onChange={handleProfileImageChange}
                                name="profileImage"
                                className='hidden'
                                id="admin_profile_image"
                                ref={fileInputRef}
                            />
                            {imageFile ? (
                                <Button type='button' onClick={handleProfileImageUpdate} loading={isLoading} className='!w-[80%] mt-5 rounded-full h-[42px]' title='Update Profile Image' />
                            ) : null}

                            <div className='flex flex-col gap-3 mt-10 w-full max-[800px]:items-center'>
                                <button className={`w-full font-semibold py-3 hover:bg-primary/10 border border-base-content rounded-md cursor-pointer text-sm ${activeTab == "personalInfo" ? "bg-primary/10" : ""}`} type="button" onClick={() => setActiveTab("personalInfo")}>Personal Information</button>
                                <button className={`w-full font-semibold py-3 hover:bg-primary/10 border border-base-content rounded-md cursor-pointer text-sm ${activeTab == "changePassword" ? "bg-primary/10" : ""}`} type="button" onClick={() => setActiveTab("changePassword")}>Change Password</button>
                            </div>
                        </div>

                        <div className="flex-1 bg-base-100 rounded-sm border border-base-300 p-6">
                            {activeTab == "personalInfo" && (
                                <form method='POST' onSubmit={handleSubmitProfile(handleProfileUpdate)} className='w-full'>
                                    <h1 className='text-lg font-bold mb-5'>Personal Information</h1>
                                    <div className='w-full flex flex-col gap-5'>

                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="name" className='text-sm font-semibold text-base-content'>Name</label>
                                            <div className='w-full min-[800px]:w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                <span className="text-[#808080]"><FaUser size={18} /></span>
                                                <input
                                                    type='text'
                                                    className="w-full font-medium text-sm"
                                                    placeholder="Enter Name"
                                                    defaultValue={admin?.name}
                                                    {...registerProfile('name')}
                                                />
                                            </div>
                                            {errorsProfile.name && <p className="text-error text-[13px] font-semibold">{errorsProfile.name.message}</p>}
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="email" className='text-sm font-semibold text-base-content'>Email</label>
                                            <div className='w-full min-[800px]:w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                <span className="text-[#808080]"><IoMdMail size={18} /></span>
                                                <input
                                                    type='text'
                                                    className="w-full font-medium text-sm"
                                                    placeholder="Enter Email"
                                                    defaultValue={admin?.email}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="role" className='text-sm font-semibold text-base-content'>Role</label>
                                            <div className='w-full min-[800px]:w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                <span className="text-[#808080]"><RiUserSettingsFill size={18} /></span>
                                                <input
                                                    type='text'
                                                    className="w-full font-medium text-sm capitalize"
                                                    placeholder="Enter Role"
                                                    defaultValue={admin?.role}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className='w-full'>
                                            <Button loading={updateAdminProfileLoading} className='max-w-42 h-[45px]' title='Update Profile' />
                                        </div>
                                    </div>
                                </form>
                            )}

                            {
                                activeTab == "changePassword" && (
                                    <div className='w-full'>
                                        <h1 className='text-lg font-bold mb-5'>Change Password</h1>
                                        <form method='POST' onSubmit={handleSubmitPassword(handlePasswordChange)} className='space-y-4'>


                                            <div className='flex flex-col gap-1'>
                                                <label htmlFor="name" className='text-sm font-semibold text-base-content'>Current Password</label>
                                                <div className='w-full max-w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                    <span className="text-[#808080]"><IoMdLock size={20} /></span>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="w-full font-medium text-sm"
                                                        placeholder="Enter Current Password"
                                                        {...registerPassword('currentPassword')}
                                                    />
                                                    <span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-200'>
                                                        {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                                    </span>
                                                </div>
                                                {errorsPassword.currentPassword && <p className="text-error text-[13px] font-semibold">{errorsPassword.currentPassword.message}</p>}
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <label htmlFor="name" className='text-sm font-semibold text-base-content'>New Password</label>
                                                <div className='w-full max-w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                    <span className="text-[#808080]"><IoMdLock size={20} /></span>
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        className="w-full font-medium text-sm"
                                                        placeholder="Enter New Password"
                                                        {...registerPassword('newPassword')}
                                                    />
                                                    <span onClick={() => setShowNewPassword(!showNewPassword)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-200'>
                                                        {showNewPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                                    </span>
                                                </div>
                                                {errorsPassword.newPassword && <p className="text-error text-[13px] font-semibold">{errorsPassword.newPassword.message}</p>}
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <label htmlFor="name" className='text-sm font-semibold text-base-content'>Confirm Password</label>
                                                <div className='w-full max-w-96 border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                                    <span className="text-[#808080]"><IoMdLock size={20} /></span>
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        className="w-full font-medium text-sm"
                                                        placeholder="Enter Confirm Password"
                                                        {...registerPassword('confirmPassword')}
                                                    />
                                                    <span onClick={() => setShowNewPassword(!showNewPassword)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-200'>
                                                        {showNewPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                                    </span>
                                                </div>
                                                {errorsPassword.confirmPassword && <p className="text-error text-[13px] font-semibold">{errorsPassword.confirmPassword.message}</p>}
                                            </div>


                                            <div className='w-full'>
                                                <Button loading={changeAdminPasswordLoading} className='max-w-42 h-[45px]' title='Update Password' />
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default AdminProfile
