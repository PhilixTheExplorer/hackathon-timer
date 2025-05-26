/**
 * Calculates time remaining between now and a target date
 * @param {Date} targetDate - The target date to calculate time until
 * @returns {Object} Object containing hours, minutes, seconds
 */
export const calculateTimeRemaining = (targetDate) => {
    const now = new Date();
    const diff = targetDate - now;

    // If the difference is negative, return all zeros
    if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
};

/**
 * Determines the current timer status based on current time and event times
 * @param {Date} now - Current date/time
 * @param {Date} startDateTime - Event start date/time
 * @param {Date} endDateTime - Event end date/time
 * @param {Number} survivalPeriodMinutes - Minutes threshold for "survival" mode
 * @returns {String} Timer status: 'idle', 'running', 'survival', or 'completed'
 */
export const determineTimerStatus = (now, startDateTime, endDateTime, survivalPeriodMinutes) => {
    if (now < startDateTime) {
        return "idle";
    } else if (now >= startDateTime && now < endDateTime) {
        const diff = endDateTime - now;
        const diffMinutes = diff / (1000 * 60);

        if (diffMinutes <= survivalPeriodMinutes) {
            return "survival";
        } else {
            return "running";
        }
    } else {
        return "completed";
    }
};
