import express from 'express';

export default function(db) {
  const router = express.Router();
  const cart = db.collection('cart');

  // Get Cart
  router.get('/:userId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const userCart = await cart.findOne({ userId: new ObjectId(req.params.userId) });

      res.json(userCart || { userId: req.params.userId, items: [], total: 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add to Cart
  router.post('/add', async (req, res) => {
    try {
      const { userId, productId, quantity, price } = req.body;
      const { ObjectId } = await import('mongodb');

      const userObjectId = new ObjectId(userId);
      const productObjectId = new ObjectId(productId);

      const existingCart = await cart.findOne({ userId: userObjectId });

      if (existingCart) {
        const existingItem = existingCart.items.find(
          (item) => item.productId.toString() === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          existingCart.items.push({ productId: productObjectId, quantity, price });
        }

        existingCart.total = existingCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        await cart.updateOne({ userId: userObjectId }, { $set: existingCart });
      } else {
        await cart.insertOne({
          userId: userObjectId,
          items: [{ productId: productObjectId, quantity, price }],
          total: price * quantity,
        });
      }

      res.json({ message: 'Item added to cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Remove from Cart
  router.delete('/:userId/:productId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const userObjectId = new ObjectId(req.params.userId);

      const result = await cart.updateOne(
        { userId: userObjectId },
        {
          $pull: { items: { productId: new ObjectId(req.params.productId) } },
        }
      );

      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
