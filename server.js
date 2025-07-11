import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Your OpenWeatherMap API key
const API_KEY = '8f4966820eec3e5fe2e1284d7d2a40b3';

// Route for current weather
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.json({
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      city: data.name
    });
  } catch (error) {
    console.error('API fetch failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔥 New route: Hourly rainfall forecast
app.get('/forecast', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(forecastURL);
    const forecastData = await response.json();

    if (forecastData.cod !== "200") {
      return res.status(500).json({ error: "Error retrieving forecast data" });
    }

    const rainfallData = forecastData.list.map(item => ({
      time: item.dt_txt,
      pop: item.pop * 100, // Convert to %
    }));

    res.json({
      city: forecastData.city.name,
      rainfall: rainfallData.slice(0, 8) // Next 24 hrs (3 hr interval)
    });

  } catch (err) {
    console.error("Forecast fetch error:", err);
    res.status(500).json({ error: "Server error in forecast" });
  }
});

app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
// File: server.js