# LifeOS - Personal Productivity Dashboard

LifeOS is a full-stack personal productivity application that acts as a comprehensive daily control center. It integrates task cycle tracking, habits monitoring, yearly goals manager, daily schedule timetable, analytics dashboard, and gamified achievements into a single unified workspace.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Day.js, Lucide Icons
- **Backend**: Node.js, Express.js, node-cron
- **Database**: MongoDB (Atlas Cloud / local), Mongoose
- **State Management**: React Context API
- **Authentication**: Single-user application (no auth required)

---

## Folder Structure

```
TODO/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB configuration
│   │   ├── controllers/     # REST controller actions
│   │   ├── models/          # Mongoose DB Schemas
│   │   ├── routes/          # Express API Routers
│   │   ├── services/        # Cron jobs & achievement checking
│   │   ├── scripts/         # Seed script for quotes/configs
│   │   └── server.js        # Main Express server entry point
│   ├── .env                 # API configuration settings
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Common UI Components
│   │   ├── context/         # React Context API state manager
│   │   ├── pages/           # Pages (Dashboard, Tasks, Habits, etc.)
│   │   ├── App.jsx          # Route coordinator
│   │   ├── index.css        # Tailwind styling configurations
│   │   └── main.jsx         # React root configuration
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

---

## Core Features

1. **Dashboard & Summary**: 
   - Summary panels for total, completed, partial, and pending tasks.
   - Time-based progress indicators (Daily, Weekly, Monthly, and Yearly).
   - Live countdown timers updating every second for the Day, Week, Month, and Year.
   - Quote of the day panel with a manual randomized refresh trigger.

2. **Task Management**:
   - Organize tasks by category: **Daily Tasks**, **Weekly Tasks**, and **Monthly Tasks**.
   - Two task workflows: **Repeatable** (resets progress automatically at midnight, updates streaks) and **One-time** (archived on completion).
   - Partial completion system: Set numeric target values and progress units (e.g. read 45 out of 100 pages).
   - Custom duration tracking: Set Start/End dates with countdown timers and overdue status markers.
   - Sorting, search, and category filter bars.

3. **Habit Tracking**:
   - Isolates repeatable daily routines.
   - Tracks current completion streaks, best streaks, total completions, and success rate metrics.

4. **Yearly Goals**:
   - Track high-level targets with progress meters, checkboxes, and target dates.

5. **Daily Timetable**:
   - Manage your daily routine chronologically (e.g. 6:00 AM Wake Up, 7:00 AM Workout).
   - Timeline visual list with custom color label tags.

6. **Statistics & Analytics**:
   - Interactive charts using **Recharts**:
     - Daily completion trends (last 30 days area charts).
     - Weekly productivity trends (last 12 weeks bar charts).
     - Monthly productivity trends (last 12 months bar charts).
     - Habit consistency ratings (success rate comparison).
     - Task Category distribution (Daily vs Weekly vs Monthly vs Yearly).

7. **Achievements System**:
   - Unlock badges like "First Step", "Week of Iron" (7-day streak), "Habit Master" (30-day streak), and "Dream Chaser" (completed a yearly goal).
   - Displays unlock dates.

---

## Server Reset and Downtime Catch-Up

LifeOS implements a midnight cron service using `node-cron` that resets repeatable tasks and logs snapshots to `HabitHistory` and `Statistics` at 12:00 AM. 

To ensure the system survives server downtime:
- Upon server startup, the backend compares the system date with the `lastResetDate` stored in MongoDB.
- If it detects that days have passed while the server was offline, it executes resets sequentially day-by-day to accurately compute streaks, log history records, and catch up, guaranteeing data consistency.

---

## Quick Start Setup

### Prerequisites
- Node.js (v18+)
- Active MongoDB connection (MongoDB Atlas or Local MongoDB Server)

### 1. Configure the Backend
Navigate to the `backend` folder:
Create a `.env` file (which is done automatically in this workspace) and define variables:
```
PORT=5000
MONGODB_URI=mongodb+srv://nagaraj:8nJs1CeFjGon8S3P@cluster0.yatypy4.mongodb.net/lifeos?appName=Cluster0
```

Install packages and seed database:
```bash
cd backend
npm install
npm run seed
```

### 2. Start the Backend API
```bash
npm run dev
```
The backend server will run on `http://localhost:5000`.

### 3. Setup and Run the Frontend
Navigate to the `frontend` folder:
```bash
cd ../frontend
npm install
npm run dev
```
The Vite server will start. Open `http://localhost:5173` (or the printed port) in your browser.
