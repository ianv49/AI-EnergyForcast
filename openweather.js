// openweather.js
function updateStatus(line1, line2) {
    const log = document.getElementById('statusMessages');
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false });
    const entry = document.createElement('p');
    entry.textContent = `[${timestamp}] ${line1} - ${line2}`;
    log.appendChild(entry);
    while (log.children.length > 50) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }
  
  async function refreshData(city = null) {
    updateStatus("🔄 Refreshing OpenWeather data...", "Preparing to load");
    const selectedCity = city || document.getElementById('citySelect').value;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=YOUR_OPENWEATHER_KEY`
      );
      const data = await res.json();
      if (!data?.list) throw new Error("Invalid API response");
  
      const windBody = document.querySelector('#windTable tbody');
      const solarBody = document.querySelector('#solarTable tbody');
      windBody.innerHTML = '';
      solarBody.innerHTML = '';
  
      for (let i = 0; i < Math.min(15, data.list.length); i++) {
        const entry = data.list[i];
        const dt = new Date(entry.dt * 1000).toLocaleString();
        windBody.innerHTML += `<tr><td>${dt}</td><td>${entry.wind?.speed ?? "N/A"}</td></tr>`;
        solarBody.innerHTML += `<tr><td>${dt}</td><td>${entry.main?.temp ?? "N/A"}</td><td>${entry.main?.humidity ?? "N/A"}</td><td>${entry.clouds?.all ?? "N/A"}</td></tr>`;
      }
  
      updateStatus("✅ OpenWeather data ready", "Tables updated successfully");
    } catch (err) {
      updateStatus("⚠️ Error occurred", err.message);
    }
  }
  
  function saveLogToFile() {
    let content = "=== OpenWeather Status Log ===\n";
    document.querySelectorAll('#statusMessages p').forEach(p => content += p.textContent + "\n");
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
  
