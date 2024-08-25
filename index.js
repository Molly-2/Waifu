const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS

app.get('/waifu', (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search parameter is required' });
  }

  const apiUrl = `https://api.waifu.im/search?included_tags=${encodeURIComponent(searchQuery)}`;

  https.get(apiUrl, (apiRes) => {
    let chunks = [];

    apiRes.on('data', (chunk) => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      const response = JSON.parse(body.toString());
      res.json(response);
    });
  }).on('error', (error) => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
