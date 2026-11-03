// Application entry point. Wires features and shared UI together.

import { initTabs } from './ui.js';
import { initWorkouts } from './workouts.js';
import { initCalories } from './calories.js';
import { renderProgress } from './progress.js';

function main() {
    // Re-render progress whenever underlying data changes.
    const refreshProgress = () => renderProgress();

    initWorkouts(refreshProgress);
    initCalories(refreshProgress);

    // Recompute progress when its tab is opened.
    initTabs({ progress: renderProgress });

    // Initial progress render so stats are correct on first load.
    renderProgress();
}

document.addEventListener('DOMContentLoaded', main);
