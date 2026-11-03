// Shared utility helpers used across features.

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 * @returns {string}
 */
export function today() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Escapes a string for safe insertion into HTML.
 * @param {*} str
 * @returns {string}
 */
export function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[s]));
}

/**
 * Returns an array of the last `n` ISO dates (oldest first), ending today.
 * @param {number} n
 * @returns {string[]}
 */
export function lastNDates(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }
    return days;
}
