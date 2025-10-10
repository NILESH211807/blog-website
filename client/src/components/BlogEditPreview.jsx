import React, { useState, useRef, useCallback } from 'react'
import { FiImage, FiX, FiUpload } from 'react-icons/fi'
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearNewSotry, setPageStep } from '../features/blogSlice';
import useAxios from '../hook/useAxios';
import { handleResponse } from '../utils/responseHandler';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';
import { selectStyle, tagsOptions } from '../utils/utils';

const BlogEditPreview = ({
    bannerImage: prevBannerImage, tags, prevTitle, prevContent
}) => {

    const [selectedOptions, setSelectedOptions] = useState(
        tags.map(tag => ({ label: tag, value: tag })) || []
    );
    const { id } = useParams();
    const [previewImage, setPreviewImage] = useState(prevBannerImage);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [options, setOptions] = useState(tagsOptions);
    const [loading, setLoading] = useState(false);
    const { fetchData } = useAxios();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { title, content } = useSelector((state) => state.newStory);

    // Improved image validation and processing
    const validateAndProcessImage = useCallback((file) => {
        const imageType = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) return false;

        if (!imageType.includes(file.type)) {
            toast.error('Only JPEG, PNG, WEBP, and JPG images are allowed');
            return false;
        }

        if (file.size > maxSize) {
            toast.error('Image size should be less than 5MB');
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
            setBannerImage(file);
        };
        reader.readAsDataURL(file);
        return true;
    }, [bannerImage]);

    // Handle file input change
    const handleImageChange = useCallback((event) => {
        const file = event.target.files?.[0];
        validateAndProcessImage(file);
    }, [validateAndProcessImage]);

    // Improved drag and drop handlers
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        // Handle both single and multiple files
        const items = e.dataTransfer.items;
        const files = e.dataTransfer.files;

        // Check if DataTransferItemList interface is supported and has image items
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    if (validateAndProcessImage(file)) break;
                }
            }
        } else if (files && files.length > 0) {
            // Fallback to DataTransfer interface
            validateAndProcessImage(files[0]);
        }
    }, [validateAndProcessImage]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);


    const onPublish = async () => {
        setLoading(true);
        try {

            const formData = new FormData();
            formData.append('blogId', id);
            // check if title is changed
            if (prevTitle !== title) {
                formData.append('title', title);
            }

            // check if content is changed
            if (prevContent !== content) {
                console.log('content changed');
                formData.append('content', content);
            }
            // check if tags is changed
            const tagValues = selectedOptions.map(option => option.value);
            if (JSON.stringify(tags) !== JSON.stringify(tagValues)) {
                formData.append('tags', JSON.stringify(tagValues));
            }

            if (tagValues.length <= 0) {
                toast.error('Please select at least one topic');
                return;
            }

            if (bannerImage) {
                formData.append('bannerImage', bannerImage);
            }

            const response = await fetchData({
                url: '/api/blog/edit-blog',
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const { success, message } = handleResponse(response);

            if (success && message == "Blog updated successfully") {
                toast.success('Story updated successfully');
                dispatch(clearNewSotry());
                navigate('/', { replace: true });

            } else {
                toast.error(message);
            }

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full max-w-6xl mx-auto min-sm:px-4'>
            <h2 className='p-4 text-lg font-semibold main-font'>Story Preview</h2>
            <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Preview Section */}
                <div className="w-full md:w-2/3 rounded-lg">
                    {/* Improved banner image with drag and drop */}
                    <div
                        ref={dropZoneRef}
                        className={`w-full h-48 md:h-64 mb-6 rounded-sm cursor-pointer border border-dashed ${isDragging ? 'border-primary bg-blue-50' : 'border-base-100'} hover:border-primary overflow-hidden bg-gray-100 relative transition-colors duration-200`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                        aria-label="Drag and drop area for blog banner image"
                        role="button"
                        tabIndex={0}
                    >
                        {!previewImage && (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <FiImage size={24} className="text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Drag & drop an image or click to browse</p>
                                {isDragging && (
                                    <div className="absolute inset-0 bg-blue-100/30 flex items-center justify-center">
                                        <FiUpload size={32} className="text-primary" />
                                    </div>
                                )}
                            </div>
                        )}
                        {previewImage && (
                            <div className="relative w-full h-full">
                                <img
                                    src={previewImage}
                                    alt="Blog banner"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBannerImage(null);
                                        setPreviewImage(prevBannerImage);
                                        fileInputRef.current.value = '';
                                    }}
                                    aria-label="Remove image">
                                    <FiX size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="upload_image"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        aria-label="Upload blog banner image"
                    />
                    <h1 className="text-xl md:text-2xl font-bold mb-4">{title}</h1>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>

                {/* Tags and Publish Section */}
                <div className="w-full md:w-2/3 flex flex-col main-font">
                    <div className="min-sm:border min-sm:border-base-300 min-sm:rounded-sm min-sm:px-4 py-4 mb-4">
                        <h3 className="font-semibold mb-3">Add or change topics (up to 5)</h3>
                        <p className="text-sm text-gray-500 mb-4">So readers know what your story is about</p>

                        <div className="flex items-center">
                            <Select
                                options={options}
                                isMulti
                                placeholder="Add a topic"
                                value={selectedOptions}
                                onChange={(selected) => {
                                    if (selected && selected.length <= 5) {
                                        setSelectedOptions(selected);
                                    } else if (selected && selected.length > 5) {
                                        toast.error('You can select up to 5 topics only');
                                        setSelectedOptions(selected.slice(0, 5));
                                    }
                                }}
                                className="w-full text-sm"
                                styles={selectStyle}
                            />
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <Button title='Publish' type='button' loading={loading} onClick={onPublish} />
                            <button
                                onClick={() => dispatch(setPageStep({ pageStep: 1 }))}
                                className="w-full cursor-pointer py-3 bg-base-300 rounded-sm hover:bg-base-300 font-semibold capitalize text-sm">Back to editing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogEditPreview;
