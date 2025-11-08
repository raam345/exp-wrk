import express from 'express';

export default function(db) {
  const router = express.Router();
  const orders = db.collection('orders');

  // Create Order
  router.post('/', async (req, res) => {
    try {
      const { userId, items, total, shippingAddress, paymentMethod } = req.body;
      const { ObjectId } = await import('mongodb');

      const result = await orders.insertOne({
        userId: new ObjectId(userId),
        items,
        total,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
      });

      res.status(201).json({
        message: 'Order created successfully',
        orderId: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get User Orders
  router.get('/:userId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const userOrders = await orders
        .find({ userId: new ObjectId(req.params.userId) })
        .toArray();

      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Order by ID
  router.get('/detail/:orderId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const order = await orders.findOne({ _id: new ObjectId(req.params.orderId) });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Order Status
  router.patch('/:orderId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const { status } = req.body;

      const result = await orders.updateOne(
        { _id: new ObjectId(req.params.orderId) },
        { $set: { status, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ message: 'Order updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
