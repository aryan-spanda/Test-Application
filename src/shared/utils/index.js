// Shared utility functions
export const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
  },
  
  error: (message, error, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error, ...args);
  },
  
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
  }
};

export const formatResponse = (success, data, message = '') => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
