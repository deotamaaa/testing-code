// Progress feature: aggregates data from workouts + calories into stats
// and a simple 7-day calorie chart.

import { getWorkouts } from './workouts.js';
import { getCalories } from './calories.js';
import { today, lastNDates } from './utils.js';

/**
 * Recomputes and renders all progress stats and the chart.
 */
export function renderProgress() {
    const workouts = getWorkouts();
    const calories = getCalories();

    // Workouts logged
    document.getElementById('statWorkouts').innerText = workouts.length;

    // Calories today
    const t = today();
    const kcalToday = calories
        .filter((c) => c.date === t)
        .reduce((sum, c) => sum + c.kcal, 0);
    document.getElementById('statKcalToday').innerText = kcalToday;

    // Active days (any workout or calorie entry)
    const allDates = new Set([
        ...workouts.map((w) => w.date),
        ...calories.map((c) => c.date),
    ]);
    document.getElementById('statDays').innerText = allDates.size;

    renderChart(calories);
}

/**
 * Renders a 7-day calorie bar chart.
 * @param {Array<{kcal:number,date:string}>} calories
 */
function renderChart(calories) {
    const days = lastNDates(7);
    const totals = days.map((d) =>
        calories.filter((c) => c.date === d).reduce((sum, c) => sum + c.kcal, 0)
    );
    const max = Math.max(...totals, 1);

    const chart = document.getElementById('calorieChart');
    chart.innerHTML = days.map((d, i) => {
        const pct = (totals[i] / max) * 100;
        const label = d.slice(5); // MM-DD
        return `<div class="bar-row">
            <span class="bar-date">${label}</span>
            <span class="bar-track"><span class="bar-fill" style="width:${pct}%"></span></span>
            <span class="bar-val">${totals[i]} kcal</span>
        </div>`;
    }).join('');
}
