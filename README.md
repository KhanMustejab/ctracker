# Consistency Tracker 🎯

A simple, mobile-first web app to track your daily habits and build streaks. No login required, no backend needed—all data is stored locally in your browser.

## Features ✨

- **Create & Manage Habits** - Add habits like "Namaz", "Gym", "Reading", etc.
- **Daily Tracking** - Mark habits as done each day with a simple toggle
- **Streak Tracking** - See your current streak, best streak, and completion percentage
- **Visual Progress** - 21-day view with green (completed) and gray (missed) indicators
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Persistent Storage** - All data saved in browser localStorage—survives browser restarts
- **No Dependencies** - Pure HTML, CSS, and vanilla JavaScript

## Live Demo 🚀

Visit the live app at:
```
https://yourusername.github.io/ctracker/
```

(Replace `yourusername` with your GitHub username after deployment)

## Project Structure 📁

```
ctracker/
├── index.html              # HTML structure and templates
├── style.css               # Mobile-first responsive styles
├── script.js               # Core application logic
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment config
└── README.md               # This file
```

## How It Works 🔧

### Adding a Habit
1. Type a habit name in the input field (e.g., "Morning Jog")
2. Press Enter or tap the "+" button
3. The habit appears as a new card

### Tracking Daily Progress
- **Today's Toggle**: Check the "Done today" box to mark the habit as completed today
- **Past Days**: Click any day in the 21-day view to mark it complete/incomplete
- Changes are instantly saved to your browser's localStorage

### Understanding Statistics
- **Current Streak**: Consecutive completed days ending today (or yesterday if you skipped today)
- **Best Streak**: Your longest consecutive completion streak ever
- **Completed**: Total days this habit was marked done
- **Success %**: Completion percentage since you created the habit

### Deleting a Habit
- Tap the "✕" button on any habit card
- Confirm deletion (cannot be undone)

## Deployment to GitHub Pages 🌐

### Prerequisites
- A GitHub account
- Git installed locally
- The repository already created on GitHub

### Step-by-Step Deployment

#### 1. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `ctracker`
3. Choose "Public" visibility (required for free GitHub Pages)
4. Do NOT initialize with README/gitignore/license
5. Click "Create repository"

#### 2. Push Code to GitHub
```bash
# Navigate to your project directory
cd ctracker

# Initialize git and configure
git init
git add .
git commit -m "Initial commit: Add consistency tracker app"

# Add remote and push to main branch
git remote add origin https://github.com/yourusername/ctracker.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your actual GitHub username.

#### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source", select:
   - Deploy from branch
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment to complete

#### 4. Access Your App
Your app will be live at:
```
https://yourusername.github.io/ctracker/
```

Check the **Actions** tab to see deployment logs and status.

### Automatic Deployment

Once you've set up GitHub Pages, the `.github/workflows/deploy.yml` workflow automatically:
- Triggers on every push to the `main` branch
- Builds and deploys your app to GitHub Pages
- Updates the live site within seconds

No additional configuration needed! Just push code and your changes go live.

## Data Storage 💾

All data is stored in your browser's **localStorage**:
- Key: `consistency-tracker-habits`
- Persists across browser sessions and device restarts
- **Privacy**: Data never leaves your device; no backend or database
- **Clearing Data**: Data persists until you clear browser storage or reset site data

To manually clear all data:
1. Open DevTools (F12 on Windows, Cmd+Option+I on Mac)
2. Go to **Application** → **Local Storage**
3. Find `consistency-tracker-habits` and delete it

## Technology Stack 🛠️

- **HTML5** - Semantic structure
- **CSS3** - Mobile-first responsive design with flexbox and grid
- **Vanilla JavaScript** - No frameworks or libraries
- **localStorage API** - Browser-based data persistence
- **GitHub Actions** - CI/CD for automatic deployment

## Browser Compatibility ✅

Works on all modern browsers:
- ✅ Chrome/Chromium (mobile & desktop)
- ✅ Firefox (mobile & desktop)
- ✅ Safari (iOS & macOS)
- ✅ Edge (Windows)
- ✅ Opera

Requires JavaScript enabled and localStorage support.

## Tips for Best Experience 📱

1. **Add to Home Screen** (Mobile):
   - iOS: Tap Share → Add to Home Screen
   - Android: Tap ⋮ → Install app
   - Converts the web app to a native-like experience

2. **Consistent Tracking**:
   - Check off your habits every morning or evening
   - Streaks reset if you skip a day
   - Focus on building long streaks!

3. **Mobile Optimization**:
   - App works great in landscape mode
   - Scrollable list for many habits
   - Large touch targets for easy interaction

## Troubleshooting 🐛

### App not loading
- Clear browser cache and reload
- Check browser console (F12) for errors
- Ensure you're visiting the correct GitHub Pages URL

### Data disappeared
- Check if localStorage was cleared
- Verify you're on the same device/browser
- Private browsing mode doesn't persist data

### Deployment not updating
- Check GitHub Actions tab for workflow status
- Wait 1-2 minutes for GitHub Pages to deploy
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Future Enhancements 🚀

Possible features for future versions:
- Export habit data as JSON
- Theme customization (dark mode)
- Habit categories and filtering
- Backup and restore functionality
- Multiple device sync via cloud storage

## License 📄

This project is open source and available for personal use. Feel free to fork, modify, and deploy your own version.

## Questions or Feedback? 💬

Found a bug or have a feature request? Open an issue on GitHub!

---

**Happy tracking! Build consistency, one day at a time. 💪**
