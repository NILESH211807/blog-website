import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    followingStatus: {},
    commentLikesStatus: {},
    blogLikesStatus: {},
    savedBlogs: {},
}

// create slice
const userActionsSlice = createSlice({
    initialState,
    name: 'userActions',
    reducers: {
        setFollowingStatus: (state, action) => {
            state.followingStatus = {
                ...state.followingStatus,
                ...action.payload,
            };
        },
        setCommentLike: (state, action) => {
            state.commentLikesStatus = {
                ...state.commentLikesStatus,
                ...action.payload,
            };
        },
        setBlogLike: (state, action) => {
            state.blogLikesStatus = {
                ...state.blogLikesStatus,
                ...action.payload,
            };
        },
        setSavedBlogs: (state, action) => {
            state.savedBlogs = {
                ...state.savedBlogs,
                ...action.payload,
            };
        },
    }
});


export const { setFollowingStatus, setCommentLike, setBlogLike, setSavedBlogs } = userActionsSlice.actions;
export default userActionsSlice.reducer;