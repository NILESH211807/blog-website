import React, { useCallback, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { querySanitizer } from '../utils/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchStoryAndPeople = () => {
    const [input, setInput] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // handle input change
    const inputOnChange = (e) => {
        const value = querySanitizer(e.target.value);
        setInput(value);
    }
    // handle search
    const handleSearch = useCallback(() => {
        if (!input) return;
        navigate(`/search?query=${input}`);
    }, [input]);

    const clearSearchHandler = useCallback(() => {
        setInput('');
        setSearchParams({});
    }, [input]);

    return (
        <div className='w-full flex items-center justify-center py-5 px-3 min-[810px]:w-96 min-[810px]:ml-5'>
            <div className='w-full input focus-within:shadow-none focus-within:outline-none focus-within:border-primary mx-auto rounded-sm bg-base-200 border-transparent'>
                <input
                    type="text"
                    placeholder="Search"
                    value={input}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className=" font-medium pl-3" onChange={inputOnChange} />

                {input && (
                    <span onClick={clearSearchHandler} className='cursor-pointer -mr-2 p-1.5 hover:bg-base-300 rounded-full'>
                        <span className='text-error'><IoMdClose className='cursor-pointer' size={18} /></span>
                    </span>
                )}
                <span onClick={handleSearch} className='cursor-pointer -mr-2 p-1.5 hover:bg-base-300 rounded-full'>
                    <FiSearch className='cursor-pointer' size={18} />
                </span>
            </div>
        </div>
    )
}

export default SearchStoryAndPeople;
