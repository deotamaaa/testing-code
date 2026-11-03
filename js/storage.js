// Thin wrapper around localStorage. This is the single place that touches
// the browser storage API, so swapping it for a real backend later only
// requires changing this file.

/**
 * Reads and parses an array from localStorage.
 * @param {string} key
 * @returns {Array}
 */
export function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        console.error(`Failed to read "${key}" from storage`, e);
        return [];
    }
}

/**
 * Serializes and stores a value in localStorage.
 * @param {string} key
 * @param {*} data
 */
export function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
