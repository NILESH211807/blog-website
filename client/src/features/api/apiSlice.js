import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQueryWithReauth } from './fetchBaseQuery';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQueryWithReauth,
    tagTypes: ['User', 'Admin', 'AdminProfile', 'Blog'],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/api/admin/dashboard-stats',
            providesTags: [{ type: 'User', id: 'DASHBOARD_USERS' }],
        }),
        getUsers: builder.query({
            query: ({ page = 1, search = '' }) => {
                if (search) {
                    return `/api/admin/users?page=${page}&limit=10&search=${search}`;
                } else {
                    return `/api/admin/users?page=${page}&limit=10`;
                }
            },
            providesTags: [{ type: 'User', id: 'LIST' }],
        }),
        userBlockUnblock: builder.mutation({
            query: ({ userId, active }) => ({
                url: '/api/admin/user/block-unblock-user',
                method: 'PUT',
                body: { userId, active },
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' },
                { type: 'User', id: 'DASHBOARD_USERS' }
            ],
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: '/api/admin/user/update-user',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' },
                { type: 'User', id: 'DASHBOARD_USERS' }
            ],
        }),
        logout: builder.mutation({
            query: () => '/api/admin/auth/logout',
        }),
        getAdmins: builder.query({
            query: ({ page = 1, search = '' }) => {
                if (search) {
                    return `/api/admin/admins?page=${page}&limit=10&search=${search}`;
                } else {
                    return `/api/admin/admins?page=${page}&limit=10`;
                }
            },
            providesTags: [{ type: 'Admin', id: 'ADMINS_LIST' }],
        }),
        createAdmin: builder.mutation({
            query: (data) => ({
                url: '/api/admin/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Admin', id: 'ADMINS_LIST' }],
        }),
        adminBlockUnblock: builder.mutation({
            query: (data) => ({
                url: '/api/admin/block-unblock-admin',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [{ type: 'Admin', id: 'ADMINS_LIST' }],
        }),
        updateAdmin: builder.mutation({
            query: (data) => ({
                url: '/api/admin/update-admin',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [{ type: 'Admin', id: 'ADMINS_LIST' }],
        }),
        updateAdminProfile: builder.mutation({
            query: (data) => ({
                url: '/api/admin/update-profile',
                method: 'PUT',
                body: data,
            }),
        }),
        changeAdminPassword: builder.mutation({
            query: (data) => ({
                url: '/api/admin/change-password',
                method: 'PUT',
                body: data,
            }),
        }),
        getBlogs: builder.query({
            query: ({ page = 1, search = '' }) => {
                if (search) {
                    return `/api/admin/blogs?page=${page}&limit=10&search=${search}`;
                } else {
                    return `/api/admin/blogs?page=${page}&limit=10`;
                }
            },
            providesTags: [{ type: 'Blog', id: 'BLOGS_LIST' }],
        }),
        deleteBlog: builder.mutation({
            query: (blogId) => ({
                url: `/api/admin/blog/delete/${blogId}`,
                method: 'DELETE',
            }),
        }),
        blogPublishPrivate: builder.mutation({
            query: (data) => ({
                url: '/api/admin/blog/publish-private',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const { useGetDashboardStatsQuery,
    useGetUsersQuery,
    useUserBlockUnblockMutation,
    useUpdateUserMutation,
    useLogoutMutation,
    useGetAdminsQuery,
    useCreateAdminMutation,
    useAdminBlockUnblockMutation,
    useUpdateAdminMutation,
    useUpdateAdminProfileMutation,
    useChangeAdminPasswordMutation,
    useGetBlogsQuery,
    useDeleteBlogMutation,
    useBlogPublishPrivateMutation,
} = apiSlice;