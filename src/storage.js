// Storage wrapper: choose SQLite if USE_SQLITE=1, otherwise JSON file
if (process.env.USE_SQLITE === '1') {
  module.exports = require('./storage_sqlite');
} else {
  const fs = require('fs');
  const path = require('path');

  const DATA_FILE = path.join(__dirname, '..', 'data', 'orders.json');

  function ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }

  ensureDataFile();

  function readOrders() {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (e) {
      return [];
    }
  }

  function writeOrders(arr) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
  }

  module.exports = {
    getAll: () => readOrders(),
    saveAll: (arr) => writeOrders(arr),
    add: (order) => {
      const arr = readOrders();
      arr.push(order);
      writeOrders(arr);
      return order;
    },
    update: (id, patch) => {
      const arr = readOrders();
      const idx = arr.findIndex((o) => o.id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...patch };
      writeOrders(arr);
      return arr[idx];
    },
    findById: (id) => {
      const arr = readOrders();
      return arr.find((o) => o.id === id) || null;
    },
  };
}
