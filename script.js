const API_KEY = "96976f4114314edbac851735260303"; // replace with your WeatherAPI key
const BASE_URL = "https://api.weatherapi.com/v1";

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

async function fetchWeather(city) {
    showLoader();
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;
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

function updateCurrentWeather(data) {
    if (!data) return;
    const current = data.current;
    const location = data.location;
    document.querySelector(".city-name").textContent = `${location.name}, ${location.country}`;
    document.querySelector(".temp").textContent = `${Math.round(current.temp_c)}°`;
    const iconUrl = `https:${current.condition.icon}`;
    document.querySelector(".condition-icon img").src = iconUrl;
    document.querySelector(".condition-icon img").alt = current.condition.text;
    document.querySelector(".high").textContent = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°`;
    document.querySelector(".low").textContent = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°`;
    document.querySelector(".precip").textContent = `${current.precip_mm} mm`;
    document.querySelector(".wind").textContent = `${current.wind_kph} kph`;
    document.querySelector(".humidity").textContent = `${current.humidity}%`;

    // gauges
    setGauge("wind-gauge", current.wind_kph / 150 * 360, `${current.wind_kph} kph`);
    setGauge("feelslike-gauge", (current.feelslike_c + 50) / 100 * 360, `${Math.round(current.feelslike_c)}°`);
    setGauge("humidity-gauge", current.humidity / 100 * 360, `${current.humidity}%`);

    // sunrise graph simple text
    document.querySelector("#sunrise-graph .value").textContent = data.forecast.forecastday[0].astro.sunrise;
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
    container.innerHTML = "";
    data.forecast.forecastday.forEach(day => {
        const card = document.createElement("div");
        card.className = "forecast-day card";
        card.innerHTML = `
            <div class="date">${new Date(day.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <div class="temp">${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°</div>
            <div class="desc">${day.day.condition.text}</div>
        `;
        container.appendChild(card);
    });
}

function updateHourly(data) {
    if (!data) return;
    const row = document.getElementById("hourly-row");
    row.innerHTML = "";
    const hours = data.forecast.forecastday[0].hour;
    hours.forEach(h => {
        const card = document.createElement("div");
        card.className = "hourly-card";
        card.innerHTML = `
            <div class="time">${new Date(h.time).getHours()}:00</div>
            <img src="https:${h.condition.icon}" alt="${h.condition.text}" />
            <div class="rain">${h.chance_of_rain}%</div>
            <div class="temp">${Math.round(h.temp_c)}°</div>
        `;
        row.appendChild(card);
    });
}

async function searchCity() {
    const term = document.getElementById("search-input").value.trim();
    if (!term) return;
    const data = await fetchWeather(term);
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
        updateHourly(data);
    } else {
        alert('City not found');
    }
}

window.addEventListener('load', async () => {
    const data = await fetchWeather('auto:ip');
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
        updateHourly(data);
    }
});
document.getElementById('search-button').addEventListener('click', searchCity);
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity();
});
