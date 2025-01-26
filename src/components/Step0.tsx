import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CustomArrow from './CustomArrow.tsx';

export const Step0 = ({ setRole, setStep }) => {
    const [hoveredOne, setHoveredOne] = useState(false);
    const [hoveredTwo, setHoveredTwo] = useState(false);

    return (
        // This is the step where the user selects their role (Presenter or Audience)
        <div>
            <p className="text-4xl font-bold text-white text-center mt-8 font-quicksand">You're the:</p>
            {/* Or make this a toggle + confirm tbh */}
            <div className="flex justify-center mt-8 gap-12">
                <motion.button 
                    className="flex flex-row items-center text-black font-montserrat py-3 px-4 rounded-3xl bg-gradient-to-r from-[#38bdf8] to-[#34d399] hover:cursor-pointer" 
                    onClick={() => { setRole('Presenter'); setStep(1); }}
                    initial={{
                        scale: 1
                    }}
                    whileHover={{
                        scale: 1.03,
                        transition: {
                            duration: 0.25
                        }
                    }}
                    whileTap={{
                        scale: 0.98,
                        transition: {
                            duraiton: 0.125
                        }
                    }}
                    onMouseEnter={() => setHoveredOne(true)}
                    onMouseLeave={() => setHoveredOne(false)}
                >
                    PRESENTER
                    {/* <CustomArrow hovered={hoveredOne} /> kev thinks this sht is ugly */}
                </motion.button>
                <motion.button 
                    className="flex flex-row items-center text-black py-3 px-4 rounded-3xl font-montserrat bg-gradient-to-r from-[#38bdf8] to-[#34d399] hover:cursor-pointer" 
                    onClick={() => { setRole('Audience'); setStep(1); }}
                    initial={{
                        scale: 1
                    }}
                    whileHover={{
                        scale: 1.03,
                        transition: {
                            duration: 0.25
                        }
                    }}
                    whileTap={{
                        scale: 0.98,
                        transition: {
                            duraiton: 0.125
                        }
                    }}
                    onMouseEnter={() => setHoveredTwo(true)}
                    onMouseLeave={() => setHoveredTwo(false)}
                >
                    AUDIENCE
                    {/* <CustomArrow hovered={hoveredTwo} /> */}
                </motion.button>
            </div>

        </div>
    );
}

export default Step0;