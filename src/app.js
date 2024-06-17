const express = require('express');
const app = express();
const userRoutes = require('./routes/route');

app.use(express.json());

app.use('/api', userRoutes);  

module.exports = app;