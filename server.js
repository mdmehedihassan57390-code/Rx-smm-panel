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
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'add');
    params.append('service', service);
    params.append('link', link);
    params.append('quantity', quantity);

    const response = await axios.post(PROVIDER_API_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'AmarBoost API-তে প্রসেস করতে ব্যর্থ হয়েছে।' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
