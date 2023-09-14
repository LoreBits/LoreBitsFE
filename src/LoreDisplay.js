import React, { useEffect, useState } from 'react';

function LoreDisplay({ lores, displayIndex, setDisplayIndex }) {
    const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'exiting', 'entering'
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        if (animationPhase === 'idle') {
            setDisplayedText(lores[displayIndex]?.content);
        }
    }, [displayIndex, lores]);

    useEffect(() => {
        if (animationPhase === 'exiting') {
            const nextIndex = (displayIndex + 1) % lores.length;
            const timer = setTimeout(() => {
                setDisplayedText(lores[nextIndex]?.content);
                setDisplayIndex(nextIndex);
                setAnimationPhase('entering');
            }, 1000); // Assuming the exit animation duration is 1s
            
            return () => clearTimeout(timer);
        }
    }, [animationPhase, displayIndex, lores]);

    return (
        <div className="skyrimLoading">
            <p 
                className={`skyrimText ${animationPhase}`} 
                onClick={() => setAnimationPhase(animationPhase === 'idle' ? 'exiting' : 'idle')}
            >
                {displayedText}
            </p>
        </div>
    );
}

export default LoreDisplay;