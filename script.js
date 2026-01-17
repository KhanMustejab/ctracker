/**
 * Consistency Tracker - Main Application Script
 * 
 * Features:
 * - Create and manage daily habits with start/end dates
 * - Track completion streaks within date ranges
 * - Calculate statistics (completion %, best streak, etc.)
 * - Persist data to localStorage
 * - Mobile-first responsive design
 */

// ===================================
// CONSTANTS
// ===================================

const STORAGE_KEY = 'consistency-tracker-habits';
const MAX_HABIT_DURATION_DAYS = 90;

// ===================================
// DATA MANAGEMENT
// ===================================

/**
 * Habit Data Structure:
 * {
 *   id: unique identifier
 *   name: habit name
 *   startDate: date string (YYYY-MM-DD format)
 *   endDate: date string (YYYY-MM-DD format)
 *   createdAt: timestamp when habit was created
 *   completionDates: array of date strings (YYYY-MM-DD format)
 * }
 */

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
 * Calculate days difference between two date strings
 */
function calculateDaysDifference(startStr, endStr) {
    const start = getDateFromString(startStr);
    const end = getDateFromString(endStr);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

/**
 * Add N days to a date string
 */
function addDaysToDate(dateStr, days) {
    const date = getDateFromString(dateStr);
    date.setDate(date.getDate() + days);
    return getDateString(date);
}

/**
 * Validate date range for habit creation
 * Returns: { valid: boolean, error: string }
 */
function validateDateRange(startDateStr, endDateStr) {
    const start = getDateFromString(startDateStr);
    const end = getDateFromString(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if end date is after start date
    if (end <= start) {
        return { valid: false, error: 'End date must be after start date' };
    }

    // Check maximum duration (90 days)
    const daysDiff = calculateDaysDifference(startDateStr, endDateStr);
    if (daysDiff > MAX_HABIT_DURATION_DAYS) {
        return { 
            valid: false, 
            error: `Maximum duration is ${MAX_HABIT_DURATION_DAYS} days. Your range is ${daysDiff} days.` 
        };
    }

    return { valid: true, error: '' };
}

/**
 * Migrate existing habits without dates and ensure all properties exist
 */
function migrateHabits() {
    const habits = getHabits();
    const today = getTodayDateString();
    const endDate = addDaysToDate(today, 21);
    
    const updated = habits.map(habit => {
        const migratedHabit = {
            id: habit.id || Date.now().toString(),
            name: habit.name || 'Unnamed Habit',
            startDate: habit.startDate || today,
            endDate: habit.endDate || endDate,
            createdAt: habit.createdAt || new Date().toISOString(),
            completionDates: habit.completionDates || []
        };
        return migratedHabit;
    });

    if (JSON.stringify(habits) !== JSON.stringify(updated)) {
        saveHabits(updated);
    }
}

/**
 * Create a new habit with date range
 */
function createHabit(name, startDateStr, endDateStr) {
    const validation = validateDateRange(startDateStr, endDateStr);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    const habits = getHabits();
    const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        startDate: startDateStr,
        endDate: endDateStr,
        createdAt: new Date().toISOString(),
        completionDates: []
    };
    habits.push(newHabit);
    saveHabits(habits);
    return { success: true, habit: newHabit };
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
    
    // Ensure completionDates exists
    if (!habit.completionDates || !Array.isArray(habit.completionDates)) {
        habit.completionDates = [];
    }
    
    const index = habit.completionDates.indexOf(dateStr);
    if (index > -1) {
        habit.completionDates.splice(index, 1);
    } else {
        habit.completionDates.push(dateStr);
    }
    
    saveHabits(habits);
}

/**
 * Check if a habit was completed on a specific date
 */
function isHabitCompletedOnDate(habit, dateStr) {
    if (!habit || !habit.completionDates || !Array.isArray(habit.completionDates)) {
        return false;
    }
    return habit.completionDates.includes(dateStr);
}

/**
 * Check if a date is within habit's date range
 */
function isDateWithinRange(habit, dateStr) {
    return dateStr >= habit.startDate && dateStr <= habit.endDate;
}

// ===================================
// HABIT STATUS
// ===================================

/**
 * Get habit status: 'not-started', 'active', or 'completed'
 */
function getHabitStatus(habit) {
    const today = getTodayDateString();
    
    if (today < habit.startDate) {
        return 'not-started';
    } else if (today > habit.endDate) {
        return 'completed';
    } else {
        return 'active';
    }
}

/**
 * Get status badge text and color
 */
function getStatusBadgeInfo(status) {
    const badges = {
        'not-started': { text: 'Not Started', class: 'badge-not-started' },
        'active': { text: 'Active', class: 'badge-active' },
        'completed': { text: 'Completed', class: 'badge-completed' }
    };
    return badges[status] || badges['active'];
}

/**
 * Get status message for display
 */
function getStatusMessage(habit) {
    const status = getHabitStatus(habit);
    const today = getTodayDateString();
    
    if (status === 'not-started') {
        const startDate = getDateFromString(habit.startDate);
        return `Starts on ${startDate.toLocaleDateString()}`;
    } else if (status === 'completed') {
        const endDate = getDateFromString(habit.endDate);
        return `Ended on ${endDate.toLocaleDateString()}`;
    } else {
        const endDate = getDateFromString(habit.endDate);
        const daysLeft = calculateDaysDifference(today, habit.endDate) + 1;
        return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`;
    }
}

// ===================================
// STATISTICS CALCULATION
// ===================================

/**
 * Calculate current streak for a habit (within date range)
 */
function calculateCurrentStreak(habit) {
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
        const dateStr = getDateString(currentDate);
        
        // Stop if outside habit date range
        if (!isDateWithinRange(habit, dateStr)) {
            break;
        }
        
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
 * Calculate longest streak for a habit (within date range)
 */
function calculateLongestStreak(habit) {
    if (!habit.completionDates || !Array.isArray(habit.completionDates)) {
        return 0;
    }
    
    const datesInRange = habit.completionDates.filter(date => 
        isDateWithinRange(habit, date)
    );
    
    if (datesInRange.length === 0) return 0;
    
    const sortedDates = [...datesInRange].sort();
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = getDateFromString(sortedDates[i - 1]);
        const currDate = getDateFromString(sortedDates[i]);
        
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
 * Calculate total completed days within date range
 */
function calculateTotalCompleted(habit) {
    if (!habit.completionDates || !Array.isArray(habit.completionDates)) {
        return 0;
    }
    
    return habit.completionDates.filter(date => 
        isDateWithinRange(habit, date)
    ).length;
}

/**
 * Calculate completion percentage (based on days in range)
 */
function calculateCompletionPercentage(habit) {
    const daysDiff = calculateDaysDifference(habit.startDate, habit.endDate) + 1;
    
    if (daysDiff === 0) return 0;
    
    const completedDays = calculateTotalCompleted(habit);
    const percentage = Math.round((completedDays / daysDiff) * 100);
    
    return Math.min(percentage, 100);
}

/**
 * Get all days in the habit range
 */
function getDaysToDisplay(habit) {
    const daysDiff = calculateDaysDifference(habit.startDate, habit.endDate) + 1;
    const days = [];
    let currentDate = getDateFromString(habit.startDate);
    
    for (let i = 0; i < daysDiff; i++) {
        const dateStr = getDateString(currentDate);
        days.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
}

// ===================================
// DOM MANIPULATION & RENDERING
// ===================================

let habitInput;
let quickAddBtn;
let habitNameInput;
let startDateInput;
let endDateInput;
let confirmAddBtn;
let closeFormBtn;
let dateError;
let expandedForm;
let habitsList;
let emptyState;
let habitTemplate;

/**
 * Initialize DOM references after page loads
 */
function initDOMReferences() {
    habitInput = document.getElementById('habitInput');
    quickAddBtn = document.getElementById('quickAddBtn');
    habitNameInput = document.getElementById('habitNameInput');
    startDateInput = document.getElementById('startDate');
    endDateInput = document.getElementById('endDate');
    confirmAddBtn = document.getElementById('confirmAddBtn');
    closeFormBtn = document.getElementById('closeFormBtn');
    dateError = document.getElementById('dateError');
    expandedForm = document.getElementById('expandedForm');
    habitsList = document.getElementById('habitsList');
    emptyState = document.getElementById('emptyState');
    habitTemplate = document.getElementById('habitTemplate');
}

/**
 * Set default dates on form open
 */
function setDefaultDates() {
    const today = getTodayDateString();
    const defaultEnd = addDaysToDate(today, 21);
    
    startDateInput.value = today;
    endDateInput.value = defaultEnd;
    dateError.style.display = 'none';
}

/**
 * Show form with pre-filled habit name
 */
function showForm(habitName = '') {
    habitNameInput.value = habitName;
    setDefaultDates();
    expandedForm.classList.remove('hidden');
    // Focus on habit name if empty, otherwise on start date
    (habitName ? startDateInput : habitNameInput).focus();
}

/**
 * Hide form
 */
function hideForm() {
    expandedForm.classList.add('hidden');
    habitInput.value = '';
    habitNameInput.value = '';
    dateError.textContent = '';
    dateError.style.display = 'none';
    habitInput.focus();
}

/**
 * Render all habits
 */
function renderHabits() {
    const habits = getHabits();
    
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
    
    const status = getHabitStatus(habit);
    const badgeInfo = getStatusBadgeInfo(status);
    const statusMessage = getStatusMessage(habit);
    
    // Set habit name
    card.querySelector('.habit-name').textContent = habit.name;
    
    // Set dates
    card.querySelector('.habit-start-date').textContent = 
        getDateFromString(habit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    card.querySelector('.habit-end-date').textContent = 
        getDateFromString(habit.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Set status badge
    const statusBadge = card.querySelector('.habit-status-badge');
    statusBadge.textContent = badgeInfo.text;
    statusBadge.className = 'habit-status-badge ' + badgeInfo.class;
    
    // Set status message
    card.querySelector('.habit-status-message').textContent = statusMessage;
    
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
    
    // Render days grid
    const daysGrid = card.querySelector('.days-grid');
    const daysLabelText = card.querySelector('.days-label-text');
    const daysToShow = getDaysToDisplay(habit);
    const today = getTodayDateString();
    
    // Update days label to show total days
    const totalDaysInRange = daysToShow.length;
    daysLabelText.textContent = `${totalDaysInRange} days`;
    
    daysToShow.forEach(dateStr => {
        const dayBox = document.createElement('div');
        dayBox.className = 'day-box';
        
        const isCompleted = isHabitCompletedOnDate(habit, dateStr);
        const isToday = dateStr === today;
        
        if (isCompleted) {
            dayBox.classList.add('completed');
            dayBox.textContent = '✓';
        } else {
            dayBox.classList.add('missed');
            dayBox.textContent = '·';
        }
        
        if (isToday) {
            dayBox.classList.add('today');
        }
        
        dayBox.setAttribute('data-date', dateStr);
        dayBox.style.cursor = 'pointer';
        
        dayBox.addEventListener('click', () => {
            // Only allow toggling if within date range
            if (isDateWithinRange(habit, dateStr)) {
                toggleHabitCompletion(habit.id, dateStr);
                renderHabits();
            }
        });
        
        daysGrid.appendChild(dayBox);
    });
    
    // Set up today's checkbox
    const todayCheckbox = card.querySelector('.today-checkbox');
    const canToggleToday = isDateWithinRange(habit, today) && status === 'active';
    
    todayCheckbox.checked = canToggleToday && isHabitCompletedOnDate(habit, today);
    todayCheckbox.disabled = !canToggleToday;
    
    todayCheckbox.addEventListener('change', () => {
        if (canToggleToday) {
            toggleHabitCompletion(habit.id, today);
            renderHabits();
        }
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
 * Attach all event listeners
 */
function attachEventListeners() {
    /**
     * Show form when clicking quick add button
     */
    quickAddBtn.addEventListener('click', () => {
        const habitName = habitInput.value.trim();
        showForm(habitName);
    });

    /**
     * Close form when clicking cancel
     */
    closeFormBtn.addEventListener('click', () => {
        hideForm();
    });

    /**
     * Create habit with validation
     */
    confirmAddBtn.addEventListener('click', () => {
        const habitName = habitNameInput.value.trim();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (!habitName) {
            dateError.textContent = 'Please enter a habit name';
            dateError.style.display = 'block';
            habitNameInput.focus();
            return;
        }
        
        if (!startDate || !endDate) {
            dateError.textContent = 'Please select both start and end dates';
            dateError.style.display = 'block';
            return;
        }
        
        const result = createHabit(habitName, startDate, endDate);
        
        if (!result.success) {
            dateError.textContent = result.error;
            dateError.style.display = 'block';
            return;
        }
        
        hideForm();
        renderHabits();
    });

    /**
     * Allow Enter key to submit in habit name input
     */
    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            quickAddBtn.click();
        }
    });

    /**
     * Allow Enter key to submit in habit name input (expanded form)
     */
    habitNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startDateInput.focus();
        }
    });
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize the app on page load
 */
function initApp() {
    // Initialize DOM references
    initDOMReferences();
    
    // Attach event listeners
    attachEventListeners();
    
    // Migrate existing habits without dates
    migrateHabits();
    
    renderHabits();
    habitInput.focus();
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);

// Handle visibility change to refresh stats
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        renderHabits();
    }
});
