# Zero Two - Interactive 2D Avatar

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=ff6b9d&height=300&section=header&text=Zero%20Two&fontSize=90&animation=fadeIn&fontAlignY=35" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Canvas-2048x4096-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/FPS-60-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Expressions-3-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=flat-square" />
</p>

## ✨ Features

- 🎯 **Eye Tracking** - Pupils follow your cursor in real-time
- 👁️ **Blinking System** - Natural blinking at randomized intervals (2-5 seconds)
- 😊 **Expressions** - Click to cycle through neutral, happy, and annoyed states
- 💫 **Idle Animation** - Subtle body sway when idle
- 🚀 **60 FPS** - Smooth rendering performance

## 🛠️ Tech Stack

- HTML5 Canvas
- Vanilla JavaScript (ES6 Modules)
- CSS3
- No frameworks required

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- A local web server (required for ES modules)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kushalchalla981-tech/zerotwo.git
cd zerotwo
```

2. Start a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Open your browser:
```
http://localhost:8000
```

## 🎮 Controls

| Action | Result |
|--------|--------|
| Move mouse | Eyes track cursor |
| Click | Cycle expressions |
| Idle (3+ seconds) | Body starts swaying |

## 📁 Project Structure

```
zerotwo/
├── index.html              # Entry point
├── assets/                 # Character assets
│   ├── head/
│   ├── eyes/
│   ├── pupils/
│   ├── eyelids/
│   ├── eyebrows/
│   ├── mouth/
│   ├── hair/
│   ├── horns/
│   ├── body/
│   ├── arms/
│   └── legs/
└── src/
    ├── main.js             # App initialization
    ├── config/             # Layer & expression configs
    ├── engines/            # Rendering & animation
    ├── handlers/           # Input handling
    ├── managers/           # State & asset management
    ├── utils/              # FPS monitoring
    └── styles/             # CSS styling
```

## 🎨 Design Notes

- Character is an **inspired variant** of Zero Two, not an exact copy
- All assets are layered PNGs for flexibility
- Canvas resolution: 2048×4096px
- Supports both mouse and touch input

## 📜 License

MIT License - Feel free to use this for learning and personal projects!

---

<p align="center">
  Made with ❤️ | Inspired by Zero Two
</p>
