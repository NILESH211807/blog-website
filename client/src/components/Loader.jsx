import React from 'react';
import '../assets/css/loader.css';

const Loader = () => {
    return (
        <div className="dot-spinner bg-base-100">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
        </div>
    )
}

export default Loader
