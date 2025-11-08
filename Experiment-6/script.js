const apiKey = "f37f524aed2268c037d60b8364bb0ec7"; // Replace with your API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const errorMsg = document.getElementById("error");

// Fetch weather data using async/await
async function getWeather(city) {
  try {
    errorMsg.textContent = "";
    weatherResult.innerHTML = "Loading...";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found!");
    }

    const data = await response.json();

    // Display weather info
    weatherResult.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Condition: ${data.weather[0].description}</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    // Save last searched city in localStorage
    localStorage.setItem("lastCity", city);
  } catch (error) {
    weatherResult.innerHTML = "";
    errorMsg.textContent = error.message;
  }
}

// Button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    errorMsg.textContent = "Please enter a city name.";
  }
});

// Load last searched city on page reload
window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  }
});
