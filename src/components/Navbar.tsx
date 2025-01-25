import React from 'react'

export const Navbar = () => {
    return (
        <div className="border-b border-b-[#ffffff20] h-20 w-full flex flex-row">
            <div className="w-5/6 mx-auto flex flex-col justify-around">
                <div className="flex flex-row justify-between">
                    <img 
                        src="/images/logo.svg"
                        alt="logo"
                        className="w-12 h-12"
                    />
                    <div className="flex flex-row gap-10">
                        <button className="text-white font-quicksand font-medium text-lg relative group hover:cursor-pointer">
                            HOME
                            <span
                                className="absolute left-0 bottom-[8px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </button>
                        <div className="flex flex-col justify-around">
                            <div className="border-r border-r-[#ffffff20] h-8" />
                        </div>
                        <button className="text-white font-quicksand font-medium text-lg relative group hover:cursor-pointer">
                            ABOUT
                            <span
                                className="absolute left-0 bottom-[8px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
