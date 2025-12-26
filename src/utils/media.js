// src/utils/media.js
import axios from "axios";
import config from "../config.js";

export async function getMediaUrl(mediaId) {
  const res = await axios.get(
    `https://graph.facebook.com/v19.0/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${config.whatsappToken}`
      }
    }
  );

  return res.data.url;
}
