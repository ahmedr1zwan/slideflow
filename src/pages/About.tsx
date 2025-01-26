import React from 'react'

const About = () => {
    return (
        <div className="relative top-8 w-5/6 mx-auto">
            <p className="text-5xl font-montserrat bg-gradient-to-r from-[#38bdf8] to-[#34d399] bg-clip-text text-transparent font-bold text-center w-fit mx-auto">
                About the Team
            </p>
            <div className="flex flex-row justify-between mt-8">
                <div className="flex flex-col gap-4">
                    <img 
                        src="/images/kevinYao.jpg"
                        alt=""
                        className="rounded-full w-50 h-50 object-cover object-[center_0%]"
                    />
                    <p className="font-quicksand text-white text-2xl font-semibold text-center">Kevin Yao</p>
                </div>
                <img 
                    src="/images/vtlm.jpg"
                    alt=""
                    className="rounded-full w-50 h-50 object-cover object-[center_0%]"
                />
                <img 
                    src="/images/james.jpg"
                    alt=""
                    className="rounded-full w-50 h-50 object-cover object-[center_0%]"
                />
                <img 
                    src="/images/ahmed.jpg"
                    alt=""
                    className="rounded-full w-50 h-50 object-cover object-[center_90%]"
                />
            </div>
        </div>
    )
}

export default About