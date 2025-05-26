import PropTypes from 'prop-types';

/**
 * Current time display component
 */
const CurrentTime = ({ currentTime }) => {
  return (
    <div className="current-time">
      <p>Current Time: {currentTime}</p>
    </div>
  );
};

CurrentTime.propTypes = {
  currentTime: PropTypes.string.isRequired,
};

export default CurrentTime;
