import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Modal from './Modal';

const App = () => {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);


  const handleAddToCart = (product) => {
    if (!cart.some(item => item.id === product.id)) {
      setCart([...cart, product]);
    } else {
      alert("Item already added to the cart");
    }
  };


  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <div className="App">
      <Navbar cartCount={cart.length} setIsModalOpen={setIsModalOpen} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-md">
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600">${product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-blue-500 text-white p-2 rounded-md"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal cart={cart} handleRemoveFromCart={handleRemoveFromCart} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default App;
