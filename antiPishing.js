async function checkPhishing(url) {
    const apiKey = "YOUR_GOOGLE_SAFE_BROWSING_API_KEY";
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          client: {
            clientId: "cybershield",
            clientVersion: "1.0"
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
          }
        }),
        headers: { "Content-Type": "application/json" }
      }
    );
    const data = await response.json();
    return data.matches ? true : false;
  }
  