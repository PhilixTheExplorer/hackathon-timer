import PropTypes from "prop-types";
import { TIMER_STATES } from "../constants/config";

/**
 * Mascot component that displays during running state
 */
const Mascot = ({ timerStatus }) => {
  if (timerStatus !== TIMER_STATES.RUNNING) {
    return null;
  }

  return (
    <div className="mascot-container">
      <img
        src="/mascot.png"
        alt="Hackathon Mascot"
        className="mascot-image"
        loading="lazy"
      />
    </div>
  );
};

Mascot.propTypes = {
  timerStatus: PropTypes.string.isRequired,
};

export default Mascot;
