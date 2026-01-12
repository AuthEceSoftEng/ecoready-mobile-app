/**
 * Format date to DD-MM-YYYY format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date (DD-MM-YYYY)
 */
export const formatDateDMY = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Format date to DD-MM format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date (DD-MM)
 */
export const formatDateDM = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}`;
};

/**
 * Format date to DD-MM HH:MM format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date and time (DD-MM HH:MM)
 */
export const formatDateTimeDM = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month} ${hours}:${minutes}`;
};
