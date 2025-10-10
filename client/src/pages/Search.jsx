import React, { useState } from 'react';
import FeedSidebar from '../components/FeedSidebar';
import SearchStories from '../components/SearchStories';
import { useSearchParams } from 'react-router-dom';
import SearchUser from '../components/SearchUser';
import SearchStoryAndPeople from '../components/SearchStoryAndPeople';
import HelmetComponent from '../seo/Helmet';

const Search = () => {

   const [activeCategory, setActiveCategory] = useState("stories");
   const [searchParams, setSearchParams] = useSearchParams();
   const query = searchParams.get('query');

   return (
      <>
         <HelmetComponent
            title='Search - Blogs'
            description='Search for stories and people'
         />
         <div className='w-full bg-base-100 flex justify-center'>
            {query ? <div className='w-full max-w-[700px] mx-auto mb-6 py-2'>
               <div className='w-full flex items-center justify-between py-2 max-xl:px-5'>
                  <h1 className='text-2xl font-semibold text-base-content/50 tracking-wide capitalize my-3'>Results for {query}</h1>
               </div>
               <div className='w-full mt-3 flex items-center gap-10 sticky top-0 bg-base-100 z-20 py-5 max-xl:px-5'>
                  <button type='button'
                     onClick={() => setActiveCategory("stories")}
                     className={`text-md tracking-wide capitalize font-semibold pb-2 cursor-pointer transition-all duration-200 ${activeCategory == "stories"
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-base-content/80 border-b-2 border-transparent hover:border-base-300'
                        }`}>
                     Stories
                  </button>

                  <button type='button'
                     onClick={() => setActiveCategory("people")}
                     className={`text-md tracking-wide capitalize font-semibold pb-2 cursor-pointer transition-all duration-200 ${activeCategory == "people"
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-base-content/80 border-b-2 border-transparent hover:border-base-300'
                        }`}>
                     People
                  </button>
               </div>


               {query && <div className='w-full min-h-screen'>
                  {activeCategory == 'stories' ? <>
                     <SearchStories query={query} />
                  </> : activeCategory == 'people' ? <>
                     <SearchUser query={query} />
                  </> : ""}
               </div>}
            </div> :
               <div className='w-full hidden max-[870px]:block'>
                  <SearchStoryAndPeople />
               </div>}
            {!query && <div className='w-full max-w-[700px] mx-auto mb-6 py-2 hidden min-[810px]:block'></div>}
            <FeedSidebar />
         </div>
      </>
   )
}

export default Search;
