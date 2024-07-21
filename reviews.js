const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 5501;
const SCOPES = ['https://www.googleapis.com/auth/androidpublisher'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Configure CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to fetch reviews
app.get('/reviews', async (req, res) => {
    try {
        const authClient = await authorize();
        const packageName = req.query.packageName;
        if (!packageName) {
            throw new Error('Package name is missing in the request');
        }
        const reviews = await listReviews(packageName, authClient);
        //console.log('Fetched reviews:', reviews);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Google API authorization
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

// Load saved credentials if they exist
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

// Save credentials to token.json
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
  });
        await fs.mkdir(TOKEN_DIR, { recursive: true });
  await fs.writeFile(TOKEN_PATH, payload);
  console.log('Token stored to', TOKEN_PATH);
    
}

// Fetch reviews using Google API client
async function listReviews(packageName, authClient) {
    try {
        const service = google.androidpublisher({ version: 'v3', auth: authClient });
        const response = await service.reviews.list({
            packageName: packageName,
            translationLanguage: 'en',
            // maxResults: 10,
        });

        
        console.log('Reviews from API:', response.data.reviews);
    
        return response.data.reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
