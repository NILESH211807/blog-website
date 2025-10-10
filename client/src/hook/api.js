import useAxios from "./useAxios";
import toast from "react-hot-toast";
import { handleResponse } from "../utils/responseHandler";

const useApi = () => {
    const { fetchData } = useAxios();
    let toastId = '1';

    // follow and unfollow
    const followUnfollow = async (userId) => {
        try {
            const response = await fetchData({
                url: '/api/user/follow-unfollow',
                method: 'PUT',
                data: { userId },
            });

            const result = handleResponse(response);
            const user = result?.data?.name || result?.data?.username || 'User';
            if (result.message == 'Followed successfully') {
                toast.success(`You're now following ${user}`, {
                    id: toastId,
                });
            } else if (result.message == 'Unfollowed successfully') {
                toast(`You unfollowed ${user}`, {
                    id: toastId,
                });
            } else {
                toast.error(result.message, {
                    id: toastId,
                });
            }
            return result?.data?.isFollowing || false;
        } catch (error) {
            console.log('error', error);
            const { message } = handleResponse(error);
            toast.error(message);
        }
    };

    // post comment
    const postComment = async (data) => {
        try {

            const response = await fetchData({
                'url': '/api/comment',
                method: 'POST',
                data
            });

            const { success, message } = handleResponse(response);

            if (!success) {
                toast.error(message);
                return;
            }
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        }
    }

    // like unlike comment
    const likeUnlikeComment = async (data) => {
        try {
            const response = await fetchData({
                url: '/api/comment/like-unlike',
                method: 'PUT',
                data
            });

            const result = handleResponse(response);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            return result.data.isLiked;
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        }
    }

    // like unlike blog
    const likeUnlikeBlog = async (data) => {
        try {
            const response = await fetchData({
                url: '/api/blog/like-unlike',
                method: 'PUT',
                data
            });

            const result = handleResponse(response);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            return result.data.isLiked;
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        }
    }

    // save story
    const saveStory = async (data) => {
        try {
            const response = await fetchData({
                url: '/api/bookmark/add-remove',
                method: 'PUT',
                data: { blogId: data }
            });

            const { success, message } = handleResponse(response);

            if (!success) {
                toast.error(message);
                return;
            }

            let isBookmarked;

            if (message == 'Bookmark added successfully') {
                toast.success('Story saved successfully', {
                    id: toastId,
                });
                isBookmarked = true;
            } else if (message == 'Bookmark removed successfully') {
                toast.success('Story removed from saved stories', {
                    id: toastId,
                });
                isBookmarked = false;
            } else {
                toast.error(message);
            }
            return isBookmarked;
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        }
    }

    const blogVisibilityChange = async (blogId) => {
        try {
            const response = await fetchData({
                url: '/api/blog/visibility-change',
                method: 'PUT',
                data: { blogId }
            });

            const { success, message } = handleResponse(response);

            if (!success) {
                toast.error(message, {
                    id: toastId,
                });
                return;
            }

            toast.success('Updated successfully', {
                id: toastId,
            });

            return response.data.isPublished;
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        }
    }

    return { followUnfollow, postComment, likeUnlikeComment, likeUnlikeBlog, saveStory, blogVisibilityChange };
}

export default useApi;