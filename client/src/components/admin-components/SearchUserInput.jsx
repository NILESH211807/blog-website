import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { useSearchParams } from 'react-router-dom';


const sanitizeQuery = (query) => {
    if (typeof query !== 'string') return '';
    return query
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^a-zA-Z0-9@_. ]/g, '')
        .toLowerCase();
}

const SearchUserInput = ({
    title = "Search users by username or email",
}) => {

    const [searchParam, setSearchParam] = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParam.get('query') || '');

    const handleInputChange = (e) => {
        const sanitizedQuery = sanitizeQuery(e.target.value);
        setInputValue(sanitizedQuery);
        setSearchParam({ query: sanitizedQuery });
    }

    const searchValueRemoveHandler = () => {
        setInputValue('');
        setSearchParam({});
    }

    return (
        <div className="mb-4 sm:mb-6">
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder={title}
                    className="w-full py-3 text-base-content font-semibold px-5 text-sm focus:border-primary outline-none bg-base-100 border border-base-300 rounded-md"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {
                    inputValue ? <span onClick={searchValueRemoveHandler} className="cursor-pointer hover:bg-base-300 rounded-full p-2.5 absolute right-2 top-1/2 -translate-y-1/2 text-error" >
                        <IoMdClose size={18} />
                    </span>
                        : <span className="cursor-pointer hover:bg-base-300 rounded-full p-2.5 absolute right-2 top-1/2 -translate-y-1/2 text-base-content" >
                            <FiSearch size={18} />
                        </span>
                }
            </div>
        </div>
    )
}

export default SearchUserInput;
