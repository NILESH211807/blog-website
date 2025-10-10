import { FiImage, FiUser } from 'react-icons/fi'
import { FaEdit, FaHeart } from 'react-icons/fa';
import { MdInsertComment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/utils';
import { IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRef, useState, useEffect } from 'react';
import useApi from '../hook/api';
import { useQueryClient } from '@tanstack/react-query';

const StoryCard = ({
   blog,
   isFetching,
   maxWidth = '680px',
   isLikeCommentCount = true,
   isAutherVisible = true,
   isOpenFullBlog = true,
   isMenuShow = false,
   getBlogId,
   activeTab = null,
}) => {

   const navigate = useNavigate();
   const [isOptionsOpen, setIsOptionsOpen] = useState(false);
   const menuRef = useRef(null);
   const menuButtonRef = useRef(null);
   const [isLoading, setIsLoading] = useState(false);
   const { blogVisibilityChange } = useApi();
   const queryClient = useQueryClient();

   const handleOutSideClick = (e) => {
      if (menuRef.current &&
         !menuRef.current.contains(e.target) &&
         !menuButtonRef.current.contains(e.target)) {
         setIsOptionsOpen(false);
      }
   }

   useEffect(() => {
      document.addEventListener('click', handleOutSideClick);
      return () => {
         document.removeEventListener('click', handleOutSideClick);
      }
   }, []);


   const handleBlogVisiblity = async (e) => {
      e.stopPropagation();
      setIsLoading(true);
      try {
         await blogVisibilityChange(blog?.id);
         queryClient.invalidateQueries({ queryKey: ["MY_STORIES", activeTab] });
      } catch (error) {
         console.log('error', error);
      } finally {
         setIsLoading(false);
         setIsOptionsOpen(false);
      }
   }

   return (
      <div key={blog.id} className={`w-full ${isOpenFullBlog ? 'cursor-pointer' : ''} my-6 px-3 py-2 md:p-4 border border-base-300 rounded-sm mx-auto flex flex-col md:flex-row gap-3 md:gap-5 bg-base-100 transition-all duration-200`}
         style={{ maxWidth }}
         onClick={() => isOpenFullBlog && navigate(`/blog/${blog?.id}`, { replace: true })}>
         <div className='flex-1 order-2 md:order-1'>

            {
               isAutherVisible && (
                  <div className='flex items-center gap-3 mb-3 cursor-pointer'>
                     {blog?.author?.profileImage ? (
                        <img
                           src={blog?.author?.profileImage}
                           width={25} height={25} alt="User Profile Image"
                           className='rounded-full object-cover' />
                     ) : (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-base-300 text-base-content flex items-center justify-center">
                           <FiUser size={16} />
                        </div>)}
                     <p className='text-sm font-medium text-base-content/70 hover:underline' onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${blog?.author?.username}`)
                     }}>{blog?.author?.username},
                        <span className='uppercase'>{blog?.author?.name}</span>
                     </p>
                  </div>
               )
            }


            <h2 className={`text-lg md:text-xl font-bold mb-1 ${isOpenFullBlog ? 'hover:text-primary cursor-pointer' : ''} transition-colors `}
               onClick={() => isOpenFullBlog && navigate(`/blog/${blog?.id}`)}>
               {blog?.title.slice(0, 80) + '...'}
            </h2>
            <p className='text-base-content/70 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base'>{blog?.content}</p>
            <div className='flex items-center gap-5 -mt-2 text-xs md:text-sm'>
               <p className='text-base-content/80 font-semibold text-xs'>{formatDate(blog?.createdAt)}</p>

               {isLikeCommentCount && (
                  isFetching ? (
                     <div className="flex gap-3 md:gap-4 animate-pulse">
                        <div className="flex items-center gap-1 bg-base-300 rounded w-10 h-5"></div>
                        <div className="flex items-center gap-1 bg-base-300 rounded w-10 h-5"></div>
                     </div>
                  ) : (
                     <div className='flex gap-3 md:gap-4'>
                        <span className='flex items-center gap-1 text-rose-500'>
                           <FaHeart />
                           {blog?.likes}
                        </span>
                        <span className='flex items-center gap-1 text-blue-500'>
                           <MdInsertComment />
                           {blog?.comments}
                        </span>
                     </div>
                  ) || null
               )}
            </div>
            {isMenuShow && (
               <div className='flex items-center gap-5 text-xs md:text-sm mt-5'>
                  <div ref={menuButtonRef} onClick={(e) => {
                     e.stopPropagation();
                     setIsOptionsOpen(!isOptionsOpen);
                  }} className='flex select-none items-center gap-1 cursor-pointer text-sm font-medium capitalize relative'>
                     <p>More Options</p>
                     {
                        isOptionsOpen ? (
                           <IoIosArrowDown size={17} className='rotate-180 transition duration-300' />
                        ) : (
                           <IoIosArrowDown size={17} className='transition duration-300' />
                        )
                     }

                     {isOptionsOpen && (
                        <div className='absolute top-full mt-2 w-40 bg-base-300 rounded-sm shadow-md z-10 p-1' ref={menuRef}>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/edit-blog/${blog?.id}`);
                              }}
                              className='w-full rounded-sm text-sm py-2.5 bg-base-100 capitalize font-medium tracking-wider flex items-center mb-1 justify-center cursor-pointer gap-2 hover:bg-base-200'>
                              Edit <FaEdit size={16} />
                           </button>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 getBlogId(blog?.id);
                              }}
                              className='w-full rounded-sm text-sm py-2.5 mb-1 bg-base-100 capitalize font-medium tracking-wider flex items-center justify-center cursor-pointer gap-2 hover:bg-base-200'>
                              Delete
                              <RiDeleteBin6Fill size={16} />
                           </button>
                           <button type='button'
                              onClick={handleBlogVisiblity}
                              disabled={isLoading}
                              className='w-full rounded-sm text-sm py-2.5 bg-base-100 capitalize font-medium tracking-wider flex items-center justify-center cursor-pointer gap-2 hover:bg-base-200'>
                              {isLoading ? 'Loading...' : blog?.isPublished ? 'Make Private' : 'Make Public'}
                           </button>
                        </div>)}
                  </div>
               </div>
            )}
         </div>
         <div className='md:-mr-2 w-full md:w-40 h-52 md:h-30 overflow-hidden flex-shrink-0 order-1 md:order-2 bg-base-300'>
            {blog?.bannerImage ? (
               <img src={blog?.bannerImage} alt={blog?.title} className='w-full h-full object-cover' />
            ) : (
               <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <FiImage size={24} className='text-gray-400' />
               </div>
            )}
         </div>
      </div>
   )
}

export default StoryCard;
