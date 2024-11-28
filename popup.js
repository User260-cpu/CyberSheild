document.getElementById("manualScanPasswords").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "checkSavedPasswords" });
});

document.getElementById("manualUpdateSites").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "updateUnsafeSites" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "notification") {
    alert(message.content);
  }
});
