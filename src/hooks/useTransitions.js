import { useState, useEffect } from "react";
import { TRANSITIONS, ANIMATIONS } from "../constants/config";

/**
 * Custom hook to manage state transitions and overlays
 */
export const useTransitions = (timerStatus) => {
    const [activeTransition, setActiveTransition] = useState(null);
    const [showTransition, setShowTransition] = useState(false);
    const [transitionMessage, setTransitionMessage] = useState("");
    const [prevStatus, setPrevStatus] = useState("idle");

    useEffect(() => {
        // If timerStatus has changed from previous status, a transition is occurring
        if (timerStatus !== prevStatus) {
            console.log(`Transition: ${prevStatus} to ${timerStatus}`);

            // Check if a transition is occurring
            const transitionKey = `${prevStatus}_${timerStatus}`;
            const currentTransition = TRANSITIONS[transitionKey];

            if (currentTransition) {
                // Set up the transition
                setShowTransition(true);
                setActiveTransition(currentTransition.type);
                setTransitionMessage(currentTransition.message);

                // Hide transition after animation completes
                const timer = setTimeout(() => {
                    setShowTransition(false);
                    setActiveTransition(null);
                    setPrevStatus(timerStatus);
                }, ANIMATIONS.TRANSITION_DURATION);

                return () => clearTimeout(timer);
            } else {
                // If no transition animation is needed, update prevStatus immediately
                setPrevStatus(timerStatus);
            }
        }
    }, [timerStatus, prevStatus]);

    return {
        showTransition,
        activeTransition,
        transitionMessage,
    };
};
