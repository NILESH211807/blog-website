import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchUserInput from '../../components/admin-components/SearchUserInput';
import AdminBlogItem from '../../components/admin-components/AdminBlogItem';
import { useBlogPublishPrivateMutation, useDeleteBlogMutation, useGetBlogsQuery } from '../../features/api/apiSlice';
import MainLoader from '../../components/Loaders/MainLoader';
import ErrorComponent from '../../components/admin-components/Error';
import useDebounce from '../../hook/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from '../../hook/useAxios';
import { useSelector } from 'react-redux';
import Confirm from '../../components/modal/Confirm';
import toast from 'react-hot-toast';

const AdminBlogs = () => {

   const { fetchAdminData } = useAxios();
   const [searchParams] = useSearchParams();
   const search = searchParams.get('query') || '';
   const debouncedSearch = useDebounce(search, 300);
   const [selectedBlog, setSelectedBlog] = useState("");
   const [showModel, setShowModel] = useState(false);
   const [deleteBlog, { isLoading: deleteBlogLoading }] = useDeleteBlogMutation();

   const {
      data: blogs,
      isLoading,
      isError,
      isFetching,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
   } = useInfiniteQuery({
      queryKey: ["ADMIN_BLOGS", debouncedSearch],
      queryFn: async ({ pageParam = 1 }) => await fetchAdminData({
         url: debouncedSearch ?
            `/api/admin/blogs?page=${pageParam}&limit=10&search=${debouncedSearch}` :
            `/api/admin/blogs?page=${pageParam}&limit=10`,
         method: 'GET',
      }),
      getNextPageParam: (lastPage, allPages) => {
         return lastPage?.data?.length === 10 ?
            allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
   });

   // useBlogPublishPrivateMutation
   const [blogPublishPrivate, { isLoading: blogPublishPrivateLoading }] = useBlogPublishPrivateMutation();

   // handleDeleteBlog
   const handleDeleteBlog = async () => {
      const result = await deleteBlog(selectedBlog?.id);
      if (result.error) {
         toast.error(result?.error?.data?.message);
         return;
      };
      if (result?.data?.success) {
         toast.success(result.data.message);
         setShowModel(false);
         setSelectedBlog("");
         refetch();
      }
   };

   // handlePublishPrivateBlog
   const handlePublishPrivateBlog = async (blogId, isPublished) => {
      const result = await blogPublishPrivate({ blogId, isPublished });
      if (result.error) {
         toast.error(result?.error?.data?.message);
         return;
      };
      if (result?.data?.success) {
         toast.success(result.data.message);
         refetch();
      }
   };

   return (
      <div className="w-full h-full">
         <div className="flex flex-col md:flex-row">
            <div className="min-h-screen flex-1 xl:ml-64 p-3 sm:p-4 md:p-6 overflow-auto">
               <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-md capitalize font-bold text-base-content">Blogs Management</h1>
                  <p className="text-base-content/80 text-sm mt-1 font-semibold">Manage all blogs in the system</p>
               </div>
               <SearchUserInput title='Search Blogs by title' />
               {
                  isLoading ? (
                     <MainLoader />
                  ) : isError ? (
                     <ErrorComponent error={error} />
                  ) : (
                     <>

                        {
                           blogs?.pages?.flatMap(page => page?.data || []).length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                 {blogs?.pages?.flatMap(page => page?.data || []).map((blog, index) => (
                                    <AdminBlogItem
                                       key={`${blog.id}-${index}`} blog={blog}
                                       getDeletedBlogId={() => {
                                          setSelectedBlog(blog);
                                          setShowModel(true);
                                       }}
                                       handlePublishPrivateBlog={handlePublishPrivateBlog}
                                    />
                                 ))}
                              </div>
                           ) : (
                              <div className='w-full h-96 flex items-center justify-center font-semibold'>No blogs found</div>
                           )
                        }
                        <div className="flex justify-center my-8">
                           <button
                              onClick={() => fetchNextPage()}
                              disabled={!hasNextPage || isFetchingNextPage}
                              className="shadow-none btn-soft btn-secondary px-4 cursor-pointer text-sm font-medium btn rounded-full">
                              {isFetchingNextPage
                                 ? 'Loading more...'
                                 : hasNextPage
                                    ? 'Show More Blogs'
                                    : 'No more blogs'}
                           </button>
                        </div>
                     </>
                  )
               }
            </div>
         </div>

         {
            showModel && (
               <Confirm
                  showModel={showModel}
                  setShowModel={setShowModel}
                  title="Confirmation Required"
                  message={`Are you sure you want to delete this blog?`}
                  className={`
                  text-white !hover:bg-red-600 !bg-red-500
                `}
                  onConfirm={handleDeleteBlog}
                  loading={deleteBlogLoading}
                  onCancel={() => {
                     setShowModel(false);
                     setSelectedBlog("");
                  }} />
            )

         }

      </div>
   );
};

export default AdminBlogs;
