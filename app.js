/* eslint-disable no-undef */
const valueSearch = document.getElementById("valueSearch");
const cityElement = document.getElementById("city");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.querySelector(".description");
const cloudsElement = document.getElementById("clouds");
const humidityElement = document.getElementById("humidity");
const pressureElement = document.getElementById("pressure");
const form = document.querySelector("form");
const main = document.querySelector("main");
const themeToggle = document.getElementById("themeToggle");

function toggleLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

function triggerShakeEffect() {
  main.classList.add("error");
  setTimeout(() => main.classList.remove("error"), 1000);
}

function updateWeather(data) {
  cityElement.querySelector("figcaption").innerText = data.city;
  temperatureElement.querySelector("#temp_value").innerText =
    Math.round(data.temperature * 10) / 10;
  descriptionElement.innerText = data.description;
  cloudsElement.innerText = `${data.clouds}%`;
  humidityElement.innerText = `${data.humidity}%`;
  pressureElement.innerText = `${data.pressure} hPa`;
  const weatherIcon = temperatureElement.querySelector("img");
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.icon}@4x.png`;
}

function searchWeather() {
  const city = encodeURIComponent(valueSearch.value.trim());
  const url = `https://weatherappbackend-production.up.railway.app/weather?city=${city}`;

  toggleLoader(true);

  fetch(url)
    .then((response) =>
      response.ok ? response.json() : Promise.reject(response.statusText)
    )
    .then((data) => {
      console.log(data);
      toggleLoader(false);
      data.city ? updateWeather(data) : triggerShakeEffect();
      valueSearch.value = "";
    })
    .catch(() => {
      toggleLoader(false);
      triggerShakeEffect();
    });
}

function initApp() {
  valueSearch.value = "East Lansing";
  searchWeather();
}

function applyDarkModeFromStorage() {
  const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
  document.body.classList.toggle("dark-mode", darkModeEnabled);
  themeToggle.checked = darkModeEnabled;
}

document.addEventListener("DOMContentLoaded", () => {
  applyDarkModeFromStorage();
  themeToggle.addEventListener("change", () => {
    const darkModeEnabled = themeToggle.checked;
    document.body.classList.toggle("dark-mode", darkModeEnabled);
    localStorage.setItem("darkMode", darkModeEnabled ? "enabled" : "disabled");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (valueSearch.value.trim()) {
    searchWeather();
  }
});

initApp();
