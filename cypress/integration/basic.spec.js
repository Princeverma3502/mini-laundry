describe('Mini Laundry API', () => {
  it('creates and lists an order', () => {
    cy.request('POST', '/api/orders', {
      customerName: 'Test User',
      phone: '12345',
      garments: [{ type: 'Shirt', quantity: 2, price: 50 }]
    }).then((resp) => {
      expect(resp.status).to.eq(201);
      const id = resp.body.id;
      cy.request('/api/orders').then((list) => {
        expect(list.status).to.eq(200);
        const found = list.body.find(o => o.id === id);
        expect(found).to.exist;
        expect(found.total).to.eq(100);
      });
    });
  });
});
