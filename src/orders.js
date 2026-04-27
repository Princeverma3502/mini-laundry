const express = require('express');
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');

const router = express.Router();

const STATUS = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

const defaultPrices = {
  Shirt: 50,
  Pants: 80,
  Saree: 120,
};

function computeTotal(garments) {
  let total = 0;
  for (const g of garments) {
    const price = g.price != null ? Number(g.price) : (defaultPrices[g.type] || 50);
    const qty = Number(g.quantity) || 0;
    total += price * qty;
  }
  return total;
}

// Create order
router.post('/', (req, res) => {
  const { customerName, phone, garments } = req.body;
  if (!customerName || !phone || !Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({ error: 'customerName, phone and garments[] are required' });
  }

  const total = computeTotal(garments);
  const order = {
    id: uuidv4(),
    customerName,
    phone,
    garments,
    total,
    status: 'RECEIVED',
    createdAt: new Date().toISOString(),
  };

  storage.add(order);
  res.status(201).json(order);
});

// List orders with optional filters
router.get('/', (req, res) => {
  const { status, q } = req.query;
  let items = storage.getAll();
  if (status) items = items.filter((o) => o.status === status);
  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((o) => o.customerName.toLowerCase().includes(qq) || o.phone.includes(q));
  }
  res.json(items);
});

// Get single
router.get('/:id', (req, res) => {
  const order = storage.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'not found' });
  res.json(order);
});

// Update status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!STATUS.includes(status)) return res.status(400).json({ error: 'invalid status' });
  const updated = storage.update(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

// Dashboard
router.get('/-dashboard/summary', (req, res) => {
  const all = storage.getAll();
  const totalOrders = all.length;
  const totalRevenue = all.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const perStatus = {};
  for (const s of STATUS) perStatus[s] = 0;
  for (const o of all) perStatus[o.status] = (perStatus[o.status] || 0) + 1;
  res.json({ totalOrders, totalRevenue, perStatus });
});

module.exports = router;
