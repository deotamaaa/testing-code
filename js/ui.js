// Shared UI concerns: tab switching.

/**
 * Wires up the tab bar. Shows the matching panel and fires an optional
 * callback when a specific tab becomes active.
 * @param {Object<string, () => void>} [onActivate] map of tab name -> callback
 */
export function initTabs(onActivate = {}) {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.panel');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            panels.forEach((p) => p.classList.remove('active'));

            tab.classList.add('active');
            const name = tab.dataset.tab;
            document.getElementById(name).classList.add('active');

            onActivate[name]?.();
        });
    });
}
