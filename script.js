const API_KEY = "96976f4114314edbac851735260303"; // replace with your WeatherAPI key
const BASE_URL = "https://api.weatherapi.com/v1";

const state = {
    units: localStorage.getItem('weatherUnits') || 'C',
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

// ----- user / login helpers -----
const PROFILE_STORAGE_KEY = 'weatherUserProfile';

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function setStoredUser(user) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
}

function updateUserBadge() {
    const user = getStoredUser();
    const badge = document.getElementById('user-badge');
    const profileLink = document.getElementById('user-link');
    if (!badge) return;

    if (user?.username && user?.profile) {
        const nameEl = document.getElementById('user-name');
        const avatar = document.getElementById('user-avatar');
        if (nameEl) nameEl.textContent = user.username;
        if (avatar) avatar.src = user.profile;
        badge.classList.remove('hidden');
        if (profileLink) profileLink.classList.add('hidden');
    } else {
        badge.classList.add('hidden');
        if (profileLink) profileLink.classList.remove('hidden');
    }
}

function setupLogout() {
    const btn = document.getElementById('logout-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
        clearStoredUser();
        window.location.reload();
    });
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

function getWeatherIcon(conditionText) {
    const lower = (conditionText || '').toLowerCase();
    if (lower.includes('thunder') || lower.includes('storm')) return 'assets/icons/thunderstorm.png';
    if (lower.includes('snow') || lower.includes('sleet') || lower.includes('blizzard')) return 'assets/icons/snow.png';
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) return 'assets/icons/rain.png';
    if (lower.includes('mist') || lower.includes('fog')) return 'assets/icons/mist.png';
    if (lower.includes('haze')) return 'assets/icons/haze.png';
    if (lower.includes('cloud')) return 'assets/icons/cloud.png';
    if (lower.includes('clear') || lower.includes('sunny')) return 'assets/icons/sun.png';
    return 'assets/icons/icon.png';
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

function getRainIntensity(precipMm) {
    if (precipMm >= 7) return { title: 'Heavy', emoji: '🌧️' };
    if (precipMm >= 2) return { title: 'Moderate', emoji: '🌦️' };
    return { title: 'Light', emoji: '🌦' };
}

function formatHourLabel(hourStr, dateStr) {
    const date = parseTime(hourStr, dateStr);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getRainStatusText(current) {
    const intensity = getRainIntensity(current.precip_mm ?? 0);
    const isRaining = current.precip_mm > 0.2 || /rain|shower|drizzle/i.test(current.condition.text);
    if (isRaining) {
        return `${intensity.emoji} ${intensity.title} — ${current.precip_mm.toFixed(1)} mm`; 
    }
    return '☀ No rain currently';
}

function getUmbrellaMessage(forecastDay) {
    const rainChance = forecastDay.day.daily_chance_of_rain ?? 0;
    if (rainChance >= 70) return 'Carry an umbrella today ☔';
    if (rainChance >= 40) return 'There is a chance of rain — keep an umbrella handy';
    return 'Low chance of rain, safe to travel 🚶';
}

function buildRainHourlyRows(hours, dateStr) {
    return hours
        .slice(0, 24)
        .map((hour) => {
            const chance = typeof hour.chance_of_rain === 'number'
                ? hour.chance_of_rain
                : hour.will_it_rain ? 80 : 0;
            const intensity = getRainIntensity(hour.precip_mm ?? 0);
            const barWidth = Math.min(100, Math.max(0, chance));
            return `
                <div class="rain-hour-row">
                    <div class="rain-hour-time">${formatHourLabel(hour.time.split(' ')[1], dateStr)}</div>
                    <div class="rain-hour-percent">
                        <div class="rain-bar" style="width: ${barWidth}%;"></div>
                        <span>${chance}%</span>
                    </div>
                    <div class="rain-hour-intensity">${intensity.emoji} ${intensity.title}</div>
                </div>
            `;
        })
        .join('');
}

function findNextDryWindow(hours, dateStr) {
    const threshold = 20;
    const normalized = hours.slice(0, 24).map((hour) => {
        const chance = typeof hour.chance_of_rain === 'number'
            ? hour.chance_of_rain
            : hour.will_it_rain ? 80 : 0;
        return {
            time: formatHourLabel(hour.time.split(' ')[1], dateStr),
            dry: chance <= threshold,
        };
    });

    let start = null;
    let end = null;
    for (let i = 0; i < normalized.length; i++) {
        if (!start && normalized[i].dry) {
            start = normalized[i].time;
        }
        if (start && !normalized[i].dry) {
            end = normalized[i - 1].time;
            break;
        }
        if (i === normalized.length - 1 && start) {
            end = normalized[i].time;
        }
    }

    if (!start) return null;
    return start === end ? `${start}` : `${start} – ${end}`;
}

function updateRainDashboard(data) {
    const current = data.current;
    const day = data.forecast?.forecastday?.[0];
    if (!day) return;

    const statusEl = document.getElementById('rain-status-text');
    const umbrellaEl = document.getElementById('umbrella-message');
    const alertEl = document.getElementById('rain-alert-text');
    const hourlyEl = document.getElementById('rain-hourly-list');
    const dailyEl = document.getElementById('rain-daily-summary');

    if (statusEl) statusEl.textContent = getRainStatusText(current);
    if (umbrellaEl) umbrellaEl.textContent = getUmbrellaMessage(day);

    const locationEl = document.getElementById('rain-location');
    if (locationEl) {
        const locationName = `${data.location.name}${data.location.region ? ', ' + data.location.region : ''}, ${data.location.country}`;
        locationEl.textContent = locationName;
    }

    const updatedEl = document.getElementById('rain-updated');
    if (updatedEl) {
        updatedEl.textContent = `Updated: ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }

    const hours = day.hour || [];

    if (hourlyEl) {
        hourlyEl.innerHTML = buildRainHourlyRows(hours, day.date);
    }

    if (dailyEl) {
        const days = data.forecast.forecastday.slice(0, 5);
        dailyEl.innerHTML = days
            .map((d) => {
                const chance = d.day.daily_chance_of_rain ?? 0;
                const intensity = getRainIntensity(d.day.totalprecip_mm ?? 0);
                return `
                    <div class="rain-day-card">
                        <div class="rain-day-name">${new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div class="rain-day-percent">${chance}%</div>
                        <div class="rain-day-intensity">${intensity.emoji} ${intensity.title}</div>
                    </div>
                `;
            })
            .join('');
    }

    // Rain start / safe hours
    const firstRainHour = hours.find((h) => (h.chance_of_rain ?? 0) > 70);
    const safeWindow = findNextDryWindow(hours, day.date);

    const rainStartEl = document.getElementById('rain-start');
    if (rainStartEl) {
        if (firstRainHour) {
            const time = formatHourLabel(firstRainHour.time.split(' ')[1], day.date);
            rainStartEl.textContent = `Rain starts: ${time}`;
        } else {
            rainStartEl.textContent = 'Rain starts: No rain expected today';
        }
    }

    const safeEl = document.getElementById('rain-safe');
    if (safeEl) {
        if (safeWindow) {
            safeEl.textContent = `Safe hours: ${safeWindow}`;
        } else {
            safeEl.textContent = 'Safe hours: No clear window today';
        }
    }

    // Heavy rain alerts
    if (alertEl) {
        const heavy = hours.find((h) => (h.chance_of_rain ?? 0) > 80);
        if (heavy) {
            const time = formatHourLabel(heavy.time.split(' ')[1], day.date);
            alertEl.textContent = `⚠ Heavy rain expected at ${time} (${heavy.chance_of_rain}% chance)`;
        } else {
            alertEl.textContent = 'No heavy rain expected in the next 24 hours.';
        }
    }

    // rain animation when chance is high
    const maxChance = Math.max(...(hours.map((h) => (h.chance_of_rain ?? 0))));
    if (maxChance >= 60) {
        setBackground('rain');
    }
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


function updateCurrentWeather(data) {
    if (!data) return;
    state.lastData = data;

    if (!document.querySelector(".city-name")) return;

    const current = data.current;
    const location = data.location;

    document.querySelector(".city-name").textContent = `${location.name}, ${location.country}`;
    document.querySelector(".temp").textContent = formatTemp(current.temp_c, current.temp_f);
    const iconUrl = getWeatherIcon(current.condition.text);
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

    // rain page updates (if present)
    if (document.getElementById('rain-dashboard')) {
        updateRainDashboard(data);
    }
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
    const container = document.getElementById("forecast-5day");
    if (!container) return;

    const days = data.forecast?.forecastday;
    if (!Array.isArray(days) || !days.length) return;

    const today = new Date().toISOString().slice(0, 10);
    container.innerHTML = "";

    days.forEach(day => {
        const isToday = day.date === today;
        const card = document.createElement("div");
        card.className = `forecast-day card${isToday ? ' current' : ''}`;
        card.innerHTML = `
            <div class="date">${new Date(day.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>
            <img src="${getWeatherIcon(day.day.condition.text)}" alt="${day.day.condition.text}" />
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

    // Rain page: update rain-specific panels if present
    if (document.getElementById('rain-dashboard')) {
        try {
            updateRainDashboard(data);
        } catch (err) {
            console.error('updateRainDashboard failed', err);
        }
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
    setUnits(state.units);
    updateUserBadge();
    setupLogout();

    if (document.getElementById('current-card')) {
        getLocationWeather();
    }

    if (document.getElementById('rain-dashboard')) {
        // Use geolocation for rain page as well
        getLocationWeather();
    }
});

const searchBtn = document.getElementById('search-button');
if (searchBtn) searchBtn.addEventListener('click', searchCity);

const locationBtn = document.getElementById('location-button');
if (locationBtn) locationBtn.addEventListener('click', getLocationWeather);

const toggleUnitsBtn = document.getElementById('toggle-units');
if (toggleUnitsBtn) {
    toggleUnitsBtn.addEventListener('click', () => {
        setUnits(state.units === 'C' ? 'F' : 'C');
    });
}

const rainForecastBtn = document.getElementById('rain-forecast-button');
if (rainForecastBtn) {
    rainForecastBtn.addEventListener('click', () => {
        window.location.href = 'rain.html';
    });
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchCity();
    });
}
