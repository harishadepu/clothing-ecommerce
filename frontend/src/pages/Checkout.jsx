import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

export default function Checkout() {
  const { items, syncServerCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!user) return alert("Please login to place order");
    setLoading(true);
    try {
      const { data } = await api.post("/orders");
      await syncServerCart().catch(() => {});
      navigate(`/order/${data._id}`);
    } catch (err) {
      console.error("Place order failed:", err.response?.data || err.message || err);
      alert(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Checkout
        </h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {items.map((i) => (
                <li
                  key={`${i.productId}-${i.size}`}
                  className="flex justify-between py-2 text-gray-700"
                >
                  <span>
                    {i.name || i.productId} ({i.size}) × {i.qty}
                  </span>
                  <span>${(i.qty * i.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <p className="text-right font-semibold text-gray-800 mb-4">
              Total: ${items.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2)}
            </p>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}