const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city");

const weatherDisplay = document.getElementById("weatherDisplay");
const container = document.getElementById("weatherContainer");
const figure = document.getElementById("figure");

const weatherEmojis = {
  "clear": "☀️",
  "clouds": "☁️",
  "rain": "🌧️",
  "drizzle": "🌦️",
  "thunderstorm": "⛈️",
  "snow": "❄️",
  "mist": "🌫️",
};

const humanFigures = {
  "clear": "😎",
  "clouds": "🧥",
  "rain": "☔",
  "drizzle": "🌂",
  "thunderstorm": "⚡",
  "snow": "🧤",
  "mist": "😷"
};

function getWeatherType(description) {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) return "clear";
  if (desc.includes("cloud")) return "clouds";
  if (desc.includes("rain")) return "rain";
  if (desc.includes("drizzle")) return "drizzle";
  if (desc.includes("thunderstorm")) return "thunderstorm";
  if (desc.includes("snow")) return "snow";
  if (desc.includes("mist") || desc.includes("fog")) return "mist";
  return "clear";
}

function updateBackground(type) {
  const gradients = {
    clear: "linear-gradient(to top, #fceabb, #f8b500)",
    clouds: "linear-gradient(to top, #d7d2cc, #304352)",
    rain: "linear-gradient(to top, #bdc3c7, #2c3e50)",
    drizzle: "linear-gradient(to top, #e0eafc, #cfdef3)",
    thunderstorm: "linear-gradient(to top, #434343, #000000)",
    snow: "linear-gradient(to top, #e6dada, #274046)",
    mist: "linear-gradient(to top, #abbaab, #ffffff)"
  };

  document.body.style.background = gradients[type] || gradients.clear;
}

async function fetchWeather() {
  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    const { temp, humidity, description } = data;
    const type = getWeatherType(description);

    const emoji = weatherEmojis[type] || "🌍";
    const human = humanFigures[type] || "🙂";

    updateBackground(type);
    figure.textContent = human;

    weatherDisplay.innerHTML = `
      <h2>${city.toUpperCase()}</h2>
      <div class="weather-icon">${emoji}</div>
      <p>🌡️ Temperature: ${temp}°C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌥️ Condition: ${description}</p>
    `;
  } catch (error) {
    weatherDisplay.innerHTML = "❌ Failed to fetch weather data.";
    console.error(error);
  }
}

async function fetchRainForecast() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=8f4966820eec3e5fe2e1284d7d2a40b3&units=metric`);
    const data = await res.json();

    const labels = [];
    const rainChances = [];

    data.list.slice(0, 8).forEach(entry => {
      const time = new Date(entry.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const rain = entry.pop * 100; // Probability of precipitation
      labels.push(time);
      rainChances.push(rain);
    });

    const ctx = document.getElementById('rainChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Rain Probability (%)',
          data: rainChances,
          backgroundColor: 'rgba(30, 144, 255, 0.2)',
          borderColor: '#1e90ff',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#007BFF'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

  } catch (err) {
    console.error("Rain forecast error:", err);
  }
}

fetchWeather();
fetchRainForecast();
