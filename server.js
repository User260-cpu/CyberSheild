// server.js

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Define your VirusTotal API key
const VIRUSTOTAL_API_KEY = "your-virustotal-api-key";

// Allow cross-origin requests from any origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Route to check URL with VirusTotal
app.get('/check-url', async (req, res) => {
    const url = req.query.url;
    const encodedUrl = encodeURIComponent(url);
    
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY
            }
        });

        // If VirusTotal analysis returns data, send it back to the client
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching VirusTotal data:", error);
        res.status(500).send('Error fetching VirusTotal data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
