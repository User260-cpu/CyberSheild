// Server URL for your local Node.js server to handle VirusTotal requests
const serverUrl = 'http://localhost:3000/check-url'; // Your local server URL

// Function to check URL using VirusTotal
function checkURLWithVirusTotal(url) {
  fetch(`${serverUrl}?url=${encodeURIComponent(url)}`)
    .then(response => response.json())
    .then(data => {
      if (data.data.attributes.last_analysis_stats.malicious > 0) {
        alert(`The URL ${url} is flagged as malicious by VirusTotal.`);
      }
    })
    .catch(error => console.error('Error checking VirusTotal:', error));
}

// Function to fetch phishing data from OpenPhish and check URLs
function fetchOpenPhishData() {
  fetch("https://openphish.com/feed.txt")
    .then(response => response.text())
    .then(data => {
      const phishUrls = data.split("\n");
      phishUrls.forEach(url => checkURLWithVirusTotal(url));
    })
    .catch(error => console.error("Error fetching OpenPhish data:", error));
}

// Automated URL checking using webNavigation
chrome.webNavigation.onCommitted.addListener((details) => {
  const url = details.url;
  checkURLWithVirusTotal(url);
});

// Automatically check unsafe URLs from OpenPhish feed every hour
chrome.alarms.create("checkOpenPhishData", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkOpenPhishData") {
    fetchOpenPhishData();
  }
});

// Function to check password strength
function checkPasswordStrength(password) {
  if (password.length < 8) return "Weak";
  if (!/[A-Z]/.test(password)) return "Medium";
  if (!/[0-9]/.test(password)) return "Medium";
  if (!/[!@#$%^&*]/.test(password)) return "Strong";
  return "Very Strong";
}

// Function to evaluate saved passwords
function evaluateSavedPasswords() {
  // Simulating retrieval of saved passwords from a password manager
  const savedPasswords = [
    { url: "https://example.com", password: "12345" },
    { url: "https://secure-site.com", password: "Str0ngP@ss" },
    { url: "https://bank.com", password: "Password123" }
  ];

  savedPasswords.forEach(entry => {
    const strength = checkPasswordStrength(entry.password);
    console.log(`Password strength for ${entry.url}: ${strength}`);
  });
}

// Run password check periodically
chrome.alarms.create("checkSavedPasswords", { periodInMinutes: 1440 }); // Daily check for saved passwords
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkSavedPasswords") {
    evaluateSavedPasswords();
  }
});
