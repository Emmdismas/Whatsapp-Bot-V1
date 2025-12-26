import { sendDocument } from "../utils/whatsapp.js";

export async function sendFile(phone, file) {
  await sendDocument(
    phone,
    file.file_url,
    file.title,
    file.file_type
  );
}
