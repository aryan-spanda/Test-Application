// Shared constants across frontend and backend
export const API_ENDPOINTS = {
  HEALTH: '/health',
  USERS: '/api/users',
  METRICS: '/metrics'
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const APP_CONFIG = {
  DEFAULT_PORT: 3000,
  DEFAULT_HOST: 'localhost'
};
