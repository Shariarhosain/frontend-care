export const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// "chess, Reading" -> ["chess", "reading"]
export const toInterestList = (text) =>
  text
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
