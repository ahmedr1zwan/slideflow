import React, { useContext, useState } from 'react';
import PDFNavigationContext from '../contexts/PDFNavigationContext';
import axios from 'axios';

const SearchBar = ({ setStep, pdfRoutes, resultIndex, setResultIndex, results, setResults }) => {
    const pageNavigation = useContext(PDFNavigationContext);
    const [searchPhrase, setSearchPhrase] = useState('');

    // Assuming 'filetype' is part of 'pdfRoutes'. Adjust accordingly.
    const filetype = pdfRoutes[pdfRoutes.length - 1].split(".").pop() || 'pdf';
    const searchall = 'false'; const handleSearch = async () => {
        if (!searchPhrase.trim()) {
            return;
        }

        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/${filetype}/search-all?searchAll=${searchall}`,
                {
                    file_path: pdfRoutes[pdfRoutes.length - 1],
                    phrase: searchPhrase,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Search Results:', response.data.results);

            setResults(response.data.results);

            if (response.data.results.length > 0) {
                setResultIndex(0);
                pageNavigation.jumpToPage(response.data.results[0].page_number - 1);
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    // Handle Enter key press in the search input
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-row items-center justify-around w-3/4 mx-auto gap-4 mb-3">
            {/* Back button */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setStep(1)}
                    className="bg-gradient-to-r from-[#b3d12d] to-[#c8720f] 
                               font-montserrat p-4 rounded-full mx-auto hover:cursor-pointer"
                >
                    <img
                        src="/images/backbutton.svg"
                        alt="Back Button"
                        className="w-4 h-4 select-none"
                        draggable="false"
                    />
                </button>
                <p className="font-montserrat text-white mt-2">BACK</p>
            </div>

            {/* Search bar */}
            <div className="relative w-4/5">
                <input
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchPhrase}
                    onChange={(e) => setSearchPhrase(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-200 text-black font-montserrat p-2 pl-4 pr-10 rounded-full w-full focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
                    aria-label="Search"
                >
                    <img
                        src="/images/searchicon.svg"
                        className="w-5 h-5"
                        draggable="false"
                        alt="Search Icon"
                    />
                </button>
            </div>

            {/* Files button */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setStep(1)}
                    className="bg-gradient-to-r from-[#b3d12d] to-[#c8720f] 
                               font-montserrat p-4 rounded-full mx-auto hover:cursor-pointer"
                >
                    <img
                        src="/images/uploadblack.svg"
                        alt="Files Button"
                        className="w-4 h-4 select-none"
                        draggable="false"
                    />
                </button>
                <p className="font-montserrat text-white mt-2">FILES</p>
            </div>
        </div>
    );
}

export default SearchBar;
