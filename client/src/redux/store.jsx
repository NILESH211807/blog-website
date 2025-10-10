import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import newStoryReducer from '../features/blogSlice';
import userActionsReducer from '../features/userActionsSlice';
import adminAuthReducer from '../features/adminAuthSlice';
import { apiSlice } from '../features/api/apiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        newStory: newStoryReducer,
        userActions: userActionsReducer,
        adminAuth: adminAuthReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})