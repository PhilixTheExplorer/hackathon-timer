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

  // Helper function for animating time blocks
  const animateTimeBlocks = (blockClass, valueClass) => {
    // Add animation class to time blocks
    document.querySelectorAll(".time-block").forEach((block) => {
      block.classList.add(blockClass);

      // Remove the class after animation completes
      setTimeout(() => {
        block.classList.remove(blockClass);
      }, 3000);
    });

    // Add animation to time values
    document.querySelectorAll(".time-value").forEach((value) => {
      value.classList.add(valueClass);

      // Remove the class after animation completes
      setTimeout(() => {
        value.classList.remove(valueClass);
      }, 3000);
    });
  };

  // Helper to get transition class name
  const getTransitionClassName = () => {
    if (showTransition) return "transition-to-running";
    if (showSurvivalTransition) return "transition-to-survival";
    if (showCompletedTransition) return "transition-to-completed";
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
          message: "Hackathon Started!",
          blockClass: "transition-active",
          valueClass: "transition-value",
        },
        running_survival: {
          setShow: setShowSurvivalTransition,
          type: "survival",
          message: "Final Countdown!",
          blockClass: "survival-transition",
          valueClass: "survival-value",
        },
        survival_completed: {
          setShow: setShowCompletedTransition,
          type: "completed",
          message: "Time's Up!",
          blockClass: "completed-transition",
          valueClass: "completed-value",
        },
      };

      // Check if a transition is occurring
      const transitionKey = `${prevStatus}_${timerStatus}`;
      const currentTransition = transitions[transitionKey];

      if (currentTransition) {
        // Handle specific transitions
        if (transitionKey === "idle_running") {
          setShowCountdown(false);
        }

        // Set up the transition
        currentTransition.setShow(true);
        setActiveTransition(currentTransition.type);
        setTransitionMessage(currentTransition.message);
        animateTimeBlocks(
          currentTransition.blockClass,
          currentTransition.valueClass
        );

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
    <div
      className={`timer-display ${timerStatus} ${getTransitionClassName()} ${
        showCountdown ? "pre-start-countdown" : ""
      }`}
    >
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
        <div className={`${activeTransition}-transition`}>
          <div
            className={`transition-text ${activeTransition}-transition-text`}
          >
            {transitionMessage}
          </div>
          <div
            className={`transition-countdown ${activeTransition}-countdown`}
          ></div>
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
