// Gym workout feature: data access + rendering.

import { load, save } from './storage.js';
import { today, escapeHtml } from './utils.js';

const KEY = 'omr_workouts';

/**
 * @returns {Array<{id:number,name:string,sets:string,reps:string,weight:string,date:string}>}
 */
export function getWorkouts() {
    return load(KEY);
}

/**
 * Adds a workout entry.
 * @param {{name:string,sets:string,reps:string,weight:string,date:string}} data
 */
export function addWorkout(data) {
    const workouts = getWorkouts();
    workouts.push({ id: Date.now(), ...data });
    save(KEY, workouts);
}

/**
 * Removes a workout by id.
 * @param {number} id
 */
export function deleteWorkout(id) {
    save(KEY, getWorkouts().filter((w) => w.id !== id));
}

/**
 * Renders the workout history list into the given element.
 * @param {HTMLElement} listEl
 * @param {(id:number)=>void} onDelete
 */
export function renderWorkouts(listEl, onDelete) {
    const workouts = getWorkouts().slice().reverse();

    if (!workouts.length) {
        listEl.innerHTML = '<div class="empty">No workouts logged yet.</div>';
        return;
    }

    listEl.innerHTML = workouts.map((w) => {
        const detail = [
            w.sets && w.reps ? `${w.sets}x${w.reps}` : '',
            w.weight ? `${w.weight}kg` : '',
        ].filter(Boolean).join(' · ');

        return `<li>
            <div>
                <div class="entry-main">${escapeHtml(w.name)}${detail ? ' — ' + detail : ''}</div>
                <div class="entry-sub">${w.date}</div>
            </div>
            <button class="del" data-id="${w.id}" title="Delete">&times;</button>
        </li>`;
    }).join('');

    listEl.querySelectorAll('.del').forEach((btn) => {
        btn.addEventListener('click', () => onDelete(Number(btn.dataset.id)));
    });
}

/**
 * Wires up the workout form and history list.
 * @param {() => void} onChange callback fired after data changes
 */
export function initWorkouts(onChange) {
    const listEl = document.getElementById('workoutList');
    const dateEl = document.getElementById('exDate');
    dateEl.value = today();

    function refresh() {
        renderWorkouts(listEl, (id) => {
            deleteWorkout(id);
            refresh();
            onChange?.();
        });
    }

    document.getElementById('addWorkoutBtn').addEventListener('click', () => {
        const name = document.getElementById('exName').value.trim();
        if (!name) {
            alert('Please enter an exercise name.');
            return;
        }

        addWorkout({
            name,
            sets: document.getElementById('exSets').value,
            reps: document.getElementById('exReps').value,
            weight: document.getElementById('exWeight').value,
            date: dateEl.value || today(),
        });

        document.getElementById('exName').value = '';
        document.getElementById('exSets').value = '';
        document.getElementById('exReps').value = '';
        document.getElementById('exWeight').value = '';

        refresh();
        onChange?.();
    });

    refresh();
}
