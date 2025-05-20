import { useState, useEffect } from "react";
import "./styles/AppStyles.css";
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
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerStatus, setTimerStatus] = useState("idle"); // 'idle', 'running', 'survival', 'completed'
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-US", { timeZone })
  ); // Effect to update body class based on timer status
  useEffect(() => {
    // Add or remove classes from body based on timer status
    if (timerStatus === "idle") {
      document.body.classList.add("idle-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    } else if (timerStatus === "survival") {
      document.body.classList.remove("idle-mode");
      document.body.classList.add("survival-mode");
      document.body.classList.remove("completed-mode");
    } else if (timerStatus === "completed") {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.add("completed-mode");
    } else {
      document.body.classList.remove("idle-mode");
      document.body.classList.remove("survival-mode");
      document.body.classList.remove("completed-mode");
    }

    // Cleanup function to remove classes when component unmounts
    return () => {
      document.body.classList.remove("idle-mode");
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [startTime, endTime, timeZone, survivalPeriodMinutes, timerStatus]);

  return (
    <>
      <Header />

      <div className={`hackathon-timer ${timerStatus}`}>
        <h1>{import.meta.env.VITE_EVENT_NAME || "CS Hackathon Timer 2025"}</h1>

        <TimerDisplay
          timerStatus={timerStatus}
          timeLeft={timeLeft}
          survivalPeriodMinutes={survivalPeriodMinutes}
        />
        <div className="current-time">
          <p>Current Time: {currentTime}</p>
        </div>
      </div>
    </>
  );
}

export default App;
