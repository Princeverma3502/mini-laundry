const express = require('express');
const cors = require('cors');
const path = require('path');

const ordersRouter = require('./orders');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);

// Serve static frontend
app.use('/', express.static(path.join(__dirname, '..', 'public')));

module.exports = app;
