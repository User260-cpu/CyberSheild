// Function to fetch phishing URLs from OpenPhish
function fetchOpenPhishData() {
  const openPhishURL = "https://openphish.com/feed.txt";

  fetch(openPhishURL)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch OpenPhish data.");
      return response.text();
    })
    .then((data) => {
      const phishingURLs = data.split("\n").filter((url) => url.trim() !== "");
      chrome.storage.local.set({ unsafeSites: phishingURLs });
      console.log("OpenPhish data updated.");
    })
    .catch((error) => {
      console.error("Error fetching OpenPhish data:", error);
    });
}

// Redirect users from unsafe sites
function checkIfUnsafeURL(details) {
  chrome.storage.local.get("unsafeSites", (result) => {
    const unsafeSites = result.unsafeSites || [];
    if (unsafeSites.some((url) => details.url.includes(url))) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("warning.html") });
    }
  });
}

// Monitor navigation for unsafe links
chrome.webNavigation.onCommitted.addListener(checkIfUnsafeURL);

// Schedule periodic updates of OpenPhish data
chrome.alarms.create("updateOpenPhish", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateOpenPhish") {
    fetchOpenPhishData();
  }
});

// Fetch phishing data on installation/startup
chrome.runtime.onInstalled.addListener(() => fetchOpenPhishData());
chrome.runtime.onStartup.addListener(() => fetchOpenPhishData());
