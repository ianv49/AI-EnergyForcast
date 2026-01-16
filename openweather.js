// ===============================
// API KEY
// ===============================
const openWeatherKey = '0723d71a05e58ae3f7fc91e39a901e6b';

// ===============================
// LOAD DATA FOR MANILA
// ===============================
async function loadManilaData() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Manila&units=metric&appid=${openWeatherKey}`
    );
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data?.list || !Array.isArray(data.list)) throw new Error("Invalid API response");

    const windBody = document.querySelector('#windTable tbody');
    const solarBody = document.querySelector('#solarTable tbody');
    windBody.innerHTML = '';
    solarBody.innerHTML = '';

    // Take latest 15 entries
    data.list.slice(0, 15).forEach(entry => {
      const dt = new Date(entry.dt * 1000).toLocaleString();
      const windSpeed = entry.wind?.speed ?? "N/A";
      const temp = entry.main?.temp ?? "N/A";
      const humidity = entry.main?.humidity ?? "N/A";
      const cloud = entry.clouds?.all ?? "N/A";

      windBody.innerHTML += `<tr><td>${dt}</td><td>${windSpeed}</td></tr>`;
      solarBody.innerHTML += `<tr><td>${dt}</td><td>${temp}</td><td>${humidity}</td><td>${cloud}</td></tr>`;
    });
  } catch (err) {
    console.error("Error loading OpenWeather data:", err);
  }
}

// ===============================
// AUTO-LOAD ON PAGE OPEN
// ===============================
document.addEventListener("DOMContentLoaded", loadManilaData);
