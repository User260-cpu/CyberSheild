chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkURL') {
    // Logic to check the URL using VirusTotal or other services
    checkURLWithVirusTotal(request.url);
    sendResponse({ message: 'Checking the URL for safety...' });
  }
});
