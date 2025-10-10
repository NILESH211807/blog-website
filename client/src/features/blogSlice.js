import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pageStep: 1,
    title: '',
    content: '',
    tags: [],
    bannerImage: null,
}

// slice
const newStorySlice = createSlice({
    name: 'newStory',
    initialState,
    reducers: {
        setPageStep: (state, action) => {
            state.pageStep = action.payload.pageStep;
        },
        setTitle: (state, action) => {
            state.title = action.payload.title;
        },
        setContent: (state, action) => {
            state.content = action.payload.content;
        },
        setTags: (state, action) => {
            state.tags = action.payload.tags;
        },
        clearNewSotry: (state) => {
            state.pageStep = 1;
            state.title = '';
            state.content = '';
            state.tags = [];
            state.bannerImage = null;
        },
    }
});

export const { setPageStep, setTitle, setContent, setTags, clearNewSotry } = newStorySlice.actions;
export default newStorySlice.reducer;
