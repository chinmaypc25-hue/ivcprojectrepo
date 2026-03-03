# 🌦️ WeatherHub – Premium Glassmorphism Weather Dashboard

A fully‑functional, modern weather web application built with **HTML, CSS and Vanilla JavaScript**.  
Inspired by high‑end dashboard designs, WeatherHub uses a glassmorphism theme, rich animations and the WeatherAPI.com service to deliver a polished user experience on desktop and mobile.

---

## 🚀 Features

- **Live weather data** fetched from [WeatherAPI.com](https://www.weatherapi.com/)
- Search by city or ZIP code; auto‑detect location via `auto:ip`
- Current conditions display with large temperature, icon and details
- 5‑day forecast in a horizontal scroll‑able card row
- Hourly forecast pills with time, icon, chance of rain and temperature
- Floating “small” cards showing wind, feels‑like, humidity and sunrise
- Glass‑style social buttons and URL badge
- Animated purple gradient background with bubbles & wave effects
- Smooth loaders, hover animations and responsive layout
- Full error handling and loading indicators
- No frameworks or dependencies – just plain web technologies

---

## 🎨 Design Highlights

- **Theme**: Deep purple gradient (#4e3a8c → #6c5ce7) with radial glow  
- **Glassmorphism**: translucent cards (`rgba(255,255,255,0.08)`), `backdrop-filter: blur(20px)`, rounded corners and soft shadows  
- **Animations**: floating cards, spinning loader, bubbling background, moving waves  
- **Typography**: *Poppins* font; Font Awesome for icons  
- **Responsive**: stacks vertically on small viewports; scrollable rows hide native scrollbars

---

## 📁 Project Structure

```
weather-app/
├── index.html
├── style.css
├── script.js
└── assets/
    └── icons/          ← optional custom icon folder
```

---

## 🛠️ Getting Started

1. **Clone** or download the repository:

   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```

2. **Obtain an API key** from [WeatherAPI.com](https://www.weatherapi.com/).

3. **Edit `script.js`** and replace the placeholder:

   ```js
   const API_KEY = "YOUR_API_KEY_HERE";
   ```

4. **Open `index.html`** in your browser (no build step required).

5. Search for a city or let the app auto‑detect your location.

---

## 🧩 How the Code Works

- `fetchWeather(city)` builds the request URL and handles errors.
- `updateCurrentWeather`, `updateForecast` and `updateHourly` populate DOM elements.
- `setGauge()` draws circular indicators using `conic-gradient`.
- Event listeners hook up the search button and Enter key.
- A loader overlay appears during API calls.
- On page load, the user’s location is requested via `q=auto:ip`.

---

## 📦 Dependencies

None. All resources are loaded via CDN (Google Fonts, Font Awesome).

---

## 📱 Responsive Behavior

- Large screens: cards arranged horizontally/centered.
- Small screens: elements stack, search input shrinks, scroll rows wrap.

---

## 💡 Customization Tips

- Replace or add icons in `assets/icons/` and modify JS if needed.
- Adjust colors, animation speeds or fonts by editing `style.css`.
- Extend forecast days by changing the `days` parameter in `fetchWeather`.

---

## 📝 License

Feel free to use or adapt this dashboard for personal or commercial projects.

---

Enjoy building with a dashboard that feels premium and looks like it came from a modern SaaS design system!

## Demo
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/47699a09-ed05-4fe8-af28-59cad6dcf3d4" />
