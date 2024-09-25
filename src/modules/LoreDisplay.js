import React, { useEffect, useState } from 'react';

function LoreDisplay({ lores, displayIndex, setDisplayIndex, settingID }) {
    const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'exiting', 'entering'
    const [displayedText, setDisplayedText] = useState('');
    
    const animation_duration = 1000;  // Animacja trwa 1s

    useEffect(() => {
        if (lores.length > 0) {
            setDisplayedText(lores[0]?.content);
            setAnimationPhase('entering');
        }
    }, [lores]);

    useEffect(() => {
        if (animationPhase === 'idle') {
            setDisplayedText(lores[displayIndex]?.content);
        }
    }, [displayIndex, lores]);

    useEffect(() => {
        if (animationPhase === 'exiting') {
            const nextIndex = (displayIndex + 1) % lores.length;
            let timer = setTimeout(() => {
                setDisplayIndex(nextIndex);
                setAnimationPhase('entering');
                setDisplayedText(lores[nextIndex]?.content);
            }, animation_duration);
            return () => clearTimeout(timer);
        }
    }, [animationPhase, displayIndex, lores]);

    useEffect(() => {
        if (animationPhase === 'entering') {
            console.log(lores)
            const timer = setTimeout(() => {
                setAnimationPhase('idle');
            }, animation_duration);

            return () => clearTimeout(timer);
        }
    }, [animationPhase]);

    return (
        <>
            <div>{settingID}</div>
            <div 
                className="flex justify-center items-center fixed bottom-10 left-1/2 transform -translate-x-1/2 w-5/6 h-1/3 bg-black text-white text-xl font-bold rounded-lg p-6 shadow-lg"
                onClick={() => {
                    if (animationPhase === 'idle') {
                        setAnimationPhase('exiting');
                    }
                }}
            >
                <p 
                    className={`${
                        animationPhase === 'entering'
                        ? 'animate-slideFromLeft'
                        : animationPhase === 'exiting'
                        ? 'animate-slideToRight'
                        : ''
                    }`}
                >
                    {displayedText}
                </p>
            </div>
        </>
    );
}

export default LoreDisplay;
