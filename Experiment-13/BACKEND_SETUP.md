# 🚀 Backend Setup Guide

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend` folder:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Install MongoDB
**Option A: Local MongoDB**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation guide for your OS
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

---

## Frontend Integration

### 1. Install Axios or Use Fetch
The `src/services/api.js` file is already created for you!

### 2. Update Frontend Components

**Example - SignUp Component:**
```jsx
import { userAPI } from '../services/api';

const handleSignUp = async (email, password, name) => {
  try {
    const response = await userAPI.signup({ email, password, name });
    localStorage.setItem('token', response.token);
    // Redirect to dashboard
  } catch (error) {
    console.error('Sign up failed:', error);
  }
};
```

**Example - Get Products:**
```jsx
import { productAPI } from '../services/api';
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## API Endpoints

### Users
- `POST /api/users/signup` - Create new user
- `POST /api/users/signin` - Login user
- `GET /api/users/profile/:userId` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/:userId/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user's orders
- `GET /api/orders/detail/:orderId` - Get order details
- `PATCH /api/orders/:orderId` - Update order status

---

## Running Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

---

## Troubleshooting

**CORS Error?**
- Make sure backend is running on port 5000
- Check CORS is enabled in `server.js`

**MongoDB Connection Error?**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env` file

**Token Issues?**
- Check token is saved in localStorage after signin
- Verify JWT_SECRET is set in `.env`
