import Redis from "ioredis";
import config from "./config.js";


const redis = new Redis(config.redisUrl);


export async function getSession(phone) {
const raw = await redis.get(`sess:${phone}`);
return raw ? JSON.parse(raw) : null;
}


export async function setSession(phone, payload, ttl = config.sessionTtl) {
await redis.set(`sess:${phone}`, JSON.stringify(payload), "EX", ttl);
}


export async function delSession(phone) {
await redis.del(`sess:${phone}`);
}


export default redis;