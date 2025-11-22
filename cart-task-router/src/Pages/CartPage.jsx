import { NavLink } from "react-router";
import { useState,useEffect } from "react";
import '../index.css'
const CartPage = ({ cart, setCart }) => {
    let [price, setPrice] = useState(0);
    console.log(cart);
    useEffect(() => {
        let tot = 0;
        cart.forEach(element => {
            tot += element.price;
        });
        setPrice(tot); 
    });

    const handleRemoveFromCart = (productId,productPrice) => {
        setCart(cart.filter(item => item.id !== productId));
        setPrice(price-productPrice);
    };


    return (
        <div className="flex items-center justify-center">
            <div className=" p-6 rounded-md w-full">
                <h3 className="text-[48px] font-bold mb-4">Cart Items</h3>

                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div >
                        <ul>
                            {cart.map((product) => {

                                return (
                                    <li key={product.id} className="flex  items-center mb-4">
                                        <div className="grid grid-cols-3 w-[75%] items-center">
                                            <h4>{product.title}</h4>
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-[80px] h-[80px] object-cover"
                                            />
                                            <h4>{product.price.toFixed(2)}</h4>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(product.id,product.price)}
                                            className="bg-red-500 text-white p-1 rounded-md"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <div className="flex justify-center gap-[50px] text-xl mt-4">
                    <h1>Total</h1>
                    <h1 >{price.toFixed(2)}</h1>
                </div>

                <NavLink to={"/"}>
                    <button className="mt-4 bg-gray-500 text-white p-2 rounded-md w-[100px]">
                        Close
                    </button>
                </NavLink>
            </div>
        </div>
    );
};

export default CartPage;

