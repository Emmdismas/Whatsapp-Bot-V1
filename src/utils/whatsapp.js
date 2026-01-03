// utils/whatsapp.js
import axios from "axios";
import config from "../config.js";

export async function sendDocument(to, url, filename, caption = "") {
  await axios.post(
    `https://graph.facebook.com/v19.0/${config.phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link: url,
        filename,
        caption,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${config.whatsappToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function sendDocument(to, url, filename, mimetype) {
  await sock.sendMessage(to, {
    document: { url },
    fileName: filename,
    mimetype,
  });
}
