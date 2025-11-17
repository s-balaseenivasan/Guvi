const Modal = ({ cart, handleRemoveFromCart, setIsModalOpen }) => {
  let price = 0;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-[500px]">
        <h3 className="text-xl mb-4">Cart Items</h3>

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            <ul>
              {cart.map((product) => {
                price += product.price;

                return (
                  <li key={product.id} className="flex justify-between items-center mb-4">
                    <div className="grid grid-cols-3 items-center">
                      <h6>{product.title}</h6>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-[50px] h-[50px] object-cover"
                      />
                      <h6>{product.price.toFixed(2)}</h6>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(product.id)}
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

        <div className="flex justify-between mt-4">
          <h1>Total</h1>
          <h1>{price.toFixed(2)}</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 bg-gray-500 text-white p-2 rounded-md w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
