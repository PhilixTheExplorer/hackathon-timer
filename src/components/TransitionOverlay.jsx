import PropTypes from 'prop-types';

/**
 * Full-screen transition overlay component
 */
const TransitionOverlay = ({ showTransition, activeTransition, transitionMessage }) => {
  if (!showTransition) {
    return null;
  }

  return (
    <div className={`transition-overlay ${activeTransition}-transition`}>
      <div className="transition-text">{transitionMessage}</div>
    </div>
  );
};

TransitionOverlay.propTypes = {
  showTransition: PropTypes.bool.isRequired,
  activeTransition: PropTypes.string,
  transitionMessage: PropTypes.string.isRequired,
};

export default TransitionOverlay;
