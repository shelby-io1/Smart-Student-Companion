# Smart Student Companion

A comprehensive React Native mobile application built with Expo SDK 54, designed to help students manage their academic life with notes, weather updates, movie discovery, and personalized settings.

## Features

### Authentication
- Email/Password sign-up and login via Firebase Authentication
- Persistent session management
- Secure logout with navigation stack reset

### Notes Management
- Create, view, and delete notes
- Notes stored per user in Firestore
- Recent notes preview on home screen
- Real-time refresh on screen focus

### Weather & Movies (Explore)
- Real-time weather data via OpenWeatherMap API
- Popular movies feed via TMDB API
- Movie search functionality
- Detailed movie information view

### Personalization
- **Edit Profile Modal**: Edit name, username, email, password, and favorite subject
- **Dark Mode**: Global dark/light theme toggle with persistent setting
- Per-account profile storage using AsyncStorage
- Dynamic greeting based on time of day

### Settings
- Dark mode toggle (persisted)
- Logout button

## Tech Stack

| Technology | Version |
|------------|---------|
| React Native | 0.81.5 |
| Expo | ~54.0.0 |
| React | 19.1.0 |
| Firebase JS SDK | ^10.12.0 |
| React Navigation | 6.x |
| AsyncStorage | 2.2.0 |

## Dependencies

- `expo` - Core Expo SDK
- `firebase` - Authentication & Firestore database
- `@react-navigation/native` + `native-stack` + `bottom-tabs` - Navigation
- `@react-native-async-storage/async-storage` - Local persistent storage
- `react-native-safe-area-context` - Safe area handling
- `react-native-url-polyfill` - URL polyfill for Hermes engine
- `@expo/vector-icons` - Ionicons icon set
- `expo-status-bar` - Status bar management

## Project Structure

```
SmartStudentCompanion/
├── App.js                    # Root component with theme provider
├── index.js                  # Entry point (URL polyfill + app registration)
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── package.json              # Dependencies and scripts
├── src/
│   ├── components/
│   │   ├── CustomButton.js   # Reusable button component
│   │   ├── CustomCard.js     # Reusable card component
│   │   ├── LoadingIndicator.js
│   │   └── WeatherCard.js    # Weather display card
│   ├── constants/
│   │   └── colors.js         # Color constants
│   ├── navigation/
│   │   └── AppNavigator.js   # Navigation structure (Stack + Tabs)
│   ├── screens/
│   │   ├── SplashScreen.js   # Animated splash with auth check
│   │   ├── LoginScreen.js    # Email/password login
│   │   ├── SignupScreen.js   # User registration
│   │   ├── HomeScreen.js     # Dashboard with edit profile modal
│   │   ├── NotesScreen.js    # Notes CRUD
│   │   ├── ExploreScreen.js  # Weather + Movies
│   │   ├── DetailScreen.js   # Movie details
│   │   └── SettingsScreen.js # Dark mode + logout
│   ├── services/
│   │   ├── api.js            # OpenWeatherMap & TMDB API calls
│   │   └── firebase.js       # Firebase initialization & helpers
│   └── utils/
│       ├── ThemeContext.js    # Dark/light theme provider
│       └── validation.js     # Email/password validation
```

## API Keys Required

### OpenWeatherMap
1. Sign up at https://openweathermap.org/api
2. Get your API key
3. Add to `src/services/api.js`

### TMDB (The Movie Database)
1. Sign up at https://www.themoviedb.org/settings/api
2. Request an API key
3. Add to `src/services/api.js`

### Firebase
1. Create a project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Register a Web app and copy config
5. Update `src/services/firebase.js`

## Getting Started

```bash
# Clone the repository
git clone https://github.com/shelby-io1/Smart-Student-Companion.git
cd Smart-Student-Companion

# Install dependencies
npm install

# Start the Expo development server
npx expo start --clear
```

Scan the QR code with **Expo Go** on your mobile device, or press:
- `a` for Android emulator
- `i` for iOS simulator
- `w` for web browser

## Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Animated logo with Firebase auth state check |
| **Login** | Email/password sign-in with validation |
| **Signup** | New account registration |
| **Home** | Greeting, profile edit button, quick actions, recent notes |
| **Notes** | Full notes list with add/delete |
| **Explore** | Weather card + movie search/browse |
| **Detail** | Movie details view |
| **Settings** | Dark mode toggle, logout |

## License

This project was developed as a React Native Mobile App Development lab project.
