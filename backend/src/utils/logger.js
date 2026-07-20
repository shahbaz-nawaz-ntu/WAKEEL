import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');
const errorLogFile = path.join(logDir, 'error.log');

const logger = {
  info: (message, meta = {}) => {
    const log = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.log(`ℹ️ ${message}`);
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  },

  warn: (message, meta = {}) => {
    const log = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.warn(`⚠️ ${message}`);
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  },

  error: (message, meta = {}) => {
    const log = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.error(`❌ ${message}`);
    fs.appendFileSync(errorLogFile, JSON.stringify(log) + '\n');
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = {
        level: 'debug',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      };
      console.debug(`🔍 ${message}`);
      fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
    }
  },
};

export default logger;