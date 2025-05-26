import { useState, useEffect } from "react";
import { CONFIG, TIMER_STATES, CSS_CLASSES } from "../constants/config";
import { calculateTimeRemaining, determineTimerStatus } from "../utils/timeUtils";

/**
 * Custom hook to manage timer state and time calculations
 */
export const useTimerState = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerStatus, setTimerStatus] = useState(TIMER_STATES.IDLE);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-US", { timeZone: CONFIG.TIME_ZONE })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("en-US", { timeZone: CONFIG.TIME_ZONE }));

      const startDateTime = new Date(CONFIG.START_TIME);
      const endDateTime = new Date(CONFIG.END_TIME);

      // Determine the current timer status
      const status = determineTimerStatus(
        now,
        startDateTime,
        endDateTime,
        CONFIG.SURVIVAL_PERIOD_MINUTES
      );

      // Update the timer status
      if (status !== timerStatus) {
        setTimerStatus(status);
      }

      // Calculate remaining time based on status
      if (status === TIMER_STATES.IDLE) {
        setTimeLeft(calculateTimeRemaining(startDateTime));
      } else if (status === TIMER_STATES.RUNNING || status === TIMER_STATES.SURVIVAL) {
        setTimeLeft(calculateTimeRemaining(endDateTime));
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus]);

  return {
    timeLeft,
    timerStatus,
    currentTime,
  };
};

/**
 * Custom hook to manage body class changes based on timer status
 */
export const useBodyClassManager = (timerStatus) => {
  useEffect(() => {
    // Remove all existing mode classes
    Object.values(CSS_CLASSES.BODY_MODES).forEach(className => {
      document.body.classList.remove(className);
    });

    // Add the current mode class
    const currentModeClass = CSS_CLASSES.BODY_MODES[timerStatus.toUpperCase()];
    if (currentModeClass) {
      document.body.classList.add(currentModeClass);
    }

    // Cleanup function
    return () => {
      Object.values(CSS_CLASSES.BODY_MODES).forEach(className => {
        document.body.classList.remove(className);
      });
    };
  }, [timerStatus]);
};
