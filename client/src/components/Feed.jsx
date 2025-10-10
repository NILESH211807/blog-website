import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import Loader from './Loader';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import StoryCard from './StoryCard';
import { handlePageScroller } from '../utils/scrollhandler';
import StoryCardLoader from './Loaders/StoryCardLoader';

const Feed = () => {
    const { fetchData } = useAxios();
    const { user } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();
    const { blogLikesStatus } = useSelector((state) => state.userActions);
    const tags = searchParams.get('tags');

    const {
        data: blogs,
        isLoading,
        isError,
        isFetching,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["BLOGS", tags],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: tags ?
                `/api/blog/get-blogs?page=${pageParam}&limit=10&query=${tags}` :
                `/api/blog/get-blogs?page=${pageParam}&limit=10`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 10 ?
                allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: !!user,
        staleTime: 0,
        cacheTime: 0,
    });


    // intinity scroll 
    useEffect(() => {
        const handleScroll = () => {
            if (!isFetchingNextPage && hasNextPage) {
                handlePageScroller(fetchNextPage);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    return (
        <>
            {isLoading ? (
                <StoryCardLoader maxWidth='680px' length={5} />
            ) : isError ? (
                <div className='w-full h-96 flex items-center justify-center font-semibold'>
                    {error?.message || "Something went wrong"}
                </div>
            ) : (
                <>
                    {blogs?.pages?.flatMap(page => page?.data || []).length > 0 ? (
                        <>
                            {blogs.pages.flatMap((page) => page?.data || []).map((blog, index) => (
                                <StoryCard
                                    blog={blog} key={`${blog.id}-${index}`} isFetching={isFetching} />
                            ))}

                            {hasNextPage ? (
                                <div className="flex justify-center my-8">
                                    <h5 className='text-base-content/70 font-medium'>Loading...</h5>
                                </div>
                            ) : (
                                <div className="flex justify-center my-8">
                                    <h5 className='text-base-content/70 font-medium'>No more blogs</h5>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='w-full h-96 flex items-center justify-center font-semibold'>No blogs found</div>
                    )}
                </>
            )}
        </>
    )
}

export default Feed
