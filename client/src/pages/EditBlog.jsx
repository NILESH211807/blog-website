import React, { useEffect, useState } from 'react'
import Editor from '../components/Editor';
import BlogPreview from '../components/BlogPreview';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useAxios from '../hook/useAxios';
import toast from 'react-hot-toast';
import { handleResponse } from '../utils/responseHandler';
import Loader from '../components/Loader';
import BlogEditPreview from '../components/BlogEditPreview';
import HelmetComponent from '../seo/Helmet';

const EditBlog = () => {
    const { pageStep } = useSelector((state) => state.newStory);
    const { id } = useParams();
    const { fetchData } = useAxios();
    const [blogTitle, setBlogTitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;
    const isEditPath = pathname?.includes('edit-blog');
    const [tags, setTags] = useState([]);
    const [bannerImage, setBannerImage] = useState(null);

    const getBlogDetails = async () => {
        setLoading(true);
        try {
            const response = await fetchData({
                url: `/api/blog/${id}`,
                method: 'GET',
            });

            const { success, message, data } = handleResponse(response);
            if (success) {
                setBlogTitle(data.title);
                setBlogContent(data.content);
                setTags(data.tags);
                setBannerImage(data.bannerImage);
            } else {
                toast.error(message);
            }
        } catch (error) {
            const { message } = handleResponse(error);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (!id) return;
        getBlogDetails();
    }, [id]);

    if (loading) return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Loader />
        </div>
    )

    return (
        <>
            <HelmetComponent
                title='Edit Story - Blogs'
                description='Edit your story'
            />
            <div className="max-w-6xl mx-auto  px-5 py-8">
                <div className='max-w-4xl mx-auto '>
                    <div className='w-full flex items-center justify-center'>
                        <ul className="steps w-full mb-10">
                            <li className={`step text-sm font-semibold ${pageStep >= 1 && ' step-primary'}`}>Edit story</li>
                            <li className={`step text-sm font-semibold ${pageStep >= 2 && ' step-primary'}`}>Preview</li>
                            <li className={`step text-sm font-semibold ${pageStep == 3 && ' step-primary'}`}>Done</li>
                        </ul>
                    </div>
                    {/* editor step 1 */}
                    {pageStep == 1 && (<Editor blogTitle={blogTitle} blogContent={blogContent} />)}
                </div>

                {
                    pageStep == 2 && isEditPath ?
                        <BlogEditPreview
                            prevTitle={blogTitle}
                            prevContent={blogContent}
                            bannerImage={bannerImage}
                            tags={tags} /> :
                        pageStep == 2 &&
                        <BlogPreview />
                }
            </div>
        </>
    )
}

export default EditBlog
