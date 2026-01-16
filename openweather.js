// ===============================
// API KEY (from big file)
// ===============================
const openWeatherKey = '0723d71a05e58ae3f7fc91e39a901e6b';

// ===============================
// STATUS RIBBON FUNCTIONS
// ===============================
function updateStatus(line1, line2) {
  const log = document.getElementById('statusMessages');
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', { hour12: false });

  const entry = document.createElement('p');
  entry.textContent = `[${timestamp}] ${line1} - ${line2}`;
  log.appendChild(entry);

  // Keep log manageable
  while (log.children.length > 50) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}

// ===============================
// OPENWEATHER REFRESH
// ===============================
async function refreshData(city = null) {
  updateStatus("🔄 Refreshing OpenWeather data...", "Preparing to load");

  // Default to Manila if no city passed
  const selectedCity = city || document.getElementById('citySelect').value || "Manila";
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${"Manila"}&units=metric&appid=${"0723d71a05e58ae3f7fc91e39a901e6"}`
    );
    const data = await res.json();

    if (!data?.list) throw new Error("Invalid API response");

    const windBody = document.querySelector('#windTable tbody');
    const solarBody = document.querySelector('#solarTable tbody');
    windBody.innerHTML = '';
    solarBody.innerHTML = '';

    // Show last 15 forecast entries
    for (let i = 0; i < Math.min(15, data.list.length); i++) {
      const entry = data.list[i];
      const dt = new Date(entry.dt * 1000).toLocaleString();

      const windSpeed = entry.wind?.speed ?? "N/A";
      const temp = entry.main?.temp ?? "N/A";
      const humidity = entry.main?.humidity ?? "N/A";
      const cloud = entry.clouds?.all ?? "N/A";

      windBody.innerHTML += `<tr><td>${dt}</td><td>${windSpeed}</td></tr>`;
      solarBody.innerHTML += `<tr><td>${dt}</td><td>${temp}</td><td>${humidity}</td><td>${cloud}</td></tr>`;
    }

    updateStatus("✅ OpenWeather data ready", "Tables updated successfully");
  } catch (err) {
    updateStatus("⚠️ Error occurred", err.message);
  }
}

// ===============================
// SAVE LOG TO FILE
// ===============================
function saveLogToFile() {
  let content = "=== OpenWeather Status Log ===\n";
  document.querySelectorAll('#statusMessages p').forEach(p => {
    content += p.textContent + "\n";
  });

  content += "\n=== Wind Data ===\n";
  document.querySelectorAll('#windTable tbody tr').forEach(row => {
    content += Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(" | ") + "\n";
  });

  content += "\n=== Solar Data ===\n";
  document.querySelectorAll('#solarTable tbody tr').forEach(row => {
    content += Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(" | ") + "\n";
  });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "openweather_log.txt";
  a.click();
  URL.revokeObjectURL(url);
}
