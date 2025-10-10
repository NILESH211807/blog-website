import React from 'react'
import Editor from '../components/Editor';
import BlogPreview from '../components/BlogPreview';
import { useSelector } from 'react-redux';
import HelmetComponent from '../seo/Helmet';

const NewStory = () => {
    const { pageStep } = useSelector((state) => state.newStory);


    return (
        <>
            <HelmetComponent
                title='New Story - Blogs'
                description='Write a new story'
            />
            <div className="max-w-6xl mx-auto  px-5 py-8">
                <div className='max-w-4xl mx-auto '>
                    <div className='w-full flex items-center justify-center'>
                        <ul className="steps w-full mb-10">
                            <li className={`step text-sm font-semibold ${pageStep >= 1 && ' step-primary'}`}>Write story</li>
                            <li className={`step text-sm font-semibold ${pageStep >= 2 && ' step-primary'}`}>Preview</li>
                            <li className={`step text-sm font-semibold ${pageStep == 3 && ' step-primary'}`}>Done</li>
                        </ul>
                    </div>
                    {/* editor step 1 */}
                    {pageStep == 1 && (<Editor />)}
                </div>
                {/* preview step 2 */}
                {pageStep == 2 && (<BlogPreview />)}

            </div>
        </>
    )
}

export default NewStory
