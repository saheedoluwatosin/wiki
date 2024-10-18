// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb+srv://Oluwatosin:E123456@cluster0.97w7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log("Mongodb connected!!!") 
    })

// Define Guide Schema
const guideSchema = new mongoose.Schema({
    title: String,
    description: String,
    steps: [{
        title: String,
        description: String,
        image: String
    }]
});

const Guide = mongoose.model('Guide', guideSchema);

// Routes
app.get('/api/guides', async (req, res) => {
    try {
        const guides = await Guide.find();
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/guides/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (guide) {
            res.json(guide);
        } else {
            res.status(404).json({ message: 'Guide not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/guides', async (req, res) => {
    const guide = new Guide({
        title: req.body.title,
        description: req.body.description,
        steps: req.body.steps
    });

    try {
        const newGuide = await guide.save();
        res.status(201).json(newGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});