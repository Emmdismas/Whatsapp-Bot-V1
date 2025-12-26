import config from "./config.js";
import { handleIncoming } from "./router.js";


export default async function webhookHandler(req, res) {
try {
const body = req.body;


// WhatsApp Cloud API wraps updates in entry -> changes -> value
const entry = body.entry?.[0];
const change = entry?.changes?.[0];
const value = change?.value;


if (!value) return res.sendStatus(200);


// messages array
const message = value.messages?.[0];
if (!message) return res.sendStatus(200);


const from = message.from; // phone number
const text = message.text?.body || null;
const type = message.type || (message.text ? 'text' : null);


// pass along entire message object for media handling
await handleIncoming({ from, text, type, raw: message, waMeta: value });


return res.sendStatus(200);
} catch (err) {
console.error("Webhook error:", err);
return res.sendStatus(500);
}
}