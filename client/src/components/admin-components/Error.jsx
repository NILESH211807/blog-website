const ErrorComponent = ({ error }) => {
    return (
        <div className="text">
            <p className='text-red-500 text-center mt-10'>
                {error?.message || error?.data?.message || 'Failed to load users data'}
            </p>
        </div>
    )
}

export default ErrorComponent
