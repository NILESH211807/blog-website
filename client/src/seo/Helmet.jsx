import React from 'react';
import { Helmet } from 'react-helmet';


const HelmetComponent = ({
    title = 'Blogs',
    description = 'A blog website for developers',
}) => {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content="blog, developer, programming" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="google" content="notranslate" />
        </Helmet>
    )
}

export default HelmetComponent
