const request = require('supertest');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const app = require('../src/app');

describe('Orders API (JSON storage)', () => {
  const dataFile = path.join(__dirname, '..', 'data', 'orders.json');
  before(() => {
    // ensure clean data file
    if (fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
  });

  it('creates an order and lists it', async () => {
    const createRes = await request(app)
      .post('/api/orders')
      .send({ customerName: 'Alice', phone: '9999', garments: [{ type: 'Shirt', quantity: 2, price: 50 }] })
      .expect(201);

    expect(createRes.body).to.have.property('id');
    expect(createRes.body.total).to.equal(100);

    const listRes = await request(app).get('/api/orders').expect(200);
    const found = listRes.body.find(o => o.id === createRes.body.id);
    expect(found).to.exist;
    expect(found.customerName).to.equal('Alice');
  });

  it('updates status', async () => {
    const r = await request(app)
      .post('/api/orders')
      .send({ customerName: 'Bob', phone: '1234', garments: [{ type: 'Pants', quantity: 1, price: 80 }] })
      .expect(201);
    const id = r.body.id;
    await request(app).patch(`/api/orders/${id}/status`).send({ status: 'READY' }).expect(200);
    const get = await request(app).get(`/api/orders/${id}`).expect(200);
    expect(get.body.status).to.equal('READY');
  });
});
