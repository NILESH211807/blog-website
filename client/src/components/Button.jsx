import React from 'react'

const Button = ({
    loading = false,
    title = 'Submit',
    type = 'submit',
    disabled,
    className,
    ...props
}) => {
    return (
        <button type={type} disabled={disabled || loading} className={`btn btn-primary w-full shadow-none mt-2 ${className}`} {...props}>
            {loading ? <span className="loading loading-spinner"></span> : title}
        </button>
    )
}

export default Button
