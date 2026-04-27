const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'orders.sqlite');
const db = new Database(DB_PATH);

function init() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT,
      phone TEXT,
      garments TEXT,
      total REAL,
      status TEXT,
      createdAt TEXT
    )`
  ).run();
}

init();

module.exports = {
  getAll: () => {
    const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    return rows.map(r => ({ ...r, garments: JSON.parse(r.garments) }));
  },
  saveAll: (arr) => {
    const insert = db.prepare('INSERT OR REPLACE INTO orders (id,customerName,phone,garments,total,status,createdAt) VALUES (@id,@customerName,@phone,@garments,@total,@status,@createdAt)');
    const del = db.prepare('DELETE FROM orders');
    const tx = db.transaction((items) => {
      del.run();
      for (const it of items) insert.run({ ...it, garments: JSON.stringify(it.garments) });
    });
    tx(arr);
  },
  add: (order) => {
    const stmt = db.prepare('INSERT INTO orders (id,customerName,phone,garments,total,status,createdAt) VALUES (@id,@customerName,@phone,@garments,@total,@status,@createdAt)');
    stmt.run({ ...order, garments: JSON.stringify(order.garments) });
    return order;
  },
  update: (id, patch) => {
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) return null;
    const o = { ...existing, ...patch };
    if (o.garments && typeof o.garments !== 'string') o.garments = JSON.stringify(o.garments);
    const stmt = db.prepare('UPDATE orders SET customerName=@customerName, phone=@phone, garments=@garments, total=@total, status=@status WHERE id=@id');
    stmt.run({ ...o, id });
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return { ...updated, garments: JSON.parse(updated.garments) };
  },
  findById: (id) => {
    const r = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return r ? { ...r, garments: JSON.parse(r.garments) } : null;
  },
};
