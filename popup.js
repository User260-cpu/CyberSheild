document.getElementById("scan-now").addEventListener("click", () => {
  chrome.storage.local.get("unsafeSites", (data) => {
    alert(`Currently monitoring ${data.unsafeSites.length} phishing URLs.`);
  });
});

document.getElementById("settings").addEventListener("click", () => {
  alert("Settings functionality coming soon!");
});
 