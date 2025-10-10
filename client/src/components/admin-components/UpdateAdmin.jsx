import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { FiUser } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { FaAt, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { GrInstagram } from 'react-icons/gr';
import Button from '../Button';
import { useUpdateAdminMutation } from '../../features/api/apiSlice';
import toast from 'react-hot-toast';

const UpdateAdmin = ({
    showEditModel,
    setShowEditModel,
    selectedUser,
}) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        setValue('role', selectedUser?.role || "");
    }, [selectedUser, setValue]);

    const [updateAdmin, { isLoading: updateAdminLoading }] = useUpdateAdminMutation();

    const onSubmit = async (data) => {
        const formData = {
            userId: selectedUser?.id,
            name: data.name,
            role: data.role,
        };

        // check if any value is empty then delete that key value pair from formData
        Object.keys(formData).forEach(key => formData[key] === "" ? delete formData[key] : {});
        if (Object.keys(formData).length <= 1) {
            return toast.error('Please provide at least one field to update');
        }

        const result = await updateAdmin(formData);

        if (result.error) {
            toast.error(result?.error?.data?.message);
            return;
        };
        if (result?.data?.success) {
            toast.success(result.data.message);
            setShowEditModel(false);
        }
    }


    return (
        <dialog id="user_edit_modal" className="modal modal-bottom sm:modal-middle" open={showEditModel}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-md mb-8">Update Admin</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                    <span className="text-[#808080]"><FiUser size={18} /></span>
                                    <input
                                        type="text"
                                        className="w-full font-medium text-sm"
                                        placeholder="Your name"
                                        {...register('name')}
                                        defaultValue={selectedUser?.name || ""}
                                    />
                                </div>
                            </div>

                            <div className='w-full border-transparent input h-[45px] font-semibold bg-base-200 focus-within:outline-none focus-within:border-primary'>
                                <span className="text-[#808080]"><MdOutlineEmail size={18} /></span>
                                <input
                                    type="email"
                                    className="w-full font-medium text-sm"
                                    placeholder="Enter Email Address"
                                    disabled
                                    defaultValue={selectedUser?.email || ""}
                                />
                            </div>

                            <select defaultValue={selectedUser?.role} className="select h-[45px] bg-base-200 border-transparent font-medium focus:border-primary w-full shadow-none focus:outline-none"
                                {...register('role')}>
                                <option disabled={true}>Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>

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
                        <Button type='submit' loading={updateAdminLoading} title='Save Changes' className='!w-[130px] !m-0 !bg-primary !hover:bg-primary-focus !text-white !border-none' />
                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default UpdateAdmin
