import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let storedProducts = [];
    try {
      const raw = localStorage.getItem("products");
      storedProducts = raw ? JSON.parse(raw) : [];
    } catch {
      storedProducts = [];
    }

    if (!storedProducts || storedProducts.length === 0) {
      // Seed defaults if none exist
      const defaults = [
        { id: Date.now(), name: "Laptop", price: 59999, image: "laptop.jpg" },
        { id: Date.now() + 1, name: "Smart Watch", price: 4999, image: "watch.jpg" },
        { id: Date.now() + 2, name: "Headphones", price: 1999, image: "headphone.jpg" },
      ];
      try { localStorage.setItem("products", JSON.stringify(defaults)); } catch {}
      setProducts(defaults);
    } else {
      setProducts(storedProducts);
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert(`/${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-blue-500 p-4 text-white">
        <h1 className="text-xl font-bold">Shopping</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="hover:underline flex items-center gap-1"
          >
            <FaShoppingCart /> Cart ({cart.length})
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {products.length === 0 ? (
          <p className="text-center col-span-3 text-gray-600">
            No products available. Please contact admin.
          </p>
        ) : (
          products.map((p) => {
            const imgSrc = /^(https?:)?\//.test(p.image) ? p.image : `/images/${p.image}`;
            return (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-lg transition"
            >
              {/* ✅ Loads image from public/images folder */}
              <img
                src={imgSrc}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-3 border"
              />
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-gray-600 mb-2">₹{p.price}</p>
              <button
                onClick={() => handleAddToCart(p)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;