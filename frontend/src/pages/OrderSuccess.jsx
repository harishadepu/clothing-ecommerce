import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">
          🎉 Order Confirmed!
        </h2>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Order ID:</span> {order._id}
        </p>
        <p className="text-gray-700 mb-6">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>

        <h3 className="text-xl font-semibold mb-3">Items</h3>
        <ul className="divide-y divide-gray-200 mb-6">
          {order.items.map((i, idx) => (
            <li
              key={idx}
              className="flex justify-between py-2 text-gray-700"
            >
              <span>
                {i.name} ({i.size}) x {i.qty}
              </span>
              <span>${i.price}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Total: ${order.totalPrice}
        </h3>

        <p className="text-center text-gray-600">
          Thank you for shopping with us! We’ll send you a confirmation email
          shortly.
        </p>
      </div>
    </div>
  );
}