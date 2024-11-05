// /server.js
const express = require('express');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
const port = 3000;

// Use the routes defined in cryptoRoutes
app.use('/', cryptoRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
