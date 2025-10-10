import React, { useState } from 'react'
import { FiHeart, FiUser } from 'react-icons/fi';
import '../assets/css/like-button.css';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import { formatDate } from '../utils/utils';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from './Button';
import useApi from '../hook/api';
import { setCommentLike } from '../features/userActionsSlice';

const commentSchema = yup.object({
   content: yup.
      string()
      .required('Please enter comment')
      .min(3, 'Comment must be at least 3 characters')
      .max(250, 'Comment cannot exceed 250 characters')
      .transform(value => value?.replace(/\s+/g, ' ')) // Remove extra spaces
      .trim()
});

const StoryComment = ({ blogId, userId, blogAuthorId }) => {
   const { fetchData } = useAxios();
   const { user } = useSelector((state) => state.auth);
   const queryClient = useQueryClient();
   const { postComment, likeUnlikeComment } = useApi();
   const dispatch = useDispatch();
   const { commentLikesStatus } = useSelector((state) => state.userActions);

   const { data: commentsData,
      isPending,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: ["COMMENTS", blogId],
      queryFn: async ({ pageParam = 1 }) => await fetchData({
         url: `/api/comment/${blogId}?page=${pageParam}&limit=5`,
         method: 'GET',
      }),
      getNextPageParam: (lastPage, allPages) => {
         return lastPage?.data?.length === 5 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      enabled: !!blogId,
      staleTime: 0,
      cacheTime: 0,
   });

   const { register, handleSubmit, reset, formState: { errors } } = useForm({
      resolver: yupResolver(commentSchema)
   });


   // handle Comment Submit
   const onSubmit = async (data) => {
      data.blogId = blogId;
      try {
         const newComment = {
            id: Math.random().toString(36).substr(2, 9),
            content: data.content,
            author: {
               id: user._id,
               name: 'You',
               username: user.username,
               profileImage: user.profileImage,
            },
            likes: 0,
            isLiked: false,
            createdAt: new Date(),
         };

         // Optimistically update the commentsData cache
         queryClient.setQueryData(['COMMENTS', blogId], oldData => {
            if (!oldData) return oldData;
            return {
               ...oldData,
               pages: [
                  [
                     { data: [newComment, ...(oldData.pages?.[0]?.data || [])] },
                     ...oldData.pages.slice(1)
                  ]
               ].flat()
            };
         });

         await postComment(data);
         reset();
         queryClient.invalidateQueries(['COMMENTS', blogId]);
      } catch (err) {
         toast.error(err.message || "Something went wrong");
      }
   }

   //  handle Comment Like
   const handleCommentLike = async (id, comment) => {
      if (!id) return;
      // Get the current like state
      const prevLiked = (commentLikesStatus?.[id]) ?? comment.isLiked;
      const optimisticLiked = !prevLiked;
      dispatch(setCommentLike({ [id]: optimisticLiked }));
      try {
         const updatedLikes = await likeUnlikeComment({ commentId: id });
         dispatch(setCommentLike({ [id]: updatedLikes }));
      } catch (error) {
         dispatch(setCommentLike({ [id]: prevLiked }));
         toast.error(error?.message || "Failed to update like status");
      }
   }

   return (
      <div className="space-y-6">
         {isPending ? <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 max-sm:hidden bg-base-300">
            </div>
            <div className="flex-1">
               <div className="bg-base-100 p-4 rounded-md border border-base-300">
                  <div className="flex items-center justify-between mb-2">
                     <div className="h-4 bg-base-300 rounded w-1/4"></div>
                     <div className="h-4 bg-base-300 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-base-300 rounded w-full mt-1"></div>
                  <div className="h-4 bg-base-300 rounded w-2/3 mt-1"></div>
               </div>
               <div className="flex gap-4 mt-2 ml-2 h-4 bg-base-300 rounded w-1/4">
               </div>
            </div>
         </div> :
            <>
               <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-base-300 flex-shrink-0 overflow-hidden max-sm:hidden">
                        {user?.profileImage ? (
                           <img src={user?.profileImage} alt="Profile" className='w-full h-full rounded-full object-cover' />
                        ) : (
                           <div className='w-full h-full flex items-center justify-center'>
                              <FiUser size={20} className="text-base-content" />
                           </div>)}
                     </div>
                     <div className="flex-1">
                        <textarea
                           {...register('content')}
                           placeholder="Add a comment..."
                           className="w-full border rounded-sm p-3 min-h-[150px] border-base-300 focus:outline-none focus:border-primary resize-none"
                        ></textarea>
                        {errors.content && <p className="text-error text-[13px] font-semibold -mt-1">{errors.content.message}</p>}
                        <div className="flex justify-end mt-2">
                           <Button className='min-sm:!w-44' title='Post comment' />
                        </div>
                     </div>
                  </div>
               </form>
               {commentsData?.pages?.flatMap(page => page?.data || []).map((comment, index) => (
                  <div key={`${comment.id}-${index}`} className="flex gap-4">
                     <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 max-sm:hidden">
                        {
                           comment?.author?.profileImage ? (
                              <img
                                 src={comment?.author?.profileImage}
                                 alt={comment?.author?.name || comment?.author?.username}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                 <FiUser size={20} />
                              </div>
                           )
                        }
                     </div>
                     <div className="flex-1">
                        <div className="bg-base-200 p-4 rounded-md border border-base-300">
                           <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">
                                 {userId === comment?.author?.id ? 'You'
                                    : comment?.author?.name || comment?.author?.username}
                              </p>
                              <span className="text-sm text-gray-400">{formatDate(comment.createdAt)}</span>
                           </div>
                           <p className="text-base-content">{comment.content}</p>
                        </div>
                        <div className="flex gap-4 mt-2 ml-2">
                           <button
                              type='button'
                              onClick={() => handleCommentLike(comment._id, comment)}
                              className={`text-sm flex cursor-pointer items-center gap-1 ${((commentLikesStatus?.[comment._id]) ?? comment.isLiked) ? 'text-rose-500' : 'text-gray-500 hover:text-primary'}`}
                           >
                              <FiHeart className={((commentLikesStatus?.[comment._id]) ?? comment.isLiked) ? 'fill-rose-500' : ''} size={14} />
                              Like (
                              {(() => {
                                 const isOptimisticallyLiked = (commentLikesStatus?.[comment._id]);
                                 if (typeof isOptimisticallyLiked === 'boolean') {
                                    if (isOptimisticallyLiked && !comment.isLiked) return comment.likes + 1;
                                    if (!isOptimisticallyLiked && comment.isLiked) return comment.likes - 1;
                                    return comment.likes;
                                 }
                                 return comment.likes;
                              })()})
                           </button>
                        </div>
                     </div>
                  </div>
               ))}

               {hasNextPage && (
                  <div className="flex justify-center my-8">
                     <button
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                        className="shadow-none btn-soft btn-secondary px-3 cursor-pointer text-xm font-medium btn rounded-full">
                        {isFetchingNextPage
                           ? 'Loading more...'
                           : hasNextPage
                              ? 'Show More Comments'
                              : 'No more comments'}
                     </button>
                  </div>
               )}

            </>
         }
      </div>
   )
}

export default StoryComment;
