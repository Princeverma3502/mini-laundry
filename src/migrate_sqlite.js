const fs = require('fs');
const path = require('path');
const storageJsonPath = path.join(__dirname, '..', 'data', 'orders.json');
const sqlite = require('./storage_sqlite');

function migrate() {
  if (!fs.existsSync(storageJsonPath)) { console.log('No JSON data to migrate'); return; }
  const raw = fs.readFileSync(storageJsonPath, 'utf8');
  let arr = [];
  try { arr = JSON.parse(raw || '[]'); } catch (e) { console.error('Failed to parse JSON', e); return; }
  if (!Array.isArray(arr) || arr.length === 0) { console.log('No orders to migrate'); return; }
  console.log(`Migrating ${arr.length} orders to SQLite...`);
  sqlite.saveAll(arr);
  console.log('Migration complete');
}

migrate();
