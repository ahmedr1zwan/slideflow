import React from 'react'
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div
            className="h-20 w-full flex flex-row overflow-hidden"
        >
            {/* Background Dots */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                    opacity: 0.3,
                }}
            ></div>
    
            <div className="w-5/6 mx-auto flex flex-col justify-around relative z-10">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-6 items-center hover:cursor-pointer" onClick={() => navigate("/")}>
                        <img
                            src="/images/logo.svg"
                            alt="logo"
                            className="w-12 h-12"
                        />
                        <p className="font-montserrat text-3xl font-semibold bg-gradient-to-r from-[#38bdf8] to-[#34d399] bg-clip-text text-transparent select-none">SlideFlow</p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <button 
                            className="text-white font-quicksand font-medium text-lg relative group hover:cursor-pointer select-none"
                            onClick={() => navigate("/")}
                        >
                            HOME
                            <span
                                className="absolute left-0 bottom-[8px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </button>
                        <div className="flex flex-col justify-around">
                            <div className="border-r border-r-[#ffffff20] h-8" />
                        </div>
                        <button 
                            className="text-white font-quicksand font-medium text-lg relative group hover:cursor-pointer select-none"
                            onClick={() => navigate("/about")}
                        >
                            ABOUT
                            <span
                                className="absolute left-0 bottom-[8px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"
                            ></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
