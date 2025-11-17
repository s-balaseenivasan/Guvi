const Navbar = ({ cartCount, setIsModalOpen }) => {
  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="text-xl">Shopping Cart App</div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-yellow-500 p-2 rounded-md"
      >
        Cart ({cartCount})
      </button>
    </nav>
  );
};

export default Navbar;
