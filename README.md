# FitStreak AI - Personalized Habit Coach + Virtual Pet

A gamified habit tracking app with AI-powered motivation and a virtual pet that grows based on your daily habits.

## Features

- 🐱 **Virtual Pet**: Cute pet that changes mood based on habit completion
- 🔥 **Streak Tracking**: Track daily and best streaks
- 🤖 **AI Motivation**: Personalized daily messages powered by OpenAI
- 🎯 **5 Core Habits**: Water, Steps, Sleep, Meditation, Medicine
- 🎉 **Gamification**: Confetti celebrations, progress tracking
- 🔐 **Google Auth**: One-click login with Google

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication > Google provider
4. Create Firestore database
5. Copy config to `src/config/firebase.js`

### 2. OpenAI API Setup
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to `src/services/ai.js`

### 3. Run the App
```bash
npm install
npm run dev
```

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **AI**: OpenAI GPT-4o mini
- **Animations**: Framer Motion
- **State**: React Query

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx    # Main app interface
│   ├── Pet.jsx         # Virtual pet component
│   ├── HabitCard.jsx   # Individual habit cards
│   └── Login.jsx       # Google OAuth login
├── hooks/
│   ├── useAuth.js      # Authentication logic
│   └── useHabits.js    # Habit tracking logic
├── services/
│   └── ai.js          # OpenAI integration
├── config/
│   └── firebase.js    # Firebase configuration
└── App.jsx           # Main app component
```

## Demo Features

- Real-time habit tracking
- Animated pet responses
- Streak calculations
- AI-generated motivational messages
- Confetti celebrations
- Responsive design

Perfect for hackathons and demos! 🚀