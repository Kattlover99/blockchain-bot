import config from "../config";
import Redis from "ioredis";

export const $redis = new Redis({
  db: config.REDIS.db
});

export default $redis;
