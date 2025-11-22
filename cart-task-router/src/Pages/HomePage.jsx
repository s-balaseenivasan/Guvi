
import { useState } from 'react';
import Navbar from '../Navbar'
function Homepage(probs) {
    const products=probs.product;
    const cart=probs.cart;
    const [count,setCount]=useState(cart.length);
    const handleAddToCart = (product) => {
    if (!cart.some(item => item.id === product.id)) {
      cart.push(product);
      setCount(count+1);
    } else {
      alert("Item already added to the cart");
    }
  };

  return (
    <div className="App">
      <Navbar length={count}/>

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

    </div>
    
    

    
  )
}



export default Homepage

