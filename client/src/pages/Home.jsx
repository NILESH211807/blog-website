import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Feed from '../components/Feed';
import FeedSidebar from '../components/FeedSidebar';
import { useSearchParams } from 'react-router-dom';
import HelmetComponent from '../seo/Helmet';

const Home = () => {

    const scrollRef = useRef(null);

    const categories = [
        "All", "Technology", "Programming", "Web Development",
        "Data Science", "AI", "Mobile", "Design", "DevOps",
        "Cloud", "Blockchain", "Security"
    ];

    const [activeCategory, setActiveCategory] = useState("All");
    const [searchParams, setSearchParams] = useSearchParams();

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -200 : 200;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleSearchByCategory = useCallback((category) => {
        setActiveCategory(category);
        if (category == 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ tags: category });
        }
    }, [setSearchParams]);

    // on page load clear search params
    useEffect(() => {
        setSearchParams({});
    }, [])


    return (
        <>
            <HelmetComponent
                title='Home - Blogs'
                description='Home page of the website'
            />
            <div className='w-full bg-base-100 flex justify-center'>
                <div className='w-full max-w-[968px] min-h-screen'>
                    <div className='w-full max-w-[700px] mx-auto mb-6 sticky top-0 bg-base-100 z-20 py-2 border-b border-base-300'>
                        <button
                            onClick={() => scroll('left')}
                            className='absolute -left-5 top-1/2 max-[720px]:hidden -translate-y-1/2 cursor-pointer bg-base-100 rounded-full p-2 z-10'>
                            <FiChevronLeft size={20} />
                        </button>
                        <div ref={scrollRef}
                            className='flex gap-2 md:gap-3 overflow-x-auto py-2 md:py-3 px-4 md:px-8 scrollbar-hide'
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleSearchByCategory(category)}
                                    className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory == category
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-base-100 hover:bg-base-300 hover:shadow-sm'
                                        }`}>
                                    {category}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => scroll('right')}
                            className='absolute -right-5 top-1/2 max-[720px]:hidden -translate-y-1/2 cursor-pointer bg-base-100 rounded-full p-2 z-10'>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                    <Feed activeCategory={activeCategory} />
                </div>
                <FeedSidebar />
            </div>
        </>
    );
};

export default Home;
