import redis from 'redis';
import logger from '../utils/logger.js';

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
      logger.info('Redis connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('⚠️ Redis connection failed, continuing without caching');
    logger.warn(`Redis connection failed: ${error}`);
    return null;
  }
};

export { redisClient, connectRedis };