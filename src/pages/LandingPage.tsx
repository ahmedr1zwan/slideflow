import React, { useState } from 'react'
import { motion } from "framer-motion"
import CustomArrow from '../components/CustomArrow.tsx'
import SlideDemo from '../components/SlideDemo.tsx';

export const LandingPage = () => {
    const [hovered, setHovered] = useState<Boolean>(false);

    return (
        <div className="w-5/6 mx-auto">
            <div className="text-white font-montserrat font-bold text-7xl mt-32 text-center">
                <p className="">Your Presentation. </p>
                <p>Powered by 
                    <span className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] bg-clip-text text-transparent"> Voice </span>
                    and 
                    <span className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] bg-clip-text text-transparent"> AI.</span>
                </p>
            </div>
            <div className="text-center text-2xl font-quicksand mt-4">
                <p className="text-[#888888]">Slide flows, Text floats. kevin we are changing this sht ASAP</p>  { /* yo this sht gotta change bro */ }
                <motion.button
                    initial={{ scale: 1 }}
                    whileHover={{ 
                        scale: 1.02,
                        transition: {
                            duration: 0.25
                        }
                    }}
                    whileTap={{
                        scale: 0.98,
                        transition: {
                            duration: 0.125
                        }
                    }}
                    className="py-2 px-8 rounded-full mt-8 bg-gradient-to-r from-[#38bdf8] to-[#34d399] hover:cursor-pointer"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >   
                    <div className="flex flex-row gap-4">
                        <p>GET STARTED</p>
                        <CustomArrow hovered={hovered}/>
                    </div>
                </motion.button>

                <div className="mt-30 flex flex-col pb-64">
                    <p className="font-quicksand text-[#31c8d0] text-lg">HOW IT WORKS</p>
                    <motion.div 
                        className="flex flex-row gap-8 mx-auto"
                        whileHover={{
                            scale: 1.02,
                            opacity: 0.8,
                            transition: {
                                duration: 0.25,
                                type: "spring",
                                stiffness: 300,
                                damping: 10
                            }
                        }}
                        animate={{
                            scale: 1,
                            opacity: 0.5,
                            transition: {
                                duration: 0.25,
                                type: "spring",
                                stiffness: 300,
                                damping: 10
                            }
                        }}
                    >
                        <div className="border-2 border-white rounded-full p-6">
                            <img 
                                src="/images/upload.svg"
                                alt=""
                                className="w-[69px] h-[69px] select-none"
                                draggable="false"
                            />
                        </div>

                        <div className="flex flex-row gap-0">
                            <div className="flex flex-col justify-around">
                                <div className="p-1.5 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex flex-col justify-around">
                                <div className="h-0 w-48 border-2 border-dashed border-white" />
                            </div>
                            <div className="flex flex-col justify-around">
                                <div className="p-1.5 border-2 border-white rounded-full" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-around">
                            <div className="border-2 border-white rounded-[10px] p-2 transform rotate-45">
                                <img 
                                    src="/images/Cpu.svg"
                                    alt=""
                                    className="w-[40px] h-[40px] select-none relative top-[2px] left-[2px] -rotate-45"
                                    draggable="false"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-0">
                            <div className="flex flex-col justify-around">
                                <div className="p-1.5 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex flex-col justify-around">
                                <div className="h-0 w-48 border-2 border-dashed border-white" />
                            </div>
                            <div className="flex flex-col justify-around">
                                <div className="p-1.5 border-2 border-white rounded-full" />
                            </div>
                        </div>

                        <div className="border-2 border-white rounded-full p-6">
                            <img
                                src="/images/mic.svg"
                                alt=""
                                className="w-[69px] h-[69px] select-none"
                                draggable="false"
                            />
                        </div>

                    </motion.div>
                    <div className="flex flex-row justify-between text-white/70 w-[83%] mx-auto mt-4">
                        <div className="w-1/3 flex flex-row justify-start">
                            <div className="relative left-[12px]">
                                <p className="text-sm">Simply upload any .pptx or</p>
                                <p className="text-sm">.pdf file into SlideFlow</p>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <p className="text-sm">We will automatically use AI</p>
                            <p className="text-sm">to process the content in</p>
                            <p className="text-sm">your presentation</p>
                        </div>
                        <div className="w-1/3 flex flex-row justify-end">
                            <div className="relative left-[8px]">
                                <p className="text-sm">You will be able to use all</p>
                                <p className="text-sm">of our AI commands immediately</p>
                                <p className="text-sm">in real time</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="my-16 border-t border-t-gray-300/20"/>
                    <div className="">
                        <SlideDemo left={true} />
                    </div>

                </div>
            </div>
        </div>
    )
}