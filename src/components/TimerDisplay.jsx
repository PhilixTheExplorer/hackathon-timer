import { useState, useEffect } from "react";
import "../styles/TimerDisplay.css";
import "../styles/TransitionStyles.css";

const TimerDisplay = ({ timerStatus, timeLeft, survivalPeriodMinutes }) => {
  const [activeTransition, setActiveTransition] = useState(null); // 'running', 'survival', 'completed'
  const [showTransition, setShowTransition] = useState(false);
  const [showSurvivalTransition, setShowSurvivalTransition] = useState(false);
  const [showCompletedTransition, setShowCompletedTransition] = useState(false);
  const [prevStatus, setPrevStatus] = useState(timerStatus);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [prevCountdownNum, setPrevCountdownNum] = useState(null);
  const [animateNumber, setAnimateNumber] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");
  // Helper to get transition class name
  const getTransitionClassName = () => {
    return "";
  };

  // Handle pre-start countdown
  useEffect(() => {
    // Handle pre-start countdown (3 seconds before start)
    if (
      timerStatus === "idle" &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds <= 3 &&
      timeLeft.seconds > 0
    ) {
      setShowCountdown(true);

      // If the countdown number changed, trigger animation
      if (timeLeft.seconds !== prevCountdownNum) {
        setPrevCountdownNum(timeLeft.seconds);
        setCountdownNumber(timeLeft.seconds);
        setAnimateNumber(true);

        // Reset animation flag after animation completes
        setTimeout(() => {
          setAnimateNumber(false);
        }, 900);
      }
    } else {
      setShowCountdown(false);
    }
  }, [timerStatus, timeLeft, prevCountdownNum]);

  // Handle all status transitions
  useEffect(() => {
    // If timerStatus has changed from previous status, a transition is occurring
    if (timerStatus !== prevStatus) {
      console.log(`Transition: ${prevStatus} to ${timerStatus}`); // Define transition settings for different state changes
      const transitions = {
        idle_running: {
          setShow: setShowTransition,
          type: "running",
          message: "🚀 Let's Code! Hackathon is LIVE! 🚀",
        },
        running_survival: {
          setShow: setShowSurvivalTransition,
          type: "survival",
          message: "⚡ CRUNCH TIME! Final push! ⚡",
        },
        survival_completed: {
          setShow: setShowCompletedTransition,
          type: "completed",
          message: "🎉 Hackathon COMPLETE! Well done, CS Juniors! 🎉",
        },
      };

      // Check if a transition is occurring
      const transitionKey = `${prevStatus}_${timerStatus}`;
      const currentTransition = transitions[transitionKey];

      if (currentTransition) {
        // Handle specific transitions
        if (transitionKey === "idle_running") {
          setShowCountdown(false);
        } // Set up the transition
        currentTransition.setShow(true);
        setActiveTransition(currentTransition.type);
        setTransitionMessage(currentTransition.message);

        // Hide transition after animation completes
        const timer = setTimeout(() => {
          currentTransition.setShow(false);
          setActiveTransition(null);
          // Update prevStatus only after the transition animation is complete
          // This prevents the transition from re-triggering incorrectly
          setPrevStatus(timerStatus);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // If no transition animation is needed, update prevStatus immediately
        setPrevStatus(timerStatus);
      }
    }
  }, [timerStatus, prevStatus]);

  // Debug timing of transitions
  useEffect(() => {
    console.log(
      `DEBUG: Status=${timerStatus}, ShowTransitions: running=${showTransition}, survival=${showSurvivalTransition}, completed=${showCompletedTransition}`
    );
  }, [
    timerStatus,
    showTransition,
    showSurvivalTransition,
    showCompletedTransition,
  ]);

  return (
    <div className={`timer-display ${timerStatus} ${getTransitionClassName()}`}>
      <h2>
        {timerStatus === "idle" && !showCountdown && "Time until start:"}
        {timerStatus === "idle" && showCountdown && "Starting in:"}
        {timerStatus === "running" && "Time remaining:"}
        {timerStatus === "survival" && ""}
        {timerStatus === "completed" && "Hackathon has ended!"}
      </h2>{" "}
      {showCountdown && (
        <div className="countdown-overlay">
          <div
            className={`countdown-number ${
              animateNumber ? "animate-number" : ""
            }`}
          >
            {countdownNumber}
          </div>
        </div>
      )}{" "}
      {/* Render transitions based on which one is active */}
      {activeTransition && (
        <div className={`transition-overlay ${activeTransition}-transition`}>
          <div className="transition-text">{transitionMessage}</div>
        </div>
      )}
      {timerStatus === "survival" && (
        <div className="survival-warning">
          ⚠️ FINAL COUNTDOWN: Less than {survivalPeriodMinutes} minutes
          remaining! ⚠️
        </div>
      )}{" "}
      <div className="countdown">
        <div className="time-block">
          <span className="time-value">{timeLeft.hours}</span>
          <span className="time-label">hours</span>
        </div>
        <div className="time-block">
          <span className="time-value">{timeLeft.minutes}</span>
          <span className="time-label">minutes</span>
        </div>
        <div className="time-block">
          <span className="time-value">{timeLeft.seconds}</span>
          <span className="time-label">seconds</span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
