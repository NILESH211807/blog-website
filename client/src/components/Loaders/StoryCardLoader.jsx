import React from 'react'

const StoryCardLoader = ({
   length = 1,
   maxWidth = 'full',
}) => {
   return (
      <>
         {
            Array.from({ length }).map((_, index) => (
               <div key={index} className="w-full my-6 px-3 py-2 md:p-2 border border-base-300 mx-auto flex flex-col md:flex-row gap-3 md:gap-3 bg-base-100 transition-all duration-200 animate-pulse" style={{ maxWidth }}>
                  <div className="flex-1 order-2 md:order-1">
                     <div className="w-full skeleton h-8 bg-base-300 my-2.5 rounded-none flex items-center justify-center"></div>
                     <div className="w-full skeleton h-8 bg-base-300 my-2.5 rounded-none flex items-center justify-center"></div>
                     <div className="w-52 skeleton h-6 bg-base-300 my-2.5 rounded-none flex items-center justify-center"></div>
                  </div>
                  <div className="w-full md:w-40 h-52 md:h-30 overflow-hidden flex-shrink-0 order-1 md:order-2">
                     <div className="w-full h-full skeleton bg-base-300 rounded-none flex items-center justify-center">
                     </div>
                  </div>
               </div>
            ))
         }
      </>
   )
}

export default StoryCardLoader
