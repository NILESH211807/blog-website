import React from 'react'

const SearchUserLoader = ({ length = 1 }) => {
    return (
        <>
            {
                Array.from({ length }).map((_, index) => (
                    <div key={index} class="flex items-center my-3 justify-between p-4 border border-base-300 rounded-lg bg-base-100 max-sm:flex-col animate-pulse">
                        <div className='flex items-center gap-4 flex-1 cursor-pointer max-sm:w-full max-sm:gap-5'>
                            <div className='w-16 h-16 bg-base-300 skeleton rounded-none'></div>
                            <div className='flex flex-col gap-2'>
                                <div className='h-6 bg-base-300 skeleton rounded-none w-32'></div>
                                <div className='h-6 bg-base-300 skeleton rounded-none w-32'></div>
                            </div>
                        </div>
                        <div className='w-24 h-8 bg-base-300 skeleton rounded-none'></div>
                    </div>
                ))
            }
        </>
    )
}

export default SearchUserLoader
