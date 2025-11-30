import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders"); // backend getUserOrders
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          My Orders
        </h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                  Order #{order._id}
                </h3>
                <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Items */}
              <ul className="divide-y divide-gray-200 mb-4">
                {order.items.map((i, idx) => (
                  <li
                    key={`${order._id}-${idx}`}
                    className="flex flex-col sm:flex-row sm:justify-between py-2 text-gray-700"
                  >
                    <span className="text-sm sm:text-base">
                      {i.name} ({i.size}) × {i.qty}
                    </span>
                    <span className="text-sm sm:text-base font-medium mt-1 sm:mt-0">
                      ${(i.qty * i.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-3">
                <span className="text-base sm:text-lg font-semibold text-gray-800">
                  Total
                </span>
                <span className="text-lg sm:text-xl font-bold text-blue-600 mt-2 sm:mt-0">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}