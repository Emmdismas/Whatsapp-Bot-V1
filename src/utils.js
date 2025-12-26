import axios from "axios";
import config from "./config.js";


export async function sendText(to, body) {
try {
await axios.post(
`https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`,
{
messaging_product: "whatsapp",
to,
text: { body }
},
{ headers: { Authorization: `Bearer ${config.whatsappToken}` } }
);
} catch (err) {
console.error("sendText error:", err.response?.data || err.message);
throw err;
}
}


export async function sendDocument(to, url, filename, caption = "") {
  try {
    // optional: check HEAD for content-length (avoid very large files)
    const head = await axios.head(url).catch(()=>null);
    const maxBytes = 25 * 1024 * 1024; // 25MB limit for messenger
    if (head?.headers?.['content-length'] && parseInt(head.headers['content-length'],10) > maxBytes) {
      throw new Error("File too large to send via WhatsApp");
    }

    await axios.post(
      `https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        document: { link: url, filename },
        ...(caption ? { text: { body: caption } } : {})
      },
      { headers: { Authorization: `Bearer ${config.whatsappToken}` } }
    );
  } catch (err) {
    console.error("sendDocument error:", err.response?.data || err.message);
    throw err;
  }
}



export async function getMediaUrl(mediaId) {
// Returns object with url field (WhatsApp Graph API requires retrieving media URL using id)
const url = `https://graph.facebook.com/v17.0/${mediaId}`;
const res = await axios.get(url, { headers: { Authorization: `Bearer ${config.whatsappToken}` } });
return res.data.url || res.data;
}