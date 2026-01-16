// nasapower.js
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
  
  async function refreshNASAData(city = null) {
    updateStatus("🚀 Fetching NASA POWER data...", "Preparing to load");
    const cityCoords = {
      "Manila": { lat: 14.6, lon: 120.98 },
      "Tokyo": { lat: 35.7, lon: 139.7 },
      "Sydney": { lat: -33.9, lon: 151.2 }
    };
    const selectedCity = city || document.getElementById('nasaCitySelect').value;
    const { lat, lon } = cityCoords[selectedCity];
  
    try {
      const today = new Date();
      const end = today.toISOString().slice(0,10).replace(/-/g,"");
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 2);
      const start = startDate.toISOString().slice(0,10).replace(/-/g,"");
  
      const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=T2M,WS2M,RH2M,ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data?.properties?.parameter) throw new Error("Invalid NASA POWER response");
  
      const times = Object.keys(data.properties.parameter.T2M);
      const temps = Object.values(data.properties.parameter.T2M);
      const winds = Object.values(data.properties.parameter.WS2M);
      const humids = Object.values(data.properties.parameter.RH2M);
      const solar = Object.values(data.properties.parameter.ALLSKY_SFC_SW_DWN);
  
      const windBody = document.querySelector('#nasaWindTable tbody');
      const solarBody = document.querySelector('#nasaSolarTable tbody');
      windBody.innerHTML = '';
      solarBody.innerHTML = '';
  
      times.slice(-15).forEach((t, i) => {
        windBody.innerHTML += `<tr><td>${t}</td><td>${winds.slice(-15)[i]}</td></tr>`;
        solarBody.innerHTML += `<tr><td>${t}</td><td>${temps.slice(-15)[i]}</td><td>${humids.slice(-15)[i]}</td><td>${solar.slice(-15)[i]}</td></tr>`;
      });
  
      updateStatus("✅ NASA POWER data ready", "Latest 15 hourly rows loaded");
    } catch (err) {
      updateStatus("⚠️ NASA POWER error", err.message);
    }
  }
  
  function saveLogToFile() {
    let content = "=== NASA POWER Status Log ===\n";
    document.querySelectorAll('#statusMessages p').forEach(p => content += p.textContent + "\n");
    content += "\n=== Wind Data ===\n";
    document.querySelectorAll('#nasaWindTable tbody tr').forEach(row => {
      content += Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(" | ") + "\n";
    });
    content += "\n=== Solar Data ===\n";
    document.querySelectorAll('#nasaSolarTable tbody tr').forEach(row => {
      content += Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(" | ") + "\n";
    });
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nasapower_log.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  
