import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="w-screen h-54 bg-[#121220cc] p-8">
            <div className="flex flex-col gap-2 h-full items-center">
                <div className="flex flex-row gap-10 items-center">
                    <button 
                        className="text-white font-quicksand font-medium text-sm tracking-widest relative group hover:cursor-pointer w-fit select-none"
                        onClick={() => navigate("/")}
                    >
                        HOME
                        <span
                            className="absolute left-0 bottom-[0px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"
                        ></span>
                    </button>
                    <button 
                        className="text-white font-quicksand font-medium text-sm tracking-widest relative group hover:cursor-pointer w-fit select-none"
                        onClick={() => navigate("/about")}
                    >
                        ABOUT
                        <span
                            className="absolute left-0 bottom-[0px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"
                        ></span>
                    </button>
                </div>
                <img 
                    src="/images/qhacks.svg"
                    alt=""
                />
                <p className="text-white/50 font-quicksand">&#169; Copyright 2025 - SlideFlow</p>
            </div>
        </div>
    )
}

export default Footer