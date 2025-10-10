import React, { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loader from './components/Loader';
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Blog = lazy(() => import("./pages/Blog"));
const NewStory = lazy(() => import("./pages/NewStory"));
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoutes from './AdminRoutes';
import Search from './pages/Search';
const Profile = lazy(() => import("./pages/Profile"));
const MyStories = lazy(() => import("./pages/MyStories"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditBlog = lazy(() => import("./pages/EditBlog"));

// admin panel routes
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));
const Admins = lazy(() => import("./pages/admin/Admins"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));

const App = () => {

    // React Query
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                cacheTime: 1000 * 60 * 10, // 10 minutes
            },
        },
    });
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={
                <div className='w-full h-screen flex items-center justify-center bg-base-100'>
                    <Loader />
                </div>
            }>
                <Routes>
                    <Route path='/' element={
                        <ProtectedRoutes>
                            <Home />
                        </ProtectedRoutes>
                    } />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='blog/:id' element={
                        <ProtectedRoutes>
                            <Blog />
                        </ProtectedRoutes>
                    } />
                    <Route path='/new-story' element={
                        <ProtectedRoutes>
                            <NewStory />
                        </ProtectedRoutes>
                    } />
                    <Route path='/profile' element={
                        <ProtectedRoutes>
                            <Profile />
                        </ProtectedRoutes>
                    } />

                    <Route path='/my-stories' element={
                        <ProtectedRoutes>
                            <MyStories />
                        </ProtectedRoutes>
                    } />

                    <Route path='/user/:username' element={
                        <ProtectedRoutes>
                            <UserProfile />
                        </ProtectedRoutes>
                    } />
                    <Route path='/search' element={
                        <ProtectedRoutes>
                            <Search />
                        </ProtectedRoutes>
                    } />

                    <Route path='/edit-blog/:id' element={
                        <ProtectedRoutes>
                            <EditBlog />
                        </ProtectedRoutes>
                    } />

                    {/* admin panel routes */}
                    <Route path='/admin/login' element={
                        <AdminLogin />
                    } />

                    <Route path='/admin' element={
                        <AdminRoutes>
                            <AdminDashboard />
                        </AdminRoutes>
                    } />

                    <Route path='/admin/users' element={
                        <AdminRoutes>
                            <AdminUsers />
                        </AdminRoutes>
                    } />

                    <Route path='/admin/blogs' element={
                        <AdminRoutes>
                            <AdminBlogs />
                        </AdminRoutes>
                    } />

                    <Route path='/admin/admins' element={
                        <AdminRoutes>
                            <Admins />
                        </AdminRoutes>
                    } />

                    <Route path='/admin/profile' element={
                        <AdminRoutes>
                            <AdminProfile />
                        </AdminRoutes>
                    } />

                </Routes>
            </Suspense>
        </QueryClientProvider>
    )
}

export default App
