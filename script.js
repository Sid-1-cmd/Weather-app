async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'f74284c88ae61096f2d01c67d4fa82b3'; // TEST KEY

  const proxy = 'https://corsproxy.io/?';
  const url = `${proxy}https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  document.getElementById('weatherResult').innerHTML = 'Loading...';

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.cod !== 200 || !data.main || !data.weather) {
      document.getElementById('weatherResult').innerHTML = `❌ Error: ${data.message || 'Invalid data received.'}`;
      return;
    }

    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const desc = data.weather[0].description;

    document.getElementById('weatherResult').innerHTML = `
      <strong>${city.toUpperCase()}</strong><br>
      🌡️ Temperature: ${temp}°C <br>
      💧 Humidity: ${humidity}% <br>
      🌥️ Condition: ${desc}
    `;
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById('weatherResult').innerHTML = "❌ Error fetching weather data.";
  }
}

// Wait until DOM is fully loaded before attaching event
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
});
