import React from 'react'
import { motion } from "framer-motion";

const CustomArrow = ({ hovered }: { hovered: Boolean }) => {

    let opacity: Array<number>;
    let x: Array<number>;
    if (!hovered) {
        opacity = [0, 1, 1, 1];
        x = [-10, 0, 0, 0];
    }
    else {
        opacity = [1, 1, 1, 0];
        x = [20, 20, 20, 30];
    }

    return (
        <div className="flex flex-col justify-around">
            <div className="flex flex-row">
                <motion.img 
                    src="/images/blackTriangleLight.svg"
                    alt=""
                    className="w-[20px] h-[20px] relative left-[8px]"
                    initial={{ 
                        opacity: 0
                    }}
                    animate={{
                        opacity: opacity[0],
                        x: x[0]
                    }}
                />
                <motion.img 
                    src="/images/blackTriangleMedium.svg"
                    alt=""
                    className="w-[20px] h-[20px] relative"
                    initial={{ 
                        opacity: 1
                    }}
                    animate={{
                        opacity: opacity[1],
                        x: x[1]
                    }}
                />
                <motion.img 
                    src="/images/blackTriangleDark.svg"
                    alt=""
                    className="w-[20px] h-[20px] relative right-[8px]"
                    initial={{ 
                        opacity: 1
                    }}
                    animate={{
                        opacity: opacity[2],
                        x: x[2]
                    }}
                />
                <motion.img 
                    src="/images/blackTriangleMedium.svg"
                    alt=""
                    className="w-[20px] h-[20px] relative right-[16px]"
                    initial={{ 
                        opacity: 1
                    }}
                    animate={{
                        opacity: opacity[3],
                        x: x[3]
                    }}
                />
            </div>
        </div>
    )
}

export default CustomArrow