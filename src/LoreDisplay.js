import React, { useEffect, useState } from 'react';

function LoreDisplay({ code, fetchTrigger }) {
    const [currentData, setCurrentData] = useState(null);
    const [nextData, setNextData] = useState(null);
    const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'exiting', 'entering'

    useEffect(() => {
        if (!code) return;

        fetch(`http://127.0.0.1:8000/settings/${code}/random`)
            .then(response => response.json())
            .then(data => {
                if (currentData) {
                    setNextData(data);
                    setAnimationPhase('exiting');
                } else {
                    setCurrentData(data);
                    setAnimationPhase('entering');
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [fetchTrigger]);

    useEffect(() => {
        if (animationPhase === 'exiting') {
            const timer = setTimeout(() => {
                setCurrentData(nextData);
                setNextData(null);
                setAnimationPhase('entering');
            }, 1000); // Assuming the exit animation duration is 1s
            return () => clearTimeout(timer);
        }
    }, [animationPhase]);

    return (
        <div className="skyrimLoading">
            {currentData && (animationPhase === 'idle' || animationPhase === 'exiting') && (
                <p className={`skyrimText ${animationPhase}`}>{currentData.content}</p>
            )}
            {currentData && animationPhase === 'entering' && (
                <p className='skyrimText entering'>{currentData.content}</p>
            )}
        </div>
    );
}

export default LoreDisplay;