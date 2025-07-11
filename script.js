async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'YOUR_API_KEY'; // ← Replace with your own OpenWeatherMap API key

  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      document.getElementById('weatherResult').innerHTML = "City not found!";
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
    console.error(error);
    document.getElementById('weatherResult').innerHTML = "Error fetching weather data.";
  }
}
