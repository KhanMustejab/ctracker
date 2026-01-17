/**
 * Consistency Tracker - Main Application Script
 * 
 * Features:
 * - Create and manage daily habits
 * - Track completion streaks
 * - Calculate statistics (completion %, best streak, etc.)
 * - Persist data to localStorage
 * - Mobile-first responsive design
 */

// ===================================
// DATA MANAGEMENT
// ===================================

/**
 * Habit Data Structure:
 * {
 *   id: unique identifier
 *   name: habit name
 *   createdAt: timestamp when habit was created
 *   completedDates: array of date strings (YYYY-MM-DD format)
 * }
 */

const STORAGE_KEY = 'consistency-tracker-habits';

/**
 * Get all habits from localStorage
 */
function getHabits() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save all habits to localStorage
 */
function saveHabits(habits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Get date string from a Date object
 */
function getDateString(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Get date from string (YYYY-MM-DD)
 */
function getDateFromString(dateStr) {
    return new Date(dateStr + 'T00:00:00Z');
}

/**
 * Create a new habit
 */
function createHabit(name) {
    const habits = getHabits();
    const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        completedDates: []
    };
    habits.push(newHabit);
    saveHabits(habits);
    return newHabit;
}

/**
 * Delete a habit
 */
function deleteHabit(habitId) {
    const habits = getHabits();
    const filtered = habits.filter(h => h.id !== habitId);
    saveHabits(filtered);
}

/**
 * Toggle a habit's completion for a specific date
 */
function toggleHabitCompletion(habitId, dateStr) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    const index = habit.completedDates.indexOf(dateStr);
    if (index > -1) {
        habit.completedDates.splice(index, 1);
    } else {
        habit.completedDates.push(dateStr);
    }
    
    saveHabits(habits);
}

/**
 * Check if a habit was completed on a specific date
 */
function isHabitCompletedOnDate(habit, dateStr) {
    return habit.completedDates.includes(dateStr);
}

// ===================================
// STATISTICS CALCULATION
// ===================================

/**
 * Calculate current streak for a habit
 * Streak counts consecutive completed days ending today or yesterday
 */
function calculateCurrentStreak(habit) {
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
        const dateStr = getDateString(currentDate);
        if (isHabitCompletedOnDate(habit, dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

/**
 * Calculate longest streak for a habit
 */
function calculateLongestStreak(habit) {
    if (habit.completedDates.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...habit.completedDates].sort();
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = getDateFromString(sortedDates[i - 1]);
        const currDate = getDateFromString(sortedDates[i]);
        
        // Check if dates are consecutive
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    
    return maxStreak;
}

/**
 * Calculate total completed days
 */
function calculateTotalCompleted(habit) {
    return habit.completedDates.length;
}

/**
 * Calculate completion percentage
 * Based on days since habit creation
 */
function calculateCompletionPercentage(habit) {
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    
    // Calculate days since creation
    const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysSinceCreation === 0) return 0;
    
    const completedDays = habit.completedDates.length;
    const percentage = Math.round((completedDays / daysSinceCreation) * 100);
    
    return Math.min(percentage, 100);
}

/**
 * Get last N days as array of date strings
 */
function getLastNDays(n) {
    const days = [];
    const today = new Date();
    
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(getDateString(date));
    }
    
    return days;
}

// ===================================
// DOM MANIPULATION & RENDERING
// ===================================

const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitsList = document.getElementById('habitsList');
const emptyState = document.getElementById('emptyState');
const habitTemplate = document.getElementById('habitTemplate');

/**
 * Render all habits
 */
function renderHabits() {
    const habits = getHabits();
    
    // Clear existing habits
    habitsList.innerHTML = '';
    
    if (habits.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    habits.forEach(habit => {
        renderHabit(habit);
    });
}

/**
 * Render a single habit card
 */
function renderHabit(habit) {
    const card = habitTemplate.content.cloneNode(true);
    const cardElement = card.querySelector('.habit-card');
    
    // Set habit name
    card.querySelector('.habit-name').textContent = habit.name;
    
    // Calculate and display stats
    const currentStreak = calculateCurrentStreak(habit);
    const bestStreak = calculateLongestStreak(habit);
    const totalCompleted = calculateTotalCompleted(habit);
    const completionPercent = calculateCompletionPercentage(habit);
    
    card.querySelector('.current-streak').textContent = currentStreak;
    card.querySelector('.best-streak').textContent = bestStreak;
    card.querySelector('.total-completed').textContent = totalCompleted;
    card.querySelector('.completion-percentage').textContent = completionPercent + '%';
    
    // Set progress bar width
    const progressFill = card.querySelector('.progress-fill');
    progressFill.style.width = completionPercent + '%';
    
    // Render last 21 days
    const daysGrid = card.querySelector('.days-grid');
    const last21Days = getLastNDays(21);
    
    last21Days.forEach(dateStr => {
        const dayBox = document.createElement('div');
        dayBox.className = 'day-box';
        
        const isCompleted = isHabitCompletedOnDate(habit, dateStr);
        const isMissed = !isCompleted;
        
        if (isCompleted) {
            dayBox.classList.add('completed');
            dayBox.textContent = '✓';
        } else {
            dayBox.classList.add('missed');
            dayBox.textContent = '·';
        }
        
        dayBox.setAttribute('data-date', dateStr);
        
        // Click to toggle completion on past dates
        dayBox.style.cursor = 'pointer';
        dayBox.addEventListener('click', () => {
            toggleHabitCompletion(habit.id, dateStr);
            renderHabits();
        });
        
        daysGrid.appendChild(dayBox);
    });
    
    // Set up today's checkbox
    const todayCheckbox = card.querySelector('.today-checkbox');
    const today = getTodayDateString();
    
    todayCheckbox.checked = isHabitCompletedOnDate(habit, today);
    
    todayCheckbox.addEventListener('change', () => {
        toggleHabitCompletion(habit.id, today);
        renderHabits();
    });
    
    // Set up delete button
    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
            deleteHabit(habit.id);
            renderHabits();
        }
    });
    
    habitsList.appendChild(card);
}

// ===================================
// EVENT LISTENERS
// ===================================

/**
 * Add new habit on button click
 */
addHabitBtn.addEventListener('click', addNewHabit);

/**
 * Add new habit on Enter key press
 */
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewHabit();
    }
});

/**
 * Clear input focus on mobile after adding
 */
function addNewHabit() {
    const habitName = habitInput.value.trim();
    
    if (habitName.length === 0) {
        habitInput.focus();
        return;
    }
    
    createHabit(habitName);
    habitInput.value = '';
    renderHabits();
    habitInput.focus();
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize the app on page load
 */
function initApp() {
    renderHabits();
    
    // Set focus to input for better UX
    habitInput.focus();
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);

// Handle visibility change to refresh stats (for accuracy when returning to app)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        renderHabits();
    }
});
