// Calorie tracking feature: data access + rendering.

import { load, save } from './storage.js';
import { today, escapeHtml } from './utils.js';

const KEY = 'omr_calories';

/**
 * @returns {Array<{id:number,name:string,kcal:number,date:string}>}
 */
export function getCalories() {
    return load(KEY);
}

/**
 * Adds a calorie entry.
 * @param {{name:string,kcal:number,date:string}} data
 */
export function addCalorie(data) {
    const calories = getCalories();
    calories.push({ id: Date.now(), ...data });
    save(KEY, calories);
}

/**
 * Removes a calorie entry by id.
 * @param {number} id
 */
export function deleteCalorie(id) {
    save(KEY, getCalories().filter((c) => c.id !== id));
}

/**
 * Renders the calorie history list into the given element.
 * @param {HTMLElement} listEl
 * @param {(id:number)=>void} onDelete
 */
export function renderCalories(listEl, onDelete) {
    const calories = getCalories().slice().reverse();

    if (!calories.length) {
        listEl.innerHTML = '<div class="empty">No calorie entries yet.</div>';
        return;
    }

    listEl.innerHTML = calories.map((c) => `<li>
        <div>
            <div class="entry-main">${escapeHtml(c.name)} — ${c.kcal} kcal</div>
            <div class="entry-sub">${c.date}</div>
        </div>
        <button class="del" data-id="${c.id}" title="Delete">&times;</button>
    </li>`).join('');

    listEl.querySelectorAll('.del').forEach((btn) => {
        btn.addEventListener('click', () => onDelete(Number(btn.dataset.id)));
    });
}

/**
 * Wires up the calorie form and history list.
 * @param {() => void} onChange callback fired after data changes
 */
export function initCalories(onChange) {
    const listEl = document.getElementById('calorieList');
    const dateEl = document.getElementById('foodDate');
    dateEl.value = today();

    function refresh() {
        renderCalories(listEl, (id) => {
            deleteCalorie(id);
            refresh();
            onChange?.();
        });
    }

    document.getElementById('addCalorieBtn').addEventListener('click', () => {
        const name = document.getElementById('foodName').value.trim();
        const kcal = parseInt(document.getElementById('foodKcal').value, 10);

        if (!name) {
            alert('Please enter a food name.');
            return;
        }
        if (isNaN(kcal) || kcal < 0) {
            alert('Please enter a valid calorie amount.');
            return;
        }

        addCalorie({ name, kcal, date: dateEl.value || today() });

        document.getElementById('foodName').value = '';
        document.getElementById('foodKcal').value = '';

        refresh();
        onChange?.();
    });

    refresh();
}
