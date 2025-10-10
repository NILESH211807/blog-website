import React, { useState, useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setContent, setPageStep, setTitle } from '../features/blogSlice'
import Button from './Button'

const Editor = ({ blogTitle, blogContent }) => {

    const quillRef = useRef(null);
    const editorRef = useRef(null);
    const titleInputRef = useRef(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { title, content, pageStep } = useSelector((state) => state.newStory);


    useEffect(() => {
        if (!quillRef.current) {
            editorRef.current = new Quill('#editor', {
                theme: 'snow',
                placeholder: 'Write your story...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        ['clean']
                    ]
                }
            })
            quillRef.current = editorRef.current
            // Set initial content if available
            if (content) {
                quillRef.current.root.innerHTML = content
            }
        }
    }, [content]);

    useEffect(() => {
        if (quillRef.current && blogContent) {
            quillRef.current.root.innerHTML = blogContent;
        }
    }, [blogContent]);


    const handleNext = async () => {
        setLoading(true);
        try {

            const title = titleInputRef.current.value;
            const content = quillRef.current.root.innerHTML;

            if (!title) {
                throw new Error('Please Enter Title');
            } else if (!content) {
                throw new Error('Please Conter Content');
            }

            await new Promise((resolve) => setTimeout(resolve, 500));

            dispatch(setTitle({ title }));
            dispatch(setContent({ content }));
            dispatch(setPageStep({ pageStep: 2 }));

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <textarea
                ref={titleInputRef}
                defaultValue={title || blogTitle}
                className="textarea mb-7 w-full resize-none rounded-sm text-2xl font-bold border-none bg-base-200 focus:outline-none focus:ring-0 focus:border-primary pl-4 font3"
                placeholder="Enter Your Title"
                style={{ overflow: 'hidden' }}
                onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}></textarea>

            <div className="mb-8">
                <div id="editor" className="min-h-[400px] px-5 border border-base-300 max-sm:p-2"></div>
            </div>

            <div className="flex justify-end">
                <Button title='Next' type='button' className='!w-46 px-6 h-[45px] mt-4 max-sm:!w-full uppercase' loading={loading} onClick={handleNext} />
            </div>
        </>
    )
}

export default Editor
