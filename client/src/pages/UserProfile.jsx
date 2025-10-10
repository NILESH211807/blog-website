import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import useAxios from "../hook/useAxios";
import Loader from "../components/Loader";
import useApi from "../hook/api";
import StoryCard from "../components/StoryCard";
import { useSelector } from "react-redux";
import StoryCardLoader from "../components/Loaders/StoryCardLoader";
import HelmetComponent from "../seo/Helmet";

const UserProfile = () => {

    const [activeTab, setActiveTab] = useState("home");
    const { username } = useParams();
    const { fetchData } = useAxios();
    const { followUnfollow } = useApi();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState(0);
    const { user: loggedUser } = useSelector((state) => state.auth);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["USER_PROFILE_INFO", username],
        queryFn: async () => await fetchData({
            url: `/api/user/${username}`,
            method: 'GET',
        }),
        refetchOnWindowFocus: false,
        enabled: !!username,
        staleTime: 0,
        cacheTime: 0,
    });

    const {
        data: userBlogs,
        isPending: userBlogsLoading,
        isError: userBlogsIsError,
        error: userBlogsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["USER_BLOGS", username],
        queryFn: async ({ pageParam = 1 }) => await fetchData({
            url: `/api/user/blogs/${username}?page=${pageParam}&limit=10`,
            method: 'GET',
        }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length === 10 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        enabled: !!username,
        staleTime: 0,
        cacheTime: 0,
    })

    const user = data?.data;

    useEffect(() => {
        if (user) {
            setIsFollowing(user.isFollowing);
            setFollowers(user.followers);
        }
    }, [user, isPending]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    // follow unfollow handler
    const followUnfollowHandler = async () => {
        const userId = user?.id;
        if (!userId) return;
        setIsFollowing(!isFollowing);
        setFollowers(isFollowing ? followers - 1 : followers + 1);
        const updatedStatus = await followUnfollow(userId, isFollowing);
        setIsFollowing(updatedStatus);
        setFollowers(isFollowing ? followers - 1 : followers + 1);
    }

    if (isPending) {
        return (
            <div className="w-full h-screen bg-base-100 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-screen bg-base-100 flex items-center justify-center">
                <p className="text-2xl font-bold">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            <HelmetComponent
                title={`${user?.name || user?.username} - Blogs`}
                description={user?.bio || "This is user profile"}
            />
            <div className='w-full bg-base-100 flex justify-center'>
                <div className='w-full max-w-[968px] flex items-center justify-center max-xl:px-6'>
                    <div className='w-full min-h-screen max-w-[800px]'>
                        <h1 className="text-3xl font-bold mb-6 mt-14 hidden min-[1000px]:block">{user?.username}</h1>
                        <div className="w-full  min-[1000px]:hidden my-5">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-full flex items-center gap-3 flex-col py-5">
                                    <div className="w-full flex items-center gap-4">
                                        {
                                            user?.profileImage ? (
                                                <img
                                                    src={user?.profileImage}
                                                    alt={user?.name || user?.username}
                                                    className="w-16 h-16 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-base-300 flex items-center justify-center">
                                                    <FiUser size={25} />
                                                </div>
                                            )
                                        }
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-bold text-2xl">{user?.name || user?.username}</h3>
                                            <p className="text-md text-base-content/80 font-semibold">{followers} Followers</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-base-content/70 font-semibold">{user?.bio}</p>
                                    <button onClick={() => followUnfollowHandler(isFollowing)} className={`w-full my-5 px-6 py-2.5 rounded-full cursor-pointer text-white font-semibold text-sm ${isFollowing ? 'bg-primary/80' : 'bg-primary'}`}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-8 border-b border-base-300 min-[1000px]:my-14">
                            <div onClick={() => setActiveTab("home")} className={`px-4 py-2 flex items-center gap-2 cursor-pointer border-b-2 font-semibold ${activeTab == "home" ? "border-primary text-primary" : "border-transparent text-base-content/70"}`}>
                                Home
                            </div>
                        </div>

                        <div className="w-full">
                            {
                                userBlogsLoading ? (
                                    <StoryCardLoader length={5} />
                                ) : userBlogsIsError ? (
                                    <div className='w-full h-96 flex items-center justify-center font-semibold'>
                                        {userBlogsError?.message || "Something went wrong"}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {userBlogs?.pages?.flatMap((page) => page?.data || []).map((blog, index) => (
                                            <StoryCard
                                                blog={blog} key={`${blog.id}-${index}`} isFetching={isFetchingNextPage}
                                                maxWidth="full"
                                                isLikeCommentCount={false} />
                                        ))}
                                        {hasNextPage ? (
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
                                        ) : (
                                            <div className="flex justify-center my-8">
                                                <h5 className='text-base-content/70 font-medium'>No more blogs</h5>
                                            </div>
                                        )}
                                    </div>
                                ) || null
                            }
                        </div>
                    </div>
                </div>

                {/* sidebar  */}
                <div className='w-full max-w-[368px] border-l border-base-300 px-2 py-5 max-[1000px]:hidden '>
                    <div className="w-full flex flex-col items-center pl-5 sticky top-0">
                        {user?.profileImage ? (
                            <img
                                src={user?.profileImage}
                                alt={user?.name || user?.username}
                                className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-base-300 flex items-center justify-center">
                                <FiUser size={30} />
                            </div>)}

                        <div className="mt-5">
                            <h3 className="font-bold text-lg my-3">{user?.name || user?.username}</h3>
                            <p className="text-sm text-base-content/70 font-semibold">{user?.bio}</p>
                        </div>
                        {/* followers   */}
                        <div className="w-full flex justify-center mt-10 gap-20">
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-lg">{user?.following}</p>
                                <p className="text-sm text-base-content/80 font-semibold">Following</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-lg">{followers}</p>
                                <p className="text-sm text-base-content/80 font-semibold">Followers</p>
                            </div>
                        </div>
                        {/* follow button  */}
                        {
                            loggedUser?.id !== user?.id && (
                                <div className="w-full flex justify-center mt-10">
                                    <button onClick={() => followUnfollowHandler(isFollowing)} className={`px-6 py-2 rounded-full cursor-pointer text-white font-semibold text-sm ${isFollowing ? 'bg-primary/80' : 'bg-primary'}`}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
                            )
                        }

                        {user?.socialLinks && Object.keys(user?.socialLinks)?.length > 0 && (
                            <div className="w-full flex justify-center flex-col mt-10 gap-5">
                                <p className="text-sm text-base-content/70 font-semibold">Follow on</p>
                                <div className="w-full flex items-center justify-between gap-3 px-4 mt-3">
                                    {/* all socalmedia with own icon */}
                                    {Object.keys(user?.socialLinks).map((key, index) => (
                                        <Link key={index} to={user?.socialLinks[key]} target="_blank" rel="noopener noreferrer" className={
                                            `text-2xl text-base-content/70 p-2 bg-base-300 rounded-sm
                                        ${key === "youtube" ? "hover:text-[#FF0000]" : key === "facebook" ? "hover:text-[#5269cc]" : key === "twitter" ? "hover:text-[#00acee]" : key === "instagram" ? "hover:text-[#e4405f]" : ""}`
                                        }>
                                            {key === "youtube" && <FaYoutube />}
                                            {key === "facebook" && <FaFacebook />}
                                            {key === "twitter" && <FaTwitter />}
                                            {key === "instagram" && <FaInstagram />}
                                        </Link>
                                    ))}
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile;
