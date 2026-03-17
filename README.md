# 🌦️ WeatherHub – Premium Glassmorphism Weather Dashboard

A fully‑functional, modern weather web application built with **HTML, CSS and Vanilla JavaScript**.  
Inspired by high‑end dashboard designs, WeatherHub uses a glassmorphism theme, rich animations and the WeatherAPI.com service to deliver a polished user experience on desktop and mobile.

---

## 🚀 Features (Updated March 17, 2026)

- **Live weather data** fetched from [WeatherAPI.com](https://www.weatherapi.com/)
- Search by city or ZIP code + **auto‑detect location** via GPS or IP
- **Current weather card** with temperature, icon, feels‑like, wind, humidity, and more
- **7‑day forecast** in a horizontal scroll‑able card row (today highlighted)
- **Unit toggle** (°C / °F)
- **Profile system**: log in with a username + avatar, persisted in localStorage
- **Rain Forecast page**: detailed rain probability, intensity, safe windows, and multi‑day rain summary
- **Air quality index** (AQI) and descriptor when available
- **Weather alerts** banner (severe weather notifications)
- Animated background transitions + **weather‑specific foreground effects** (rain, snow, clouds, lightning)
- Smooth loaders, hover animations, responsive layout (mobile friendly)
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
<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/f493b3c7-cb33-4d42-be3e-48d168a0b12f" />

