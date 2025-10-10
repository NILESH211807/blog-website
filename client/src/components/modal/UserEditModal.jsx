import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'
import { FiUser, FiLock } from 'react-icons/fi'
import { MdOutlineEmail } from 'react-icons/md'
import { FaAt, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa'
import { GrInstagram } from 'react-icons/gr'
import { useUpdateUserMutation } from '../../features/api/apiSlice'
import Button from '../Button'

const UserEditModal = ({
    showEditModel,
    setShowEditModel,
    selectedUser,
    setSelectedUser,
}) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Update User 
    const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserMutation();

    const onSubmit = async (data) => {

        const formData = {
            userId: selectedUser?.id,
            name: data.name,
            username: data.username,
            email: data.email,
            bio: data.bio,
        };

        // check if any value is empty then delete that key value pair from formData
        Object.keys(formData).forEach(key => formData[key] === "" ? delete formData[key] : {});
        if (Object.keys(formData).length <= 1) {
            return toast.error('Please provide at least one field to update');
        }

        const isChanged = Object.keys(formData).some(key => formData[key] !== selectedUser[key]);

        if (!isChanged) {
            return toast.error('No changes made');
        }

        const result = await updateUser(formData);

        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
        }
        setShowEditModel(false);
        setSelectedUser("");
    };

    return (
        <dialog id="user_edit_modal" className="modal modal-bottom sm:modal-middle" open={showEditModel}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-md mb-8">Edit Profile</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                    <span className="text-[#808080]"><FiUser size={18} /></span>
                                    <input
                                        type="text"
                                        className="w-full font-medium text-xs"
                                        placeholder="Your name"
                                        {...register('name')}
                                        defaultValue={selectedUser?.name || ""}
                                    />
                                </div>

                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                    <span className="text-[#808080]"><FaAt size={18} /></span>
                                    <input
                                        type="text"
                                        className="w-full font-medium text-xs"
                                        placeholder="username"
                                        {...register('username')}
                                        defaultValue={selectedUser?.username?.slice(1) || ""}
                                    />
                                </div>
                            </div>

                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><MdOutlineEmail size={18} /></span>
                                <input
                                    type="email"
                                    className="w-full font-medium text-xs"
                                    placeholder="Enter Email Address"
                                    disabled
                                    defaultValue={selectedUser?.email || ""}
                                />
                            </div>

                            <textarea
                                className="w-full border-transparent textarea font-semibold bg-base-200 focus-within:outline-none resize-none focus-within:border-primary py-2 px-4"
                                placeholder="Tell us about yourself"
                                {...register('bio')}
                                maxLength={250}
                                rows={3}
                                defaultValue={selectedUser?.bio || ""}
                            ></textarea>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="pt-2">
                        <h4 className="font-semibold mb-2">Social Links</h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><FaYoutube size={18} /></span>
                                <input
                                    type="text"
                                    className="w-full font-medium text-xs"
                                    placeholder="Youtube Channel"
                                    disabled
                                // {...register('socialLinks.youtube')}
                                // defaultValue={selectedUser?.socialLinks?.youtube || ""}
                                />
                            </div>
                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><GrInstagram size={18} /></span>
                                <input
                                    type="text"
                                    className="w-full font-medium text-xs"
                                    placeholder="Instagram"
                                    disabled
                                // {...register('socialLinks.instagram')}
                                // defaultValue={selectedUser?.socialLinks?.instagram || ""}
                                />
                            </div>
                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><FaFacebook size={18} /></span>
                                <input
                                    type="text"
                                    className="w-full font-medium text-xs"
                                    placeholder="Facebook"
                                    disabled
                                    defaultValue={selectedUser?.socialLinks?.facebook || ""}
                                />
                            </div>
                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><FaTwitter size={18} /></span>
                                <input
                                    type="text"
                                    className="w-full font-medium text-xs"
                                    placeholder="Twitter"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={
                            () => {
                                setShowEditModel(false);
                                setSelectedUser("");
                            }
                        }>Cancel</button>
                        <Button type='submit' loading={updateUserLoading} title='Save Changes' className='!w-[130px] !m-0 !bg-primary !hover:bg-primary-focus !text-white !border-none' />
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default UserEditModal
