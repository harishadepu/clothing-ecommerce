import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useContext } from "react";

export default function Cart() {
  // ✅ Access cart items and backend-aware methods from context
  const { items, remove } = useContext(CartContext);

  // ✅ Calculate subtotal (sum of price * qty for all items)
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        {/* 🛒 Cart title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Cart
        </h2>

        {/* 📭 Empty cart message */}
        {items.length === 0 ? (
          <p className="text-center text-gray-600">Cart is empty</p>
        ) : (
          <>
            {/* 📦 Cart items list */}
            <div className="divide-y divide-gray-200 mb-6">
              {items.map((i) => (
                <div
                  key={`${i.productId}-${i.size}`}
                  className="flex items-center justify-between py-4"
                >
                  {/* 🖼️ Product image + details */}
                  <div className="flex items-center gap-4">
                    {i.image && (
                      <img
                        src={i.image}
                        alt={i.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {i.name}
                      </h3>
                      <p className="text-gray-600">Size: {i.size}</p>
                      <p className="text-gray-600">Qty: {i.qty}</p>
                      <p className="text-blue-600 font-semibold">
                        ${typeof i.price === 'number' ? i.price.toFixed(2) : (i.price || '—')}
                      </p>
                      {/* 💰 Line total for this item */}
                      <p className="text-gray-700">
                        Total: ${(i.price * i.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ❌ Remove button (calls backend via context.remove) */}
                  <button
                    onClick={() => remove(i.productId, i.size)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* 💵 Subtotal section */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-800">
                Subtotal:
              </span>
              <span className="text-xl font-bold text-blue-600">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* ✅ Checkout button */}
            <Link
              to="/checkout"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}