import React, { useRef, useState } from 'react'
import { FiEdit, FiUser, FiLock } from 'react-icons/fi'
import { MdOutlineEmail } from 'react-icons/md'
import { FaAt, FaFacebook, FaTwitter, FaYoutube, FaEye, FaEyeSlash } from 'react-icons/fa'
import { GrInstagram } from 'react-icons/gr';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../hook/useAxios';
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import { handleResponse } from '../utils/responseHandler';
import { changePassword, profileUpdate } from '../validator/authValidator';
import { yupResolver } from '@hookform/resolvers/yup';
import { setUser } from '../features/authSlice'
import HelmetComponent from '../seo/Helmet';

const Profile = () => {
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const { fetchData } = useAxios();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [imageLoading, setImageLoading] = useState(false);
    const fileInputRef = useRef(null);

    // update profile form hook
    const { register: registerProfile, watch,
        handleSubmit: handleSubmitProfile,
        formState: {
            errors: errorsProfile }
    } = useForm({
        defaultValues: {
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
            socialLinks: {
                youtube: user?.socialLinks?.youtube || "",
                instagram: user?.socialLinks?.instagram || "",
                facebook: user?.socialLinks?.facebook || "",
                twitter: user?.socialLinks?.twitter || "",
            }
        },
        resolver: yupResolver(profileUpdate)
    });

    // change password form hook
    const { register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: {
            errors: errorsPassword }
    } = useForm({
        resolver: yupResolver(changePassword)
    });

    // handleImageChange
    const handleImageChange = (event) => {
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
    };


    // onSubmitProfile
    const onSubmitProfile = async (data) => {
        setLoading(true);
        try {
            // Create a copy of the data to avoid modifying the original
            const formData = { ...data };

            // Check if socialLinks is already a string
            if (typeof formData.socialLinks === 'object') {
                formData.socialLinks = JSON.stringify(formData.socialLinks);
            }

            const response = await fetchData({
                url: '/api/user/update-profile',
                method: 'PUT',
                data: formData,
            });
            const { success, message } = handleResponse(response);
            if (success) {
                toast.success('Profile updated successfully');
                dispatch(setUser({ user: response.data }));
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

    // onSubmitPassword
    const onSubmitPassword = async (data) => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: '/api/user/change-password',
                method: 'PUT',
                data
            });
            const { success, message } = handleResponse(response);
            if (success) {
                toast.success('Password changed successfully');
            } else {
                toast.error(message);
            }
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    // onSubmitProfileImage
    const onSubmitProfileImage = async () => {
        try {

            if (!imageFile) return toast.error("Please select an image");

            const formData = new FormData();
            formData.append('profile_image', imageFile);
            setImageLoading(true);
            const response = await fetchData({
                url: '/api/user/upload-profile',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { success, message } = handleResponse(response);

            if (success && message == "Profile image uploaded successfully") {
                toast.success('Profile image uploaded successfully');
                dispatch(setUser(
                    { user: { ...user, profileImage: response.data.url } }
                ));
                setImagePreview("");
                setImageFile(null);
                fileInputRef.current.value = '';
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setImageLoading(false);
        }
    }

    return (
        <>
            <HelmetComponent
                title='Profile - Blogs'
                description='Edit your profile and change your password'
            />
            <div className="max-w-4xl mx-auto px-4 py-8 min-h-[100vh] bg-base-100">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 bg-base-300 border-base-300 mb-3">
                            {imagePreview || user?.profileImage ? (
                                <img
                                    src={imagePreview || user?.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                    <FiUser size={50} />
                                </div>)}
                            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                <label htmlFor="profileImage" className="cursor-pointer w-full h-full flex items-center justify-center">
                                    <FiEdit className="text-white text-xl" />
                                </label>
                            </div>
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        {imagePreview ? (
                            <Button title='Save Changes' type='button' onClick={onSubmitProfileImage} className='!w-40 rounded-full mb-5 btn btn-outline' loading={imageLoading} />
                        ) : <label htmlFor="profileImage" className="btn btn-sm btn-outline rounded-full px-4 mb-6">Upload</label>}

                        {/* Sidebar Navigation */}
                        <div className="w-full space-y-2 mt-3">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full my-3 text-left px-4 py-2 rounded-md flex items-center gap-2  cursor-pointer bg-base-200 ${activeTab == "profile" && "bg-base-300"}`}
                            >
                                <FiUser size={18} />
                                <span className="font-medium text-sm">Profile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("password")}
                                className={`w-full my-3 text-left px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer bg-base-200 ${activeTab == "password" && "bg-base-300"}`}
                            >
                                <FiLock size={18} />
                                <span className="font-medium text-sm">Change Password</span>
                            </button>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <form method='post' className="space-y-4" onSubmit={handleSubmitProfile(onSubmitProfile)} encType='multipart/form-data'>
                                <div className='flex items-center gap-5'>
                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><FiUser size={20} /></span>
                                        <input
                                            type="text"
                                            className="w-full font-semibold text-md"
                                            placeholder="Your name"
                                            {...registerProfile('name')} />
                                    </div>
                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><MdOutlineEmail size={20} /></span>
                                        <input
                                            type="email"
                                            className="w-full font-semibold text-md"
                                            placeholder="your@email.com"
                                            disabled
                                            defaultValue={user?.email || ""} />
                                    </div>
                                </div>
                                {errorsProfile.name && <p className="text-error text-[13px] font-semibold -mt-1">{errorsProfile.name.message}</p>}
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                    <span className="px-1 text-[#808080]"><FaAt size={20} /></span>
                                    <input
                                        type="text"
                                        className="w-full font-semibold text-md"
                                        placeholder="username"
                                        {...registerProfile('username')} />
                                </div>
                                {errorsProfile.username && <p className="text-error text-[13px] font-semibold -mt-1">{errorsProfile.username.message}</p>}


                                <textarea
                                    className="w-full border-transparent textarea font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary py-2 px-4"
                                    placeholder="Tell us about yourself"
                                    {...registerProfile('bio')}
                                    maxLength={250}
                                    rows={5}
                                ></textarea>
                                {errorsProfile.bio && <p className="text-error text-[13px] font-semibold -mt-1">{errorsProfile.bio.message}</p>}

                                <p className="text-sm text-right text-gray-600 font-medium">{250 - watch("bio").length} characters left</p>

                                <div className='flex flex-col md:flex-row items-center gap-5'>
                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><FaYoutube size={20} /></span>
                                        <input
                                            type="text"
                                            className="w-full font-semibold text-md"
                                            placeholder="Youtube Channel"
                                            {...registerProfile('socialLinks.youtube')} />
                                    </div>
                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><GrInstagram size={20} /></span>
                                        <input
                                            type="text"
                                            className="w-full font-semibold text-md"
                                            placeholder="Instagram"
                                            {...registerProfile("socialLinks.instagram")}
                                        />
                                    </div>
                                </div>

                                {
                                    errorsProfile?.socialLinks || errorsProfile?.socialLinks?.youtube || errorsProfile?.socialLinks?.instagram ?
                                        <p className="text-error text-[13px] font-semibold -mt-1">{errorsProfile?.socialLinks?.youtube?.message || errorsProfile?.socialLinks?.instagram?.message || "Social links can only contain letters, numbers, and spaces"}</p>
                                        : null
                                }

                                <div className='flex flex-col md:flex-row items-center gap-5'>
                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><FaFacebook size={20} /></span>
                                        <input
                                            type="text"
                                            className="w-full font-semibold text-md"
                                            placeholder="Facebook"
                                            {...registerProfile("socialLinks.facebook")} />
                                    </div>

                                    <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                        <span className="px-1 text-[#808080]"><FaTwitter size={20} /></span>
                                        <input
                                            type="text"
                                            className="w-full font-semibold text-md"
                                            placeholder="Twitter"
                                            {...registerProfile("socialLinks.twitter")} />
                                    </div>
                                </div>
                                {errorsProfile?.socialLinks || errorsProfile?.socialLinks?.facebook || errorsProfile?.socialLinks?.twitter ?
                                    <p className="text-error text-[13px] font-semibold -mt-1">{errorsProfile?.socialLinks?.facebook?.message || errorsProfile?.socialLinks?.twitter?.message || "Social links can only contain letters, numbers, and spaces"}</p>
                                    : null}
                                <div className="pt-4">
                                    <Button disabled={imageLoading} title='Save Changes' className='!w-46 px-6 h-[45px] mt-4 max-sm:!w-full' loading={loading} />
                                </div>
                            </form>
                        )}

                        {activeTab === "password" && (
                            <form method='POST' onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                    <span className="px-1 text-[#808080]"><FiLock size={20} /></span>
                                    <input
                                        type={currentPasswordVisible ? 'text' : 'password'}
                                        className="w-full font-semibold text-md"
                                        placeholder="Current Password"
                                        {...registerPassword('oldPassword')}
                                    />
                                    {
                                        currentPasswordVisible ?
                                            <span onClick={() => setCurrentPasswordVisible(false)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEye size={16} />
                                            </span> :
                                            <span onClick={() => setCurrentPasswordVisible(true)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEyeSlash size={16} />
                                            </span>
                                    }
                                </div>
                                {errorsPassword.oldPassword && <p className="text-error text-[13px] font-semibold -mt-1">{errorsPassword.oldPassword.message}</p>}

                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                    <span className="px-1 text-[#808080]"><FiLock size={20} /></span>
                                    <input
                                        type={newPasswordVisible ? 'text' : 'password'}
                                        className="w-full font-semibold text-md"
                                        placeholder="New Password"
                                        {...registerPassword('newPassword')}
                                    />
                                    {
                                        newPasswordVisible ?
                                            <span onClick={() => setNewPasswordVisible(false)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEye size={16} />
                                            </span> :
                                            <span onClick={() => setNewPasswordVisible(true)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEyeSlash size={16} />
                                            </span>
                                    }
                                </div>
                                {errorsPassword.newPassword && <p className="text-error text-[13px] font-semibold -mt-1">{errorsPassword.newPassword.message}</p>}
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary relative'>
                                    <span className="px-1 text-[#808080]"><FiLock size={20} /></span>
                                    <input
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        className="w-full font-semibold text-md"
                                        placeholder="Confirm New Password"
                                        {...registerPassword('confirmPassword')}
                                    />
                                    {
                                        confirmPasswordVisible ?
                                            <span onClick={() => setConfirmPasswordVisible(false)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEye size={16} />
                                            </span> :
                                            <span onClick={() => setConfirmPasswordVisible(true)} className='cursor-pointer absolute right-3 p-2 rounded-full hover:bg-gray-100'>
                                                <FaEyeSlash size={16} />
                                            </span>
                                    }
                                </div>
                                {errorsPassword.confirmPassword && <p className="text-error text-[13px] font-semibold -mt-1">{errorsPassword.confirmPassword.message}</p>}
                                <Button title='Update Password' className='!w-46 px-6 h-[45px] mt-4 max-sm:!w-full' loading={loading} disabled={imageLoading} />
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
