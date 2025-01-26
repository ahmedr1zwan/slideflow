import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MicDesign = ({ on = false }: { on: Boolean }) => {
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (on) {
            setKey(prevKey => prevKey + 1); 
        }
    }, [on]);

    return (
        <div className="flex flex-col justify-around">
            <div className="relative w-32 h-32">
            <motion.div
                className={`p-2 bg-gradient-to-r from-[#38bff8aa] to-[#34d399aa] rounded-full h-32 w-32 ${on ? 'drop-shadow-lg' : ''}`}
                initial={{ opacity: on ? 1 : 0.7 }}
                animate={{
                    opacity: on ? 1 : 0.7,
                    transition: {
                        duration: 0.5,
                    },
                }}
            >
                <img
                    src="/images/mic.svg"
                    alt=""
                    className="w-32 h-32 absolute top-0 left-0 scale-60"
                />
            </motion.div>

                {/* First ring animation */}
                <motion.div
                    key={key}
                    className="border-2 border-gray-600/70 w-32 h-32 absolute top-0 left-0 rounded-full"
                    initial={{ scale: 1, opacity: on ? 1 : 0 }}
                    animate={{
                        scale: on ? 2 : 1,
                        opacity: on ? 0 : 1,
                        transition: {
                            duration: 1,
                            repeat: on ? Infinity : 0,
                            repeatType: "loop",
                        },
                    }}
                />

                {/* Second ring animation */}
                <motion.div
                    key={key + 1}
                    className="border-2 border-gray-600/70 w-32 h-32 absolute top-0 left-0 rounded-full"
                    initial={{ scale: 1, opacity: on ? 1 : 0 }}
                    animate={{
                        scale: on ? 2 : 1,
                        opacity: on ? 0 : 1,
                        transition: {
                            duration: 1,
                            repeat: on ? Infinity : 0,
                            repeatType: "loop",
                            delay: on ? 1 : 0, 
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default MicDesign;
