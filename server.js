const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const API_KEY = 'F7af4298b49e762aae7b137455577610';
const PROVIDER_API_URL = 'https://amarboost.com/api/v2';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/place-order', async (req, res) => {
  const { service, link, quantity } = req.body;

  if (!service || !link || !quantity) {
    return res.status(400).json({ error: 'সব প্রয়োজনীয় তথ্য দিন।' });
  }

  try {
    const postData = new URLSearchParams({
      key: API_KEY,
      action: 'add',
      service: service,
      link: link,
      quantity: quantity
    }).toString();

    const response = await axios.post(PROVIDER_API_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('API Error Details:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'AmarBoost API-তে প্রসেস করতে ব্যর্থ হয়েছে।',
      details: error.response ? error.response.data : error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
