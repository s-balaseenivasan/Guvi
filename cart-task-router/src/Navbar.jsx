import { NavLink } from "react-router";

const Navbar = (probs) => {
    
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="text-xl">Shopping Cart App</div>
            <NavLink to="/cart" >
                <button className="bg-yellow-500 p-2 rounded-md">Cart {probs.length}</button>
            </NavLink>
            
        </nav>
    );
};

export default Navbar;