import React from 'react'

const PopularPostLoader = ({ length = 5 }) => {
    return (
        <>
            {
                Array.from({ length }).map((_, index) => (
                    <li className="list-row p-3 rounded-md transition-colors animate-pulse" key={index}>
                        <div className="h-10 w-10 bg-base-200 rounded"></div>
                        <div className="flex flex-col gap-2 ml-3">
                            <div className="h-4 w-full bg-base-200 rounded"></div>
                            <div className="h-4 w-3/4 bg-base-200 rounded"></div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-1/4 bg-base-200 rounded"></div>
                                <div className="h-4 w-1/4 bg-base-200 rounded"></div>
                            </div>
                        </div>
                    </li>
                ))
            }
        </>
    )
}

export default PopularPostLoader
