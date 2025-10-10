import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import PopularPostLoader from './Loaders/PopularPostLoader';
import { formatDate } from '../utils/utils';

const FeedSidebar = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const recommendedTopics = [
        "Programming",
        "React",
        "MongoDB",
        "Data Science",
        "Machine Learning",
        "AI",
        "Blockchain",
        "DevOps",
        "Cloud Computing",
        "Cybersecurity",
        "Software Engineering",
    ];

    const { fetchData } = useAxios();

    const {
        data: popularPosts,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["POPULAR_POSTS"],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: `/api/blog/popular?page=${pageParam}&limit=6`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 5 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: true,
        staleTime: 0,
        cacheTime: 0,
    });


    const handleTopicClick = (topic) => {
        setSearchParams({ tags: topic });
    };


    return (
        <div className='w-full max-w-[368px] border-l border-base-300 px-2 py-5 max-[1000px]:hidden'>
            <div>
                <h6 className="p-4 pb-2 text-md font-medium opacity-60 tracking-wide mb-2">Recommended Topics</h6>
                <div className="px-4 pb-4 flex flex-wrap gap-3">
                    {recommendedTopics.map(topic => (
                        <span
                            key={topic}
                            onClick={() => handleTopicClick(topic)}
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-base-300 hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer">
                            {topic}
                        </span>
                    ))}
                </div>
            </div>
            <ul className="list mt-4 border-t border-base-200 pt-2 sticky top-0">
                <li className="p-4 pb-2 text-md font-medium opacity-60 tracking-wide">Popular Blog Posts</li>
                {
                    isLoading ? (
                        <PopularPostLoader />
                    ) : isError ? (
                        <div className='w-full h-96 flex items-center justify-center font-semibold'>
                            {error?.message || "Something went wrong"}
                        </div>
                    ) : (
                        <>
                            {popularPosts?.pages?.flatMap(page => page?.data || []).length > 0 ? (
                                popularPosts?.pages?.flatMap(page => page?.data || []).map((post, index) => (
                                    <li key={index} className="list-row p-3 cursor-pointer hover:bg-base-300 rounded-md transition-colors" onClick={() => navigate(`/blog/${post.id}`)}>
                                        <div className="text-3xl font-bold text-primary/30 tabular-nums">0{index + 1}</div>
                                        <div className="list-col-grow ml-3">
                                            <h2 className="text-base font-semibold">{post?.title?.slice(0, 30) + '...'}</h2>
                                            <p className="text-xs mt-1 text-gray-600">{post.text}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs font-medium text-primary">{post.author.name}</span>
                                                <span className="text-xs text-gray-500">• {formatDate(post.createdAt)}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <div className='w-full h-96 flex justify-center font-semibold mt-10'>No blogs found</div>
                            )}
                        </>
                    )
                }
            </ul>
        </div>
    )
}

export default FeedSidebar
