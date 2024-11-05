// /routes/cryptoRoutes.js
const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

// / load ../views/homepage.hmtl
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'views/' });
});

// Define the route for fetching cryptos with repositories
router.get('/cryptos', cryptoController.getCryptosWithRepositories);

module.exports = router;
