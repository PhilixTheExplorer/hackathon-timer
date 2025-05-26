import { useState, useEffect } from "react";
import "./styles/AppStyles.css";
import "./styles/TransitionStyles.css";
import TimerDisplay from "./components/TimerDisplay";
import Header from "./components/Header";
import {
  calculateTimeRemaining,
  determineTimerStatus,
} from "./utils/timeUtils";

function App() {
  // Load configuration from environment variables
  const startTime = import.meta.env.VITE_START_TIME || "2025-05-19T18:50";
  const endTime = import.meta.env.VITE_END_TIME || "2025-05-19T18:52";
  const timeZone = import.meta.env.VITE_TIME_ZONE || "Asia/Bangkok";
  const survivalPeriodMinutes = parseInt(
    import.meta.env.VITE_SURVIVAL_PERIOD_MINUTES || "1"
  );

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerStatus, setTimerStatus] = useState("idle"); // 'idle', 'running', 'survival', 'completed'
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-US", { timeZone })
  );

  // Countdown overlay state
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [animateNumber, setAnimateNumber] = useState(false);
  const [prevCountdownNum, setPrevCountdownNum] = useState(null);

  // Transition overlay state
  const [activeTransition, setActiveTransition] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");
  const [prevStatus, setPrevStatus] = useState("idle");

  // Effect to update body class based on timer status
  useEffect(() => {
    // Add or remove classes from body based on timer status
    if (timerStatus === "idle") {
      document.body.classList.add("idle-mode");
      document.body.classList.remove("running-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    } else if (timerStatus === "running") {
      document.body.classList.remove("idle-mode");
      document.body.classList.add("running-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    } else if (timerStatus === "survival") {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("running-mode");
      document.body.classList.add("survival-mode");
      document.body.classList.remove("completed-mode");
    } else if (timerStatus === "completed") {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("running-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.add("completed-mode");
    } else {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("running-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    }

    // Cleanup function to remove classes when component unmounts
    return () => {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("running-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    };
  }, [timerStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("en-US", { timeZone }));

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);

      // Determine the current timer status
      const status = determineTimerStatus(
        now,
        startDateTime,
        endDateTime,
        survivalPeriodMinutes
      );

      // Update the timer status
      if (status !== timerStatus) {
        setTimerStatus(status);
      }

      // Calculate remaining time based on status
      if (status === "idle") {
        // Before start - calculate time until start
        setTimeLeft(calculateTimeRemaining(startDateTime));
      } else if (status === "running" || status === "survival") {
        // During event - calculate time until end
        setTimeLeft(calculateTimeRemaining(endDateTime));
      } else {
        // Event completed
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [startTime, endTime, timeZone, survivalPeriodMinutes, timerStatus]);

  // Handle pre-start countdown
  useEffect(() => {
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

  // Handle status transitions
  useEffect(() => {
    // If timerStatus has changed from previous status, a transition is occurring
    if (timerStatus !== prevStatus) {
      console.log(`Transition: ${prevStatus} to ${timerStatus}`);

      // Define transition settings for different state changes
      const transitions = {
        idle_running: {
          type: "running",
          message: "🚀 Let's Code! Hackathon is LIVE! 🚀",
        },
        running_survival: {
          type: "survival",
          message: "⚡ CRUNCH TIME! Final push! ⚡",
        },
        survival_completed: {
          type: "completed",
          message: "🎉 Hackathon COMPLETE!🎉",
        },
      };

      // Check if a transition is occurring
      const transitionKey = `${prevStatus}_${timerStatus}`;
      const currentTransition = transitions[transitionKey];

      if (currentTransition) {
        // Set up the transition
        setShowTransition(true);
        setActiveTransition(currentTransition.type);
        setTransitionMessage(currentTransition.message);

        // Hide transition after animation completes
        const timer = setTimeout(() => {
          setShowTransition(false);
          setActiveTransition(null);
          // Update prevStatus only after the transition animation is complete
          setPrevStatus(timerStatus);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // If no transition animation is needed, update prevStatus immediately
        setPrevStatus(timerStatus);
      }
    }
  }, [timerStatus, prevStatus]);

  return (
    <>
      {/* <Header /> */}
      <div className={`main-container ${timerStatus}`}>
        {timerStatus === "running" && (
          <div className="mascot-container">
            <img
              src="/mascot.png"
              alt="Hackathon Mascot"
              className="mascot-image"
            />
          </div>
        )}
        <div className={`hackathon-timer ${timerStatus}`}>
          <h1>
            {import.meta.env.VITE_EVENT_NAME || "CS Hackathon Timer 2025"}
          </h1>

          <TimerDisplay
            timerStatus={timerStatus}
            timeLeft={timeLeft}
            survivalPeriodMinutes={survivalPeriodMinutes}
          />
          <div className="current-time">
            <p>Current Time: {currentTime}</p>
          </div>
        </div>
      </div>

      {/* Full-Screen Countdown Overlay */}
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
      )}

      {/* Full-Screen Transition Overlay */}
      {showTransition && (
        <div className={`transition-overlay ${activeTransition}-transition`}>
          <div className="transition-text">{transitionMessage}</div>
        </div>
      )}
    </>
  );
}

export default App;
