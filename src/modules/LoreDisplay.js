import React, {useEffect, useState} from 'react';

function LoreDisplay({ lores, displayIndex, setDisplayIndex, settingID }) {
    const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'exiting', 'entering'
    const [displayedText, setDisplayedText] = useState('');
    
    const animation_duration = 1000  // the enter animation duration is 1s

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
            const timer = setTimeout(() => {
                setAnimationPhase('idle');
            }, animation_duration);

            return () => clearTimeout(timer);
        }
    }, [animationPhase]);

    return (
        <>
        <div> {settingID} </div>
        <div 
            className="skyrimLoading"
            onClick={() => {
                if (animationPhase === 'idle') {
                    setAnimationPhase('exiting');
                }
            }}
        >
            <p 
                className={`skyrimText ${animationPhase}`} 
            >
                {displayedText}
            </p>
        </div>
        </>
    );
}

export default LoreDisplay;