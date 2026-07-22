const input = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const button = document.getElementById("search-btn");
const error = document.getElementById("error");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const load = document.getElementById("load");

const getWeather = async () => {
  error.textContent = "Weather app";
  cityName.textContent = "--";
  const city = input.value.trim();
  if (city === "") {
    error.textContent = "Please enter a city name.";
    return;
  }
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    );

    if (!geoResponse.ok) {
      throw new Error("Geocoding request failed");
    }
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      error.textContent = "City not found.";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    cityName.textContent = name;
    load.classList.add("active");
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
    );
    if (!weatherResponse.ok) {
      throw new Error("Weather request failed");
    }
    const weatherData = await weatherResponse.json();

    const {
      temperature_2m,
      wind_speed_10m,
      relative_humidity_2m,
      weather_code,
    } = weatherData.current;
    load.classList.remove("active");
    switch (weather_code) {
      case 0:
        description.textContent = "☀️";
        break;
      case 1:
        description.textContent = "🌤️";
        break;
      case 2:
        description.textContent = "⛅";
        break;
      case 3:
        description.textContent = "☁️";
        break;
      case 45:
        description.textContent = "🌫️";
        break;
      case 61:
        description.textContent = "🌧️";
        break;
      case 71:
        description.textContent = "🌨️";
        break;
      default:
        description.textContent = "Unknown Weather";
    }
    temperature.textContent = `${temperature_2m}°C`;
    humidity.textContent = `${relative_humidity_2m}%`;
    wind.textContent = `${wind_speed_10m} km/h`;
  } catch (e) {
    console.error(e);
    error.textContent = "Something went wrong.";
  } finally {
  loading.style.display = "none";
}
};

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "Enter") {
    button.click();
  }
});

button.addEventListener("click", getWeather);
