const API_KEY = "96976f4114314edbac851735260303"; // replace with your WeatherAPI key
const BASE_URL = "https://api.weatherapi.com/v1";

const state = {
    units: localStorage.getItem('weatherUnits') || 'C',
    favorites: JSON.parse(localStorage.getItem('weatherFavorites') || '[]'),
    lastData: null,
    map: null,
    mapMarker: null,
};

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

async function fetchWeather(query) {
    showLoader();
    const days = 7;
    let q;
    if (typeof query === 'object' && query !== null && 'lat' in query && 'lon' in query) {
        q = `${query.lat},${query.lon}`;
    } else if (typeof query === 'string' && query.trim()) {
        q = query.trim();
    } else {
        q = 'auto:ip';
    }

    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=yes&alerts=yes`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data;
    } catch (err) {
        console.error("Weather fetch error", err);
        return null;
    } finally {
        hideLoader();
    }
}

function formatHour(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatTemp(c, f) {
    return state.units === 'F' ? `${Math.round(f)}°` : `${Math.round(c)}°`;
}

function formatTempValue(c, f) {
    return state.units === 'F' ? f : c;
}

function formatWind(kph) {
    if (state.units === 'F') {
        const mph = kph * 0.621371;
        return `${Math.round(mph)} mph`;
    }
    return `${Math.round(kph)} kph`;
}

function setUnits(units) {
    state.units = units;
    localStorage.setItem('weatherUnits', units);
    const toggle = document.getElementById('toggle-units');
    toggle.classList.toggle('active', units === 'F');
    toggle.querySelector('span').textContent = units === 'F' ? '°F' : '°C';
    if (state.lastData) {
        displayWeather(state.lastData);
    }
}

function getComfortText(feelsLikeC, feelsLikeF) {
    const feels = formatTempValue(feelsLikeC, feelsLikeF);
    const feelsNum = state.units === 'F' ? feelsLikeF : feelsLikeC;
    let desc = 'Comfortable';
    if (feelsNum >= 30) desc = 'Hot';
    else if (feelsNum >= 25) desc = 'Warm';
    else if (feelsNum <= 0) desc = 'Freezing';
    else if (feelsNum <= 10) desc = 'Cold';
    return `Feels like ${feels} — ${desc}`;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function setBackground(conditionText) {
    const body = document.body;
    body.classList.remove('weather-clear', 'weather-cloud', 'weather-rain', 'weather-snow', 'weather-storm');
    const lower = conditionText.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) {
        body.classList.add('weather-rain');
        updateForegroundEffects('rain');
    } else if (lower.includes('snow') || lower.includes('sleet') || lower.includes('blizzard')) {
        body.classList.add('weather-snow');
        updateForegroundEffects('snow');
    } else if (lower.includes('cloud')) {
        body.classList.add('weather-cloud');
        updateForegroundEffects('cloud');
    } else if (lower.includes('storm') || lower.includes('thunder')) {
        body.classList.add('weather-storm');
        updateForegroundEffects('storm');
    } else {
        body.classList.add('weather-clear');
        updateForegroundEffects('clear');
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function updateForegroundEffects(type) {
    const overlay = document.getElementById('foreground-overlay');
    overlay.innerHTML = '';

    if (type === 'rain') {
        for (let i = 0; i < 20; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${randomBetween(0, 100)}vw`;
            drop.style.top = `${randomBetween(-20, 0)}vh`;
            drop.style.animationDelay = `${randomBetween(0, 0.9)}s`;
            drop.style.animationDuration = `${randomBetween(0.7, 1.2)}s`;
            overlay.appendChild(drop);
        }
    } else if (type === 'snow') {
        for (let i = 0; i < 18; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = `${randomBetween(0, 100)}vw`;
            flake.style.top = `${randomBetween(-20, 0)}vh`;
            flake.style.animationDelay = `${randomBetween(0, 8)}s`;
            flake.style.animationDuration = `${randomBetween(6, 12)}s`;
            flake.style.width = `${randomBetween(4, 10)}px`;
            flake.style.height = flake.style.width;
            overlay.appendChild(flake);
        }
    } else if (type === 'cloud') {
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud-icon';
            cloud.textContent = '☁️';
            cloud.style.top = `${randomBetween(10, 40)}vh`;
            cloud.style.left = `${randomBetween(-20, 10)}vw`;
            cloud.style.animationDuration = `${randomBetween(18, 30)}s`;
            cloud.style.animationDelay = `${randomBetween(0, 6)}s`;
            overlay.appendChild(cloud);
        }
    } else if (type === 'storm') {
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud-icon';
            cloud.textContent = '☁️';
            cloud.style.top = `${randomBetween(10, 40)}vh`;
            cloud.style.left = `${randomBetween(-20, 10)}vw`;
            cloud.style.animationDuration = `${randomBetween(18, 30)}s`;
            cloud.style.animationDelay = `${randomBetween(0, 6)}s`;
            overlay.appendChild(cloud);
        }
        for (let i = 0; i < 3; i++) {
            const bolt = document.createElement('div');
            bolt.className = 'lightning';
            bolt.style.left = `${randomBetween(10, 90)}vw`;
            bolt.style.top = `${randomBetween(5, 50)}vh`;
            bolt.style.animationDelay = `${randomBetween(0, 3)}s`;
            bolt.style.height = `${randomBetween(60, 110)}px`;
            overlay.appendChild(bolt);
        }
    } else {
        // clear: subtle sparkles
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'rain-drop';
            sparkle.style.width = '3px';
            sparkle.style.height = '3px';
            sparkle.style.background = 'rgba(255,255,255,0.9)';
            sparkle.style.left = `${randomBetween(0, 100)}vw`;
            sparkle.style.top = `${randomBetween(0, 100)}vh`;
            sparkle.style.animationDuration = `${randomBetween(1.8, 2.8)}s`;
            sparkle.style.animationDelay = `${randomBetween(0, 2)}s`;
            overlay.appendChild(sparkle);
        }
    }
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function parseTime(timeStr, dateStr) {
    // builds a date using local timezone by combining date and time text
    return new Date(`${dateStr} ${timeStr}`);
}

function updateSunProgress(forecastDay) {
    const sunrise = parseTime(forecastDay.astro.sunrise, forecastDay.date);
    const sunset = parseTime(forecastDay.astro.sunset, forecastDay.date);
    const now = new Date();
    const total = sunset - sunrise;
    const passed = now - sunrise;
    const pct = clamp(Math.round((passed / total) * 100), 0, 100);
    document.querySelector('#sunrise-graph .value').textContent = `${formatTime(sunrise)} → ${formatTime(sunset)}`;
    document.querySelector('.sun-fill').style.width = `${pct}%`;
}

function updateMap(lat, lon, label) {
    if (!state.map) {
        state.map = L.map('map', { zoomControl: false }).setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(state.map);
    }
    state.map.setView([lat, lon], 10);

    if (state.mapMarker) {
        state.map.removeLayer(state.mapMarker);
    }
    state.mapMarker = L.marker([lat, lon]).addTo(state.map).bindPopup(label).openPopup();
}


function loadFavorites() {
    const stored = JSON.parse(localStorage.getItem('weatherFavorites') || '[]');
    state.favorites = Array.isArray(stored) ? stored : [];
}

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
}

function promptFavorites() {
    loadFavorites();
    const choice = prompt(
        `Favorites:\n${state.favorites.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nType a number to load, or enter a new city to add:`
    );
    if (!choice) return;
    const index = parseInt(choice, 10);
    if (!isNaN(index) && index >= 1 && index <= state.favorites.length) {
        document.getElementById('search-input').value = state.favorites[index - 1];
        searchCity();
        return;
    }
    const trimmed = choice.trim();
    if (trimmed) {
        if (!state.favorites.includes(trimmed)) {
            state.favorites.push(trimmed);
            saveFavorites();
        }
        document.getElementById('search-input').value = trimmed;
        searchCity();
    }
}

function updateCurrentWeather(data) {
    if (!data) return;
    state.lastData = data;

    const current = data.current;
    const location = data.location;

    document.querySelector(".city-name").textContent = `${location.name}, ${location.country}`;
    document.querySelector(".temp").textContent = formatTemp(current.temp_c, current.temp_f);
    const iconUrl = `https:${current.condition.icon}`;
    document.querySelector(".condition-icon img").src = iconUrl;
    document.querySelector(".condition-icon img").alt = current.condition.text;
    document.querySelector(".high").textContent = formatTemp(data.forecast.forecastday[0].day.maxtemp_c, data.forecast.forecastday[0].day.maxtemp_f);
    document.querySelector(".low").textContent = formatTemp(data.forecast.forecastday[0].day.mintemp_c, data.forecast.forecastday[0].day.mintemp_f);
    document.querySelector(".precip").textContent = `${current.precip_mm} mm`;
    const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain ?? 0;
    document.querySelector(".rain-chance").textContent = `${rainChance}%`;
    document.querySelector(".wind").textContent = formatWind(current.wind_kph);
    document.querySelector(".humidity").textContent = `${current.humidity}%`;

    document.querySelector('.comfort-text').textContent = getComfortText(current.feelslike_c, current.feelslike_f);

    setBackground(current.condition.text);

    const alertBanner = document.getElementById('alert-banner');
    const alerts = data.alerts?.alert ?? [];
    if (alerts.length) {
        const alert = alerts[0];
        alertBanner.textContent = `${alert.headline || 'Weather Alert'}: ${alert.desc || alert.msg || ''}`;
        alertBanner.classList.remove('hidden');
    } else {
        alertBanner.classList.add('hidden');
    }

    const aqiIndex = data.current.air_quality?.['us-epa-index'] ?? data.current.air_quality?.['gb-defra-index'];
    const aqiText = aqiIndex ? `AQI ${aqiIndex}` : '--';
    const aqiDescMap = {
        1: 'Good',
        2: 'Moderate',
        3: 'Unhealthy for sensitive',
        4: 'Unhealthy',
        5: 'Very unhealthy',
        6: 'Hazardous',
    };
    document.querySelector('#aqi-card .value').textContent = aqiText;
    document.querySelector('#aqi-card .aqi-desc').textContent = aqiDescMap[aqiIndex] || 'N/A';

    // gauges
    setGauge("wind-gauge", current.wind_kph / 150 * 360, formatWind(current.wind_kph));
    setGauge("feelslike-gauge", (current.feelslike_c + 50) / 100 * 360, formatTemp(current.feelslike_c, current.feelslike_f));
    setGauge("humidity-gauge", current.humidity / 100 * 360, `${current.humidity}%`);

    // sunrise progress
    updateSunProgress(data.forecast.forecastday[0]);

    // map
    updateMap(location.lat, location.lon, `${location.name}, ${location.country}`);

    // summary
    updateSummary(data);
}

function setGauge(id, degrees, text) {
    const card = document.getElementById(id);
    card.querySelector(".value").textContent = text;
    let gauge = card.querySelector(".gauge");
    if (!gauge) {
        gauge = document.createElement("div");
        gauge.className = "gauge";
        card.appendChild(gauge);
    }
    gauge.style.background = `conic-gradient(#6c5ce7 ${degrees}deg, rgba(255,255,255,0.2) 0deg)`;
}

function updateForecast(data) {
    if (!data) return;
    const days = data.forecast?.forecastday;
    if (!Array.isArray(days) || !days.length) return;

    const today = new Date().toISOString().slice(0, 10);
    const container = document.getElementById("forecast-5day");
    container.innerHTML = "";

    days.forEach(day => {
        const isToday = day.date === today;
        const card = document.createElement("div");
        card.className = `forecast-day card${isToday ? ' current' : ''}`;
        card.innerHTML = `
            <div class="date">${new Date(day.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <div class="temp">${formatTemp(day.day.maxtemp_c, day.day.maxtemp_f)} / ${formatTemp(day.day.mintemp_c, day.day.mintemp_f)}</div>
            <div class="desc">${day.day.condition.text}</div>
            <div class="rain-chance">${day.day.daily_chance_of_rain ?? 0}% rain</div>
        `;
        container.appendChild(card);
    });
}

function updateSummary(data) {
    const summaryEl = document.getElementById('summary-text');
    if (!summaryEl) return;

    const days = data?.forecast?.forecastday;
    if (!Array.isArray(days) || !days.length) {
        summaryEl.textContent = 'Week summary unavailable (no forecast).';
        return;
    }

    const temps = days
        .map(d => ({
            max: d?.day?.maxtemp_c ?? d?.day?.maxtemp_f,
            min: d?.day?.mintemp_c ?? d?.day?.mintemp_f,
            rain: d?.day?.daily_chance_of_rain,
            date: d.date,
        }))
        .filter(d => typeof d.max === 'number' && typeof d.min === 'number');

    if (!temps.length) {
        summaryEl.textContent = 'Week summary unavailable (no temp data).';
        return;
    }

    const avgHigh = Math.round(temps.reduce((sum, t) => sum + t.max, 0) / temps.length);
    const avgLow = Math.round(temps.reduce((sum, t) => sum + t.min, 0) / temps.length);

    const rainDays = temps.filter(t => (t.rain ?? 0) >= 40);
    const rainText = rainDays.length
        ? `Rain likely on ${rainDays.map(t => new Date(t.date).toLocaleDateString('en-US',{weekday:'short'})).join(', ')}.`
        : 'Little chance of rain.';

    summaryEl.textContent = `Average highs around ${formatTemp(avgHigh, avgHigh)} and lows near ${formatTemp(avgLow, avgLow)}. ${rainText}`;
}


function displayWeather(data) {
    if (!data) return;

    const summaryEl = document.getElementById('summary-text');
    if (summaryEl) summaryEl.textContent = 'Updating summary...';

    try {
        updateCurrentWeather(data);
    } catch (err) {
        console.error('updateCurrentWeather failed', err);
    }

    try {
        updateForecast(data);
    } catch (err) {
        console.error('updateForecast failed', err);
    }

    try {
        updateSummary(data);
    } catch (err) {
        console.error('updateSummary failed', err);
        if (summaryEl) summaryEl.textContent = 'Unable to compute week summary.';
    }

}

async function searchCity() {
    const term = document.getElementById("search-input").value.trim();
    if (!term) return;
    const data = await fetchWeather(term);
    if (data) {
        displayWeather(data);
    } else {
        alert('City not found');
    }
}

async function getLocationWeather() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    showLoader();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await fetchWeather({ lat: latitude, lon: longitude });
            if (data) displayWeather(data);
        },
        async () => {
            // Fallback to IP-based location if permission denied or unavailable
            const data = await fetchWeather('auto:ip');
            if (data) displayWeather(data);
        },
        { timeout: 10000 }
    );
}

window.addEventListener('load', () => {
    loadFavorites();
    setUnits(state.units);
    getLocationWeather();
});

document.getElementById('search-button').addEventListener('click', searchCity);
document.getElementById('location-button').addEventListener('click', getLocationWeather);
document.getElementById('toggle-units').addEventListener('click', () => {
    setUnits(state.units === 'C' ? 'F' : 'C');
});
document.getElementById('favorites-button').addEventListener('click', promptFavorites);
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity();
});
