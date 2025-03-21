const express = require('express');
const axios = require('axios');

const app = express();

app.get('/track', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const locationData = response.data;

        console.log(`IP: ${ip}`);
        console.log(`Location: ${locationData.city}, ${locationData.region}, ${locationData.country}`);

        res.send(`Your IP: ${ip}, Location: ${locationData.city}, ${locationData.country}`);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.send('Error fetching location data');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
