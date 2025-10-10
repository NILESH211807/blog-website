import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from '../hook/useAxios';
import Loader from './Loader';
import { FaArrowCircleDown } from 'react-icons/fa';
import useApi from '../hook/api';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingStatus } from '../features/userActionsSlice';
import SearchUserLoader from './Loaders/SearchUserLoader';

const SearchUser = ({ query }) => {
   const navigate = useNavigate();
   const { fetchData } = useAxios();
   const { followUnfollow } = useApi();
   const dispatch = useDispatch();
   const { followingStatus } = useSelector((state) => state.userActions);


   const {
      data: allUsers,
      isLoading,
      isError,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: ["USERS", query],
      queryFn: async ({ pageParam = 1 }) => await fetchData({
         url: `api/user/search?query=${query}&page=${pageParam}&limit=10`,
         method: 'GET',
      }),
      getNextPageParam: (lastPage, allPages) => {
         return lastPage?.data?.length === 10 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      enabled: !!query,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 2,
   });

   const handleFollowAndUnfollow = async (enevt, userId, user) => {
      enevt.stopPropagation();
      if (!userId) return;

      const isFollowing = !(followingStatus[userId] ?? user.isFollowing);
      dispatch(setFollowingStatus({ [userId]: isFollowing }));
      const updatedStatus = await followUnfollow(userId, isFollowing);
      dispatch(setFollowingStatus({ [userId]: updatedStatus }));

   }

   return (
      <div className="w-full max-w-3xl mx-auto">
         {isLoading ? (
            <SearchUserLoader length={5} />
         ) : isError ? (
            <div className="flex justify-center items-center h-64 text-error">
               {error?.message || "Something went wrong"}
            </div>
         ) : (
            <>
               {allUsers?.pages?.flatMap(page => page?.data || []).length > 0 ? (
                  <div className="space-y-4 my-6 max-sm:px-4">
                     {allUsers.pages.flatMap(page => page?.data || []).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-base-300 rounded-lg bg-base-100 max-sm:flex-col">
                           <div className="flex items-center justify-between gap-4 flex-1 cursor-pointer max-sm:w-full max-sm:gap-5" onClick={() => navigate(`/user/${user.username}`)}>
                              <div className="w-16 h-16 overflow-hidden bg-base-200 flex-shrink-0">
                                 {user.profileImage ? (
                                    <img
                                       src={user.profileImage}
                                       alt={user.name}
                                       className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                       <FiUser size={30} />
                                    </div>
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h3 className="font-bold text-md truncate flex items-center">
                                    <span className='mr-3'>{user.name}</span>{user.username}
                                 </h3>
                                 <p className="text-sm text-base-content/70"></p>
                                 <p className="text-sm line-clamp-2 mt-1">{user.bio || "No bio available"}</p>
                              </div>
                           </div>
                           <button
                              onClick={(event) => handleFollowAndUnfollow(event, user.id, user)}
                              className={`max-sm:w-full max-sm:mt-5 px-6 py-2 cursor-pointer rounded-sm text-sm font-medium transition-colors ${(followingStatus[user.id] ?? user.isFollowing)
                                 ? 'bg-primary text-white hover:bg-primary/90'
                                 : 'border border-primary text-primary hover:bg-primary/10'}`}>
                              {(followingStatus[user.id] ?? user.isFollowing) ? 'Following' : 'Follow'}
                           </button>
                        </div>
                     ))}

                     {hasNextPage && (
                        <div className="flex justify-center my-8">
                           <button
                              onClick={() => fetchNextPage()}
                              disabled={!hasNextPage || isFetchingNextPage}
                              className="shadow-none btn-soft btn-secondary px-4 cursor-pointer text-sm font-medium btn rounded-full">
                              {isFetchingNextPage
                                 ? 'Loading more...'
                                 : hasNextPage
                                    ? 'Show More Users'
                                    : 'No more users'}
                              <span className='ml-1'><FaArrowCircleDown size={15} /></span>
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex justify-center items-center h-64 text-base-content/70 font-medium">
                     No users found matching "{query}"
                  </div>
               )}
            </>
         )}
      </div>
   );
};

export default SearchUser;
