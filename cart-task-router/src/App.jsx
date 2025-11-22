import {useState,useEffect} from 'react'
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import CartPage from "./Pages/CartPage";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <Routes>
      <Route index element={<Homepage product={products} cart={cart}/>} />
      <Route path="/cart" element={<CartPage cart={cart} setCart={setCart}/>} />
    </Routes>

  );
}

export default App;
