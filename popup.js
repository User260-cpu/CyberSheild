document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "updateUnsafeSites" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
      } else if (response.success) {
        alert("Unsafe sites updated successfully!");
      } else {
        alert("Failed to update unsafe sites: " + response.error);
      }
    });
  });
});
