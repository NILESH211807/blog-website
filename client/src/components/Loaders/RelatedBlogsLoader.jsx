const RelatedBlogsLoader = ({ length = 5 }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <div className="border border-base-300 rounded-md overflow-hidden animate-pulse" key={index}>
                    <div className="w-full h-48 bg-base-200"></div>
                    <div className="p-4">
                        <div className="h-6 bg-base-200 rounded w-3/4"></div>
                        <div className="mt-2 h-4 bg-base-200 rounded w-full"></div>
                        <div className="mt-2 h-4 bg-base-200 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default RelatedBlogsLoader;
