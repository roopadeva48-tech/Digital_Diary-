import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Digital Diary Server running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`========================================`);
});
