import "./styles/AppStyles.css";
import "./styles/TransitionStyles.css";

// Components
import TimerDisplay from "./components/TimerDisplay";
import Mascot from "./components/Mascot";
import CountdownOverlay from "./components/CountdownOverlay";
import TransitionOverlay from "./components/TransitionOverlay";
import CurrentTime from "./components/CurrentTime";

// Hooks
import { useTimerState, useBodyClassManager } from "./hooks/useTimer";
import { useCountdown } from "./hooks/useCountdown";
import { useTransitions } from "./hooks/useTransitions";

// Constants
import { CONFIG } from "./constants/config";

/**
 * Main App component - Hackathon Timer
 */
function App() {
  // Custom hooks for state management
  const { timeLeft, timerStatus, currentTime } = useTimerState();
  const { showCountdown, countdownNumber, animateNumber } = useCountdown(timerStatus, timeLeft);
  const { showTransition, activeTransition, transitionMessage } = useTransitions(timerStatus);
  
  // Manage body classes based on timer status
  useBodyClassManager(timerStatus);

  return (
    <>
      <div className={`main-container ${timerStatus}`}>
        <Mascot timerStatus={timerStatus} />
        
        <div className={`hackathon-timer ${timerStatus}`}>
          <h1>{CONFIG.EVENT_NAME}</h1>
          
          <TimerDisplay
            timerStatus={timerStatus}
            timeLeft={timeLeft}
            survivalPeriodMinutes={CONFIG.SURVIVAL_PERIOD_MINUTES}
          />
          
          <CurrentTime currentTime={currentTime} />
        </div>
      </div>

      <CountdownOverlay
        showCountdown={showCountdown}
        countdownNumber={countdownNumber}
        animateNumber={animateNumber}
      />

      <TransitionOverlay
        showTransition={showTransition}
        activeTransition={activeTransition}
        transitionMessage={transitionMessage}
      />
    </>
  );
}

export default App;
