document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('getWeatherBtn');

  button.addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();

    if (!city) {
      alert('Please enter a city name.');
      return;
    }

    // Redirect to weather.html with city as a query parameter
    window.location.href = `weather.html?city=${encodeURIComponent(city)}`;
  });
});
// This script handles the button click event to redirect to the weather page
// with the city name as a query parameter.