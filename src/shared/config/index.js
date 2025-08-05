// Shared configuration
const config = {
  development: {
    api: {
      baseUrl: 'http://localhost:3000',
      timeout: 5000
    },
    features: {
      logging: true,
      metrics: true
    }
  },
  
  production: {
    api: {
      baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
      timeout: 10000
    },
    features: {
      logging: process.env.ENABLE_LOGGING === 'true',
      metrics: process.env.ENABLE_METRICS === 'true'
    }
  }
};

export default config;
