# CANDLE

CANDLE is a Cantonese language learning application. It displays vocabulary and phrases for daily practice.

## Features

- **Content Rotation**: Updates words and phrases on a daily schedule, containing 445 words and 108 phrases.
- **Challenges**: Provides text guessing tasks based on Jyutping spelling.
- **Speech Synthesis**: Plays Cantonese audio using the Web Speech API.
- **Progress Tracking**: Increments a counter for consecutive correct answers.
- **Wiktionary Lookup**: Queries the Wiktionary API for definitions and Jyutping data, caching results in local storage.

## Structure

- `public/dictionary.json`: Data file containing words and phrases.
- `src/components/`: Layout, Dashboard, Countdown, and Challenge components.
- `src/services/candle-api.js`: Logic for data retrieval, Wiktionary requests, and audio playback.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Web Speech API
- Wiktionary API
- localStorage
