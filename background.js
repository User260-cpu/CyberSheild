// Function to check password strength
function checkPasswordStrength(password) {
  if (password.length < 8) return "Weak";
  if (!/[A-Z]/.test(password)) return "Medium";
  if (!/[0-9]/.test(password)) return "Medium";
  if (!/[!@#$%^&*]/.test(password)) return "Strong";
  return "Very Strong";
}

// Automatically check saved passwords
async function checkSavedPasswords() {
  try {
    const passwords = await chrome.passwordsPrivate.getSavedPasswordList(); // Modern API
    passwords.forEach((entry) => {
      const strength = checkPasswordStrength(entry.password);
      if (strength === "Weak") {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "Weak Password Detected",
          message: `A weak password is saved for ${entry.url}. Consider updating it.`,
        });
      }
    });
  } catch (error) {
    console.error("Error checking saved passwords:", error.message);
  }
}

// Fetch the latest unsafe site list dynamically
async function updateUnsafeSites() {
  const unsafeSitesUrl =
    "https://raw.githubusercontent.com/User260-cpu/CyberSheild/refs/heads/main/unsafe-sites.json";
  try {
    const response = await fetch(unsafeSitesUrl);
    if (!response.ok) throw new Error("Failed to fetch unsafe sites.");
    const data = await response.json();
    chrome.storage.local.set({ unsafeSites: data });
    console.log("Unsafe site list updated.");
  } catch (error) {
    console.error("Error fetching unsafe sites:", error);
  }
}

// Redirect users from unsafe sites
function handleUnsafeNavigation(details) {
  chrome.storage.local.get("unsafeSites", (result) => {
    const unsafeSites = result.unsafeSites || [];
    if (unsafeSites.some((site) => details.url.includes(site))) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("warning.html") });
    }
  });
}

// Schedule periodic tasks using alarms
chrome.alarms.create("updateUnsafeSites", { periodInMinutes: 60 });
chrome.alarms.create("checkSavedPasswords", { periodInMinutes: 1440 }); // Daily

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateUnsafeSites") updateUnsafeSites();
  if (alarm.name === "checkSavedPasswords") checkSavedPasswords();
});

// Monitor navigation for unsafe links
chrome.webNavigation.onCommitted.addListener(handleUnsafeNavigation);

// Initialize tasks on installation or startup
chrome.runtime.onInstalled.addListener(() => {
  updateUnsafeSites();
  checkSavedPasswords();
});
chrome.runtime.onStartup.addListener(() => {
  updateUnsafeSites();
  checkSavedPasswords();
});
