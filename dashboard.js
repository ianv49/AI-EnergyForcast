// dashboard.js
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
  
  function refreshDashboard() {
    const city = document.getElementById('dashboardCity').value;
    updateStatus("🔄 Refreshing Dashboard...", `City: ${city}`);
    // Call both routines
    refreshData(city);      // defined in openweather.js
    refreshNASAData(city);  // defined in nasapower.js
  }
  
