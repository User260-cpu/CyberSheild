// Constants
const UNSAFE_SITES_URL = "https://raw.githubusercontent.com/User260-cpu/CyberSheild/refs/heads/main/unsafe-sites.json";

// Function to check password strength
const checkPasswordStrength = (password) => {
  if (password.length < 8) return "Weak";
  if (!/[A-Z]/.test(password)) return "Medium";
  if (!/[0-9]/.test(password)) return "Medium";
  if (!/[!@#$%^&*]/.test(password)) return "Strong";
  return "Very Strong";
};

// Function to check saved passwords
const checkSavedPasswords = async () => {
  if (!chrome.passwords) {
    console.warn("Password manager API is not available.");
    return;
  }

  try {
    const entries = await chrome.passwords.getAll();
    entries.forEach((entry) => {
      const strength = checkPasswordStrength(entry.password);
      if (strength === "Weak") {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "Weak Password Detected",
          message: `A weak password is saved for ${entry.url}. Please update it.`,
        });
      }
    });
  } catch (error) {
    console.error("Error checking passwords:", error);
  }
};

// Fetch and update unsafe sites
const updateUnsafeSites = async () => {
  try {
    const response = await fetch(UNSAFE_SITES_URL);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const unsafeSites = await response.json();

    // Store unsafe sites locally
    chrome.storage.local.set({ unsafeSites }, () => {
      console.log("Unsafe sites list updated successfully.");
    });
  } catch (error) {
    console.error("Error fetching unsafe sites:", error);
  }
};

// Redirect users from unsafe sites
const handleUnsafeNavigation = async (details) => {
  try {
    const { unsafeSites } = await chrome.storage.local.get("unsafeSites");
    if (!unsafeSites) return;

    const isUnsafe = unsafeSites.some((site) => details.url.includes(site));
    if (isUnsafe) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("warning.html") });
    }
  } catch (error) {
    console.error("Error handling unsafe navigation:", error);
  }
};

// Schedule periodic tasks
const scheduleTasks = () => {
  chrome.alarms.create("updateUnsafeSites", { periodInMinutes: 60 }); // Update every hour
  chrome.alarms.create("checkSavedPasswords", { periodInMinutes: 1440 }); // Daily password check
};

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateUnsafeSites") updateUnsafeSites();
  if (alarm.name === "checkSavedPasswords") checkSavedPasswords();
});

// Monitor web navigation
chrome.webNavigation.onCommitted.addListener(handleUnsafeNavigation);

// Initialize tasks on extension startup or installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("CyberShield installed. Initializing tasks...");
  updateUnsafeSites();
  scheduleTasks();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("CyberShield started. Updating resources...");
  updateUnsafeSites();
});
