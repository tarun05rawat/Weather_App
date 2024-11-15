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
  const city = valueSearch.value.trim();
  const encodedCity = encodeURIComponent(city);
  const url = `https://weatherappbackend-production.up.railway.app/weather?city=${encodedCity}`;

  toggleLoader(true);
  fetch(url)
    .then((response) => {
      if (!response.ok) {
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
          Math.round(data.temperature * 10) / 10;
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
  document.body.classList.add("dark-mode");

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.checked = true;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
  if (darkModeEnabled) {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    if (themeToggle) themeToggle.checked = false;
  }

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
