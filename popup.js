document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "updateUnsafeSites" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
      } else {
        alert("Unsafe sites updated successfully!");
      }
    });
  });
});
