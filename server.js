require('dotenv').config(); // Load .env variables
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define a schema for tracking IPs
const ipSchema = new mongoose.Schema({
    ip: String,
    city: String,
    region: String,
    country: String,
    isp: String,
    timestamp: { type: Date, default: Date.now }
});

const IPInfo = mongoose.model('IPInfo', ipSchema);

app.get('/track', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Get location data from ip-api
        const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

        // Save IP info to MongoDB
        const newIP = new IPInfo({
            ip,
            city: data.city,
            region: data.regionName,
            country: data.country,
            isp: data.isp
        });

        await newIP.save();

        console.log(`Logged: ${ip} - ${data.city}, ${data.country}`);

        res.send(`Your IP: ${ip}, Location: ${data.city}, ${data.country}`);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).send('Error fetching location data');
    }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
