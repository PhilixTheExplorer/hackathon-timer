import "../styles/TimerDisplay.css";
import "../styles/TransitionStyles.css";

const TimerDisplay = ({ timerStatus, timeLeft, survivalPeriodMinutes }) => {
  return (
    <div className={`timer-display ${timerStatus}`}>
      <h2>
        {timerStatus === "idle" && "Time until start:"}
        {timerStatus === "running" && "Time remaining:"}
        {timerStatus === "survival" && ""}
        {timerStatus === "completed" && "Hackathon has ended!"}{" "}
      </h2>

      {timerStatus === "survival" && (
        <div className="survival-warning">
          ⚠️ FINAL COUNTDOWN: Less than {survivalPeriodMinutes} minutes
          remaining! ⚠️
        </div>
      )}

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
