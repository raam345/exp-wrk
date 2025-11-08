import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default function(db) {
  const router = express.Router();
  const users = db.collection('users');
  const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

  // Sign Up
  router.post('/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await users.insertOne({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
      });

      res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sign In
  router.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({
        message: 'Sign in successful',
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get User Profile
  router.get('/profile/:userId', async (req, res) => {
    try {
      const { ObjectId } = await import('mongodb');
      const user = await users.findOne({ _id: new ObjectId(req.params.userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
