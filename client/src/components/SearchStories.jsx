import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowCircleDown, FaHeart } from 'react-icons/fa';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import Loader from './Loader';
import StoryCard from './StoryCard';
import StoryCardLoader from './Loaders/StoryCardLoader';

const SearchStories = () => {

    const { fetchData } = useAxios();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    const {
        data: blogs,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["SEARCHED_BLOGS", query],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: `/api/blog/search?query=${query}&page=${pageParam}&limit=10`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 10 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: !!query,
    });


    return (
        <>
            {isLoading ? (
                <StoryCardLoader length={5} />
            ) : isError ? (
                <div className='w-full h-96 flex items-center justify-center font-semibold'>
                    {error?.message || "Something went wrong"}
                </div>
            ) : (
                <>
                    {blogs?.pages?.flatMap(page => page?.data || []).length > 0 ? (
                        <>
                            {blogs.pages.flatMap(page => page?.data || []).map(blog => (
                                <StoryCard key={blog.id} blog={blog} />
                            ))}


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
                                    <span className='ml-1'><FaArrowCircleDown size={15} /></span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='w-full h-96 flex items-center justify-center font-semibold'>No blogs found</div>
                    )}
                </>
            )}
        </>
    )
}

export default SearchStories
