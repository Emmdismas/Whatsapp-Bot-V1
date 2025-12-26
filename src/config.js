import dotenv from "dotenv";
dotenv.config();


export default {
port: process.env.PORT || 3000,
verifyToken: process.env.VERIFY_TOKEN,
whatsappToken: process.env.WHATSAPP_TOKEN,
phoneNumberId: process.env.PHONE_NUMBER_ID,
laravelUrl: process.env.LARAVEL_URL,
laravelApiKey: process.env.LARAVEL_API_KEY,
redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
openaiKey: process.env.OPENAI_KEY,
aiModel: process.env.AI_MODEL || "gpt-4o-mini",
sessionTtl: parseInt(process.env.SESSION_TTL || "3600", 10)
};