import PropTypes from 'prop-types';

/**
 * Full-screen countdown overlay component
 */
const CountdownOverlay = ({ showCountdown, countdownNumber, animateNumber }) => {
  if (!showCountdown) {
    return null;
  }

  return (
    <div className="countdown-overlay">
      <div className={`countdown-number ${animateNumber ? "animate-number" : ""}`}>
        {countdownNumber}
      </div>
    </div>
  );
};

CountdownOverlay.propTypes = {
  showCountdown: PropTypes.bool.isRequired,
  countdownNumber: PropTypes.number.isRequired,
  animateNumber: PropTypes.bool.isRequired,
};

export default CountdownOverlay;
