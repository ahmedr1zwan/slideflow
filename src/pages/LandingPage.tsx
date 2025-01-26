import React, { useState } from 'react'
import { motion } from "framer-motion"
import CustomArrow from '../components/CustomArrow.tsx'
import SlideDemo from '../components/SlideDemo.tsx';
import { useNavigate } from 'react-router-dom';
import { TechCard } from '../components/TechCard.tsx';

export const LandingPage = () => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

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
            <div className="text-center text-2xl font-quicksand mt-6">
                <p className="text-[#888888]">Slide flows, Text floats. </p> 
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
                    onClick={() => navigate("/get-started")}
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
                    <div className="flex flex-row justify-between text-white/70 mx-auto mt-4">
                        <div className="flex flex-row justify-start">
                            <div className="w-[140px]">
                                <p className="text-sm">Simply upload any .pptx or .pdf file into SlideFlow</p>
                            </div>
                        </div>
                        <div className="w-60" />
                        <div className="">
                            <p className="text-sm w-[140px]">We will automatically use AI to process the content in your presentation</p>
                        </div>
                        <div className="w-60" />
                        <div className="flex flex-row justify-end">
                            <div className="w-[140px]">
                                <p className="text-sm w-[140px]">You will be able to use all of our AI commands in real time</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="my-24 border-t border-t-gray-300/20"/>
                    <div className="">
                        <SlideDemo left={true} />
                    </div>

                    <div className="flex flex-row justify-between mt-24 mb-12 items-center w-full">
                        <div className="border-b border-gray-500/80 w-[37%]" />
                        <p className="font-quicksand text-[#31c8d0] text-lg">WHAT'S UNDER THE HOOD</p>
                        <div className="border-b border-gray-500/80 w-[37%]" />
                    </div>

                    <div className="flex flex-row w-1/3 mx-auto justify-around">
                        <div className="flex flex-col gap-24">
                            <TechCard imagePath='/images/React.svg' name='React' left={true} />
                            <TechCard imagePath='/images/Framer.svg' name='Framer Motion' left={true} />
                            <TechCard imagePath='/images/TailwindCSS.svg' name='Tailwind' left={true} />
                            <TechCard imagePath='/images/TypeScript.svg' name='TypeScript' left={true} />
                            <TechCard imagePath='/images/AWS.svg' name='AWS' left={true} />
                        </div>
                        <div className="flex flex-col gap-24">
                            <TechCard imagePath='/images/Python.svg' name='Python' left={false} />
                            <TechCard imagePath='/images/Flask.svg' name='Flask' left={false} />
                            <TechCard imagePath='/images/Terraform.svg' name='Terraform' left={false} />
                            <TechCard imagePath='/images/SentenceBERT.svg' name='Sentence-BERT' left={false} />
                            <TechCard imagePath='/images/GCV.svg' name='Google Cloud Vision' left={false} />
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}