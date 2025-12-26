// BOOKS
export async function getBooks(schoolId) {
  const res = await axios.get(
    `${API_BASE}/schools/${schoolId}/books`
  );
  return res.data;
}

export async function downloadBook(bookId) {
  const res = await axios.get(
    `${API_BASE}/books/${bookId}/download`
  );
  return res.data;
}
// NOTICES
export async function getNotices(schoolId, className) {
  const res = await axios.get(
    `${API_BASE}/schools/${schoolId}/notices`,
    { params: { class: className } }
  );
  return res.data;
}

export async function downloadNotice(noticeId) {
  const res = await axios.get(
    `${API_BASE}/notices/${noticeId}/download`
  );
  return res.data;
}
