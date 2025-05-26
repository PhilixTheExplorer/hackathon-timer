import { useState, useEffect } from "react";
import { TIMER_STATES, ANIMATIONS } from "../constants/config";

/**
 * Custom hook to manage countdown overlay state
 */
export const useCountdown = (timerStatus, timeLeft) => {
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdownNumber, setCountdownNumber] = useState(3);
    const [animateNumber, setAnimateNumber] = useState(false);
    const [prevCountdownNum, setPrevCountdownNum] = useState(null);

    useEffect(() => {
        const isCountdownTime =
            timerStatus === TIMER_STATES.IDLE &&
            timeLeft.hours === 0 &&
            timeLeft.minutes === 0 &&
            timeLeft.seconds <= 3 &&
            timeLeft.seconds > 0;

        if (isCountdownTime) {
            setShowCountdown(true);

            // If the countdown number changed, trigger animation
            if (timeLeft.seconds !== prevCountdownNum) {
                setPrevCountdownNum(timeLeft.seconds);
                setCountdownNumber(timeLeft.seconds);
                setAnimateNumber(true);

                // Reset animation flag after animation completes
                setTimeout(() => {
                    setAnimateNumber(false);
                }, ANIMATIONS.COUNTDOWN_DURATION);
            }
        } else {
            setShowCountdown(false);
        }
    }, [timerStatus, timeLeft, prevCountdownNum]);

    return {
        showCountdown,
        countdownNumber,
        animateNumber,
    };
};
