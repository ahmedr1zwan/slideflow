import React, { useState, useRef, useEffect } from 'react'
import MicDesign from './MicDesign.tsx'
import { useAnimate } from 'framer-motion';

const SlideDemo = ({ left = true }: { left: Boolean }) => {
    const [isOn, setIsOn] = useState<Boolean>(false);
    const [isInView, setIsInView] = useState(false); // State to track if the element is in view
    const thisDivRef = useRef<HTMLDivElement>(null); // Ref to the target div

    const [textBoolean, setTextBoolean] = useState<Boolean[]>([false, false, false, false, false, false, false]);
    const [text, setText] = useState<String[]>(["GO", "TO THE", "SLIDE", "WITH", "JAPAN", "IN THE", "TITLE"]);

    const [scope, animate] = useAnimate();

    const [position, setPosition] = useState<number>(0);

    async function animateSlides(num: number, time: number) {
        setPosition((prev) => {
            const newPos = prev + slideWidth * num * -1;
            animate(scope.current, { x: newPos }, { duration: time, ease: [0.2, 0.8, 0.15, 1] });

            return newPos;
        });
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true); // Element has entered the viewport
                    } else {
                        setIsInView(false); // Element has left the viewport
                    }
                });
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '0px 0px -50px 0px', // Trigger when the element reaches 50px before the bottom
                threshold: 0, // Trigger when any part of the element is in view
            }
        );

        const targetElement = thisDivRef.current;
        if (targetElement) {
            observer.observe(targetElement);
        }

        // Cleanup on component unmount
        return () => {
            if (targetElement) {
                observer.unobserve(targetElement);
            }
        };
    }, []);

    const [slideWidth, setSlideWidth] = useState(0); // State to store the width
    const slideRef = useRef<HTMLDivElement>(null); // Ref for the target element

    useEffect(() => {
        // Function to calculate and set the width
        const updateSlideWidth = () => {
            if (slideRef.current) {
                const rect = slideRef.current.getBoundingClientRect();
                setSlideWidth(rect.width); // Update state with the width
            }
        };

        // Call the function on mount
        updateSlideWidth();

        // Add a resize event listener to handle window resizing
        window.addEventListener("resize", updateSlideWidth);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("resize", updateSlideWidth);
        };
    }, []); // Empty dependency array ensures it runs on mount and on resize

    const timerRefs = useRef([]); // Use a ref to store timer IDs

    // this is for the fcking mic and slides demo thing man idk what im doing
    function startAnimation() {
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];

        setTimeout(() => { setIsOn(true); }, 500);
        setText(["GO", "TO THE", "SLIDE", "WITH", "JAPAN", "IN THE", "TITLE"]);

        // Store timer IDs in the ref
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, false, false, false, false, false, false]); }, 2000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, false, false, false, false, false]); }, 2400));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, false, false, false, false]); }, 2700));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, false, false, false]); }, 3000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, false, false]); }, 3400));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, true, false]); }, 3800));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, true, true]); }, 4100));
        timerRefs.current.push(setTimeout(() => { animateSlides(6, 1.5); }, 5100)); 
        
        timerRefs.current.push(setTimeout(() => { setTextBoolean([false, false, false, false, false, false, false]); }, 7000));
        timerRefs.current.push(setTimeout(() => { setText(["GO", "TO THE", "SECOND", "SLIDE"]); }, 8000));

        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, false, false, false, false, false, false]); }, 9000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, false, false, false, false, false]); }, 9400));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, false, false, false, false]); }, 9700));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, false, false, false]); }, 10000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, false, false]); }, 10400));
        timerRefs.current.push(setTimeout(() => { animateSlides(-5, 1); }, 11400)); 

        timerRefs.current.push(setTimeout(() => { setTextBoolean([false, false, false, false, false, false, false]); }, 13000));
        timerRefs.current.push(setTimeout(() => { setText(["GO", "TO THE", "SLIDE", "WITH", "A", "DESERT"]); }, 14000));

        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, false, false, false, false, false, false]); }, 15000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, false, false, false, false, false]); }, 15400));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, false, false, false, false]); }, 15700));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, false, false, false]); }, 16000));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, false, false]); }, 16400));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, true, true, false]); }, 16800));
        timerRefs.current.push(setTimeout(() => { animateSlides(6, 1.5); }, 17800)); 

        timerRefs.current.push(setTimeout(() => { setTextBoolean([false, false, false, false, false, false, false]); }, 19500));
        timerRefs.current.push(setTimeout(() => { setText(["GO", "TO THE", "FIRST", "SLIDE"]); }, 20500));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, false, false, false, false, false, false]); }, 21500));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, false, false, false, false, false]); }, 21900));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, false, false, false, false]); }, 22200));
        timerRefs.current.push(setTimeout(() => { setTextBoolean([true, true, true, true, false, false, false]); }, 22600));
        timerRefs.current.push(setTimeout(() => { animateSlides(-7, 1.5); }, 23600)); 

        timerRefs.current.push(setTimeout(() => { setTextBoolean([false, false, false, false, false, false, false]); }, 24500));

        

        // Schedule the next loop if `isInView` is still true
        if (isInView) {
            timerRefs.current.push(
                setTimeout(() => {
                    startAnimation(); // Recursive call to loop
                }, 25000) // Adjust this duration based on your animation sequence
            );
        }
    }

    function endAnimation() {
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = []; 

        setIsOn(false);
        setTextBoolean([false, false, false, false, false, false, false]);
        setText(["GO", "TO THE", "SLIDE", "WITH", "JAPAN", "IN THE", "TITLE"]);
        animate(scope.current, { x: 0 }, { duration: 0.1 });
        setPosition(0);
    }


    useEffect(() => {
        if (isInView) {
            startAnimation();
        }
        if (!isInView) {
            endAnimation();
        }
        return () => {
            endAnimation();
        };
    }, [isInView]);

    return (
        <div className="w-full h-80 flex flex-row justify-between text-white">
            {/* Left side */}
            <div className="w-1/2 flex flex-col justify-around p-4">
                <div className="flex flex-row h-1/2 gap-4">
                    <div id="thisdiv" ref={thisDivRef}>
                        <MicDesign on={isOn} />
                    </div>
                    <div className="flex flex-col justify-around">
                        <p className="text-3xl font-montserrat font-bold">
                            <span className={`${textBoolean[0] ? "opacity-100" : "opacity-0"}`}>{text[0]} </span>
                            <span className={`${textBoolean[1] ? "opacity-100" : "opacity-0"}`}>{text[1]} </span>
                            <span className={`${textBoolean[2] ? "opacity-100" : "opacity-0"}`}>{text[2]} </span>
                            <span className={`${textBoolean[3] ? "opacity-100" : "opacity-0"}`}>{text[3]} </span>
                            <span className={`${textBoolean[4] ? "opacity-100" : "opacity-0"}`}>{text[4]} </span> 
                            <span className={`${textBoolean[5] ? "opacity-100" : "opacity-0"}`}>{text[5]} </span>
                            <span className={`${textBoolean[6] ? "opacity-100" : "opacity-0"}`}>{text[6]} </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="aspect-[16/9] rounded-xl shadow shadow-gray-500 overflow-hidden" ref={slideRef}>
                <div className="flex flex-row" ref={scope} >
                    <img 
                        src="/images/slideOne.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideTwo.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideThree.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideFour.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideFive.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideSix.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideSeven.png"
                        alt=""
                        className="w-full h-full"
                    />
                    <img 
                        src="/images/slideEight.png"
                        alt=""
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default SlideDemo;
