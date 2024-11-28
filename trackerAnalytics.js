function logEvent(eventType) {
    chrome.storage.local.get(["analytics"], function (result) {
      const analytics = result.analytics || {};
      analytics[eventType] = (analytics[eventType] || 0) + 1;
      chrome.storage.local.set({ analytics });
    });
  }
  
  function getAnalytics(callback) {
    chrome.storage.local.get(["analytics"], function (result) {
      callback(result.analytics || {});
    });
  }
  