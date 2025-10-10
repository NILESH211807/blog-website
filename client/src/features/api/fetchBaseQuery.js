import { fetchBaseQuery as originalFetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = originalFetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URI,
    prepareHeaders: (headers, { endpoint, getState, extra, type }) => {
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        return headers;
    },

    credentials: 'include',
});



// Custom baseQuery with reauth logic
export const fetchBaseQueryWithReauth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        window.location.replace('/admin/login');
    }
    return result;
};
