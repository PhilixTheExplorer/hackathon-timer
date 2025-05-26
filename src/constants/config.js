/**
 * Application configuration constants
 */

// Environment configuration
export const CONFIG = {
  START_TIME: import.meta.env.VITE_START_TIME || "2025-05-19T18:50",
  END_TIME: import.meta.env.VITE_END_TIME || "2025-05-19T18:52",
  TIME_ZONE: import.meta.env.VITE_TIME_ZONE || "Asia/Bangkok",
  SURVIVAL_PERIOD_MINUTES: parseInt(import.meta.env.VITE_SURVIVAL_PERIOD_MINUTES || "1"),
  EVENT_NAME: import.meta.env.VITE_EVENT_NAME || "CS Hackathon Timer 2025",
};

// Timer states
export const TIMER_STATES = {
  IDLE: "idle",
  RUNNING: "running",
  SURVIVAL: "survival",
  COMPLETED: "completed",
};

// Transition configurations
export const TRANSITIONS = {
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

// Animation durations
export const ANIMATIONS = {
  COUNTDOWN_DURATION: 900,
  TRANSITION_DURATION: 3000,
};

// CSS class names
export const CSS_CLASSES = {
  BODY_MODES: {
    IDLE: "idle-mode",
    RUNNING: "running-mode",
    SURVIVAL: "survival-mode",
    COMPLETED: "completed-mode",
  },
};
