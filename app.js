/* eslint-disable no-undef */
let valueSearch = document.getElementById("valueSearch");
let cityElement = document.getElementById("city");
let temperatureElement = document.getElementById("temperature");
let descriptionElement = document.querySelector(".description");
let cloudsElement = document.getElementById("clouds");
let humidityElement = document.getElementById("humidity");
let pressureElement = document.getElementById("pressure");
let form = document.querySelector("form");
let main = document.querySelector("main");

function toggleLoader(show) {
  const loader = document.getElementById("loader");
  loader.style.display = show ? "block" : "none";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (valueSearch.value !== "") {
    toggleLoader(true);
    searchWeather();
  }
});

const searchWeather = () => {
  const city = valueSearch.value.trim(); // Trim any leading/trailing whitespace
  const encodedCity = encodeURIComponent(city); // Properly encode the city name
  const url = `http://127.0.0.1:8080/weather?city=${encodedCity}`;

  toggleLoader(true);
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        // Read the error message from the response
        return response.text().then((text) => {
          throw new Error(text || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      toggleLoader(false);
      if (data.city) {
        cityElement.querySelector("figcaption").innerText = data.city;
        temperatureElement.querySelector("#temp_value").innerText =
          Math.round(data.temperature * 10) / 10; // Round to 1 decimal place
        descriptionElement.innerText = data.description;
        cloudsElement.innerText = data.clouds + "%";
        humidityElement.innerText = data.humidity + "%";
        pressureElement.innerText = data.pressure + " hPa";
      } else {
        main.classList.add("error");
        setTimeout(() => main.classList.remove("error"), 1000);
      }
      valueSearch.value = "";
    })
    .catch((error) => {
      toggleLoader(false);
      console.error("Fetch error:", error);
      main.classList.add("error");
      setTimeout(() => main.classList.remove("error"), 1000);
      alert(`Error: ${error.message}`);
    });
};

const initApp = () => {
  valueSearch.value = "East Lansing";
  searchWeather();
};
initApp();

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

document.addEventListener("DOMContentLoaded", () => {
  // Add dark mode class to the body by default
  document.body.classList.add("dark-mode");

  // Set the toggle to checked by default
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.checked = true;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  // Check localStorage for saved theme preference
  const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
  if (darkModeEnabled) {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    if (themeToggle) themeToggle.checked = false;
  }

  // Listen for toggle changes
  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }
});
