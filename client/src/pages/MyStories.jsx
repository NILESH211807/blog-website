import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import StoryCard from '../components/StoryCard';
import ConfirmDelete from '../components/modal/ConfirmDelete';
import toast from 'react-hot-toast';
import { handleResponse } from '../utils/responseHandler';
import StoryCardLoader from '../components/Loaders/StoryCardLoader';
import HelmetComponent from '../seo/Helmet';

const MyStories = () => {
    const { fetchData } = useAxios();
    const [isPublished, setIsPublished] = useState(true);
    const [deleteBlogId, setDeleteBlogId] = useState(null);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || "published";

    const {
        data: blogs,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["MY_STORIES", activeTab],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: `/api/blog/my-stories?isPublished=${isPublished}&page=${pageParam}&limit=10`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 10 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: activeTab == "published" || activeTab == "private",
        staleTime: 0,
        cacheTime: 0,
    });

    // get saved blogs
    const {
        data: savedBlogs,
        isLoading: savedBlogsLoading,
        isError: savedBlogsIsError,
        error: savedBlogsError,
        isFetching: isFetchingSavedBlogs,
    } = useInfiniteQuery({
        queryKey: ["SAVED_BLOGS"],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: `/api/blog/saved-blogs?page=${pageParam}&limit=10`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 10 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: activeTab == "saved",
        staleTime: 0,
        cacheTime: 0,
    });

    // handle set active tab 
    const handleSetActiveTab = (tab) => {
        const tabs = ["published", "private", "saved"];
        if (!tabs.includes(tab)) return;
        setSearchParams({ tab });
        if (tab == "published") {
            setIsPublished(true);
        } else if (tab == "private") {
            setIsPublished(false);
        } else if (tab == "saved") {
            setIsPublished(false);
        }
    }


    // handle delete blog
    const confirmDeleteBlog = async (blogId) => {
        setLoading(true);
        try {

            const response = await fetchData({
                url: `/api/blog/delete-blog/${blogId}`,
                method: 'DELETE',
            });

            const { success, message } = handleResponse(response);
            if (success && message == "Post deleted successfully") {
                toast.success('Story deleted successfully');
                setDeleteBlogId(null);
                queryClient.invalidateQueries({ queryKey: ["MY_STORIES", activeTab] });
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

    return (
        <>
            <HelmetComponent
                title='My Stories - Blogs'
                description='Manage your stories'
            />
            <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 min-h-screen">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content">My stories</h1>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link to='/new-story' className="px-3 py-1 md:px-4 md:py-2 bg-primary text-white text-sm md:text-base rounded-md hover:bg-primary/80 font-semibold cursor-pointer transition-colors">
                            Write a story
                        </Link>
                    </div>
                </div>

                <div className="border-b border-base-300 mb-4 md:mb-6">
                    <nav className="flex -mb-px min-w-max">
                        <button
                            onClick={() => handleSetActiveTab("published")}
                            className={`mr-4 sm:mr-8 py-3 md:py-4 text-sm md:text-base cursor-pointer ${activeTab == "published"
                                ? "text-base-content border-b-2 border-primary font-medium"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Published
                        </button>

                        <button
                            onClick={() => handleSetActiveTab("private")}
                            className={`mr-4 sm:mr-8 py-3 md:py-4 text-sm md:text-base cursor-pointer ${activeTab == "private"
                                ? "text-base-content border-b-2 border-primary font-medium"
                                : "text-gray-500 hover:text-gray-700"
                                }`}>
                            Private
                        </button>

                        <button
                            onClick={() => handleSetActiveTab("saved")}
                            className={`mr-4 sm:mr-8 py-3 md:py-4 text-sm md:text-base cursor-pointer ${activeTab == "saved"
                                ? "text-base-content border-b-2 border-primary font-medium"
                                : "text-gray-500 hover:text-gray-700"
                                }`}>
                            Saved
                        </button>
                    </nav>
                </div>

                {activeTab !== 'saved' ? <>
                    {isLoading ? (<StoryCardLoader length={5} />
                    ) : isError ? (
                        <p className="text-red-500">{error?.message}</p>
                    ) : (
                        <>
                            <div className="space-y-4 md:space-y-6">
                                {blogs?.pages?.flatMap(page => page?.data || []).length <= 0 ? (
                                    <div className='flex justify-center items-center h-50'>
                                        <p className='text-base-content/70 font-medium'>No stories found.</p>
                                    </div>
                                ) : blogs?.pages?.flatMap(page => page?.data || []).map(blog => (
                                    <>
                                        {
                                            (
                                                <StoryCard
                                                    key={blog.id}
                                                    blog={blog}
                                                    isFetching={false}
                                                    maxWidth='100%'
                                                    isAutherVisible={false}
                                                    isOpenFullBlog={activeTab == 'published'}
                                                    activeTab={activeTab}
                                                    isMenuShow={true}
                                                    getBlogId={(id) => setDeleteBlogId(id)}
                                                />
                                            )
                                        }

                                    </>
                                ))}
                            </div>

                            {hasNextPage ? (
                                <div className="flex justify-center my-8">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={!hasNextPage || isFetchingNextPage}
                                        className="shadow-none btn-soft btn-secondary px-4 cursor-pointer text-sm font-medium btn rounded-full">
                                        {isFetchingNextPage
                                            ? 'Loading more...'
                                            : hasNextPage
                                                ? 'Show More Blogs' : 'No more blogs'}
                                    </button>
                                </div>
                            ) : ""}
                        </>
                    )}
                </> : <>
                    {
                        savedBlogsLoading ? (<StoryCardLoader length={5} />
                        ) : savedBlogsIsError ? (
                            <p className="text-red-500">{savedBlogsError?.message}</p>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                {savedBlogs?.pages?.flatMap(page => page?.data || []).length <= 0 ? (
                                    <div className='flex justify-center items-center h-50'>
                                        <p className='text-base-content/70 font-medium'>No saved stories found.</p>
                                    </div>
                                ) : savedBlogs?.pages?.flatMap(page => page?.data || []).map(blog => (
                                    <>
                                        {
                                            isFetchingSavedBlogs ? (
                                                <StoryCardLoader key={`${blog.id}-loader`} />
                                            ) : (
                                                <StoryCard
                                                    key={blog.id}
                                                    blog={blog}
                                                    isFetching={isFetchingSavedBlogs}
                                                    maxWidth='100%'
                                                />
                                            )
                                        }
                                    </>
                                ))}
                            </div>)
                    }
                </>
                }


                <ConfirmDelete
                    showModel={deleteBlogId !== null}
                    onClose={() => setDeleteBlogId(null)}
                    onConfirm={() => confirmDeleteBlog(deleteBlogId)}
                    loading={loading}
                    message='Are you sure you want to delete this story?'
                />

            </div>
        </>
    );
};

export default MyStories;
