import React from 'react'
import { motion, useAnimate } from 'framer-motion'
import { opacityToHex } from 'pdfjs-dist/types/src/display/editor/tools';

export const TechCard = ({ imagePath, name, left }: { imagePath: string, name: string,  left: boolean }) => {
    const [scope, animate] = useAnimate();

    async function handleAnimateIn() {
        if (scope.current === null) return;
        animate(scope.current, { opacity: 1 }, { duration: 0.125, delay: 0.2 });
    }

    async function handleAnimateOut() {
        if (scope.current === null) return;
        animate(scope.current, { opacity: 0 }, { duration: 0.125 });
    }
    
    return (
        <div className="relative">
            <motion.div
                className={`absolute top-0 min-w-21 h-21 ${
                    left ? 'right-0 origin-right' : 'left-0 origin-left'
                } flex flex-row items-center border-2 border-gray-400/50 rounded-xl font-quicksand text-white p-4`}
                initial={{ width: "3rem", scale: 1 }}
                whileHover={{ width: "20rem", scale: 1.05 }}
                transition={{ ease: [0.5, 0, 0.5, 1], duration: 0.3 }}
                onMouseEnter={handleAnimateIn}
                onMouseLeave={handleAnimateOut}
            >
                <img
                    src={imagePath}
                    alt=""
                    className="w-12 h-12 object-cover"
                />
                <motion.span
                    ref={scope}
                    className="ml-6 text-base"
                    initial={{ opacity: 0 }}
                >
                    {name}
                </motion.span>
            </motion.div>
        </div>
    );
}
