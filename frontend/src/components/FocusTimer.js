import React, { useState, useEffect } from 'react';
import './FocusTimer.css';

const FocusTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer completed
                        setIsActive(false);
                        setIsBreak(!isBreak);
                        setMinutes(isBreak ? 25 : 5);
                        setSeconds(0);
                        // Play notification sound
                        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, isBreak]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25);
        setSeconds(0);
    };

    const formatTime = (mins, secs) => {
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="focus-timer">
            <h2>{isBreak ? 'Break Time' : 'Focus Time'}</h2>
            <div className="timer-display">
                {formatTime(minutes, seconds)}
            </div>
            <div className="timer-controls">
                <button
                    className={isActive ? 'pause' : 'start'}
                    onClick={toggleTimer}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button className="reset" onClick={resetTimer}>
                    Reset
                </button>
            </div>
            <div className="timer-status">
                {isActive ? (
                    <span className="active">Focusing...</span>
                ) : (
                    <span className="inactive">Ready to focus</span>
                )}
            </div>
        </div>
    );
};

export default FocusTimer; 