import express from 'express';

export default function(db) {
  const router = express.Router();
  const products = db.collection('products');

  // Get All Products
  router.get('/', async (req, res) => {
    try {
      const allProducts = await products.find({}).toArray();
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Single Product
  router.get('/:id', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const product = await products.findOne({ _id: new ObjectId(req.params.id) });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Product (Admin)
  router.post('/', async (req, res) => {
    try {
      const { name, description, price, image, stock, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price required' });
      }

      const result = await products.insertOne({
        name,
        description,
        price,
        image,
        stock: stock || 0,
        category,
        createdAt: new Date(),
      });

      res.status(201).json({ message: 'Product created', productId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Product
  router.put('/:id', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const { name, description, price, stock, image, category } = req.body;

      const result = await products.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            name,
            description,
            price,
            stock,
            image,
            category,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete Product
  router.delete('/:id', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const result = await products.deleteOne({ _id: new ObjectId(req.params.id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
