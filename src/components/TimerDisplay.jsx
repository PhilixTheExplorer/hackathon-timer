import PropTypes from 'prop-types';
import { TIMER_STATES } from '../constants/config';
import "../styles/TimerDisplay.css";

/**
 * Timer display component with time blocks and status messages
 */
const TimerDisplay = ({ timerStatus, timeLeft, survivalPeriodMinutes }) => {
  const getStatusMessage = () => {
    switch (timerStatus) {
      case TIMER_STATES.IDLE:
        return "Time until start:";
      case TIMER_STATES.RUNNING:
        return "Time remaining:";
      case TIMER_STATES.SURVIVAL:
        return "";
      case TIMER_STATES.COMPLETED:
        return "Hackathon has ended!";
      default:
        return "";
    }
  };

  const timeBlocks = [
    { value: timeLeft.hours, label: "hours" },
    { value: timeLeft.minutes, label: "minutes" },
    { value: timeLeft.seconds, label: "seconds" },
  ];

  return (
    <div className={`timer-display ${timerStatus}`}>
      <h2>{getStatusMessage()}</h2>

      {timerStatus === TIMER_STATES.SURVIVAL && (
        <div className="survival-warning">
          ⚠️ FINAL COUNTDOWN: Less than {survivalPeriodMinutes} minutes remaining! ⚠️
        </div>
      )}

      <div className="countdown">
        {timeBlocks.map(({ value, label }) => (
          <div key={label} className="time-block">
            <span className="time-value">{value}</span>
            <span className="time-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

TimerDisplay.propTypes = {
  timerStatus: PropTypes.string.isRequired,
  timeLeft: PropTypes.shape({
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  survivalPeriodMinutes: PropTypes.number.isRequired,
};

export default TimerDisplay;
