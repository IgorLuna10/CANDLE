# CANDLE 🕯️ — Cantonese Language Learning

> **TL;DR (FR)** : Application web interactive d'apprentissage du cantonais développée en **React 18, Vite (SWC) et Tailwind CSS**. Elle propose un mot quotidien, la romanisation phonétique Jyutping, l'écoute audio de la prononciation, ainsi qu'une intégration dynamique avec l'API Wiktionnaire pour afficher les définitions complètes et les exemples d'usage contextuels.

An interactive web application designed to help learners build and retain Cantonese vocabulary through structured daily exposure, phonetic transcription, and dictionary enrichment.

---

## 📸 Features & UI

- **Daily Cantonese Spotlight**: Curated daily word display with traditional Chinese characters.
- **Jyutping Phonetics**: Accurate tonal marks and Jyutping romanization to master Cantonese pronunciation.
- **Audio Pronunciation**: Interactive audio playback to train auditory comprehension and tonal recognition.
- **Wiktionary API Integration**: Real-time retrieval of comprehensive character definitions, etymologies, and contextual sample sentences.
- **Modern Responsive Interface**: Clean, minimalist aesthetic styled with Tailwind CSS, optimized for mobile and desktop screens.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework & Core** | React 18, React DOM |
| **Build Tool** | Vite with `@vitejs/plugin-react-swc` |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer |
| **External API** | Wiktionary REST API |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/IgorLuna10/CANDLE.git
   cd CANDLE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 💡 What I Learned

- **API Parsing & Resiliency**: Built resilient async data fetchers to handle irregular wiki-markup formatting returned by public Wiktionary endpoints.
- **Web Audio & Speech Playback**: Integrated browser-native audio handling for responsive language pronunciation.
- **Modern Tailwind Component Architecture**: Developed reusable UI cards, tonal badges, and responsive layouts with Tailwind CSS utility classes.
