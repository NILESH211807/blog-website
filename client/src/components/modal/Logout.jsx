import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hook/useAxios';
import { handleResponse } from '../../utils/responseHandler';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../Button';
import { logout } from '../../features/authSlice';
import { useDispatch } from 'react-redux';

const Logout = ({ modalRef }) => {

   const { fetchData } = useAxios();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const [loading, setLoading] = React.useState(false);
   const dispatch = useDispatch();

   const handleLogout = async () => {
      setLoading(true);
      try {
         const result = await fetchData({
            url: '/api/auth/logout',
            method: 'GET',
         });

         const { success, message } = handleResponse(result);

         if (success && message == "Logout successful") {
            toast.success('Logout successful');
            dispatch(logout());
            queryClient.removeQueries();
            navigate('/login', { replace: true });
         } else {
            toast.error(message);
         }
      } catch (error) {
         const { message } = handleResponse(error);
         toast.error(message || "Something went wrong");
      } finally {
         setLoading(false);
         modalRef.current.close();
      }
   };

   return (
      <>
         <dialog ref={modalRef} id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
               <h3 className="font-bold text-lg">Confirm Logout</h3>
               <p className="py-4">Are you sure you want to logout from your account?</p>
               <div className="modal-action flex justify-end gap-3">
                  <form method="dialog" className="flex gap-3">
                     <button className="btn">Cancel</button>
                     <Button type='button' loading={loading} title='Logout' className={'!w-[100px] !m-0 !bg-red-500 !hover:bg-red-600 !text-white !border-none'} onClick={handleLogout} />
                  </form>
               </div>
            </div>
         </dialog>
      </>
   )
}

export default Logout
