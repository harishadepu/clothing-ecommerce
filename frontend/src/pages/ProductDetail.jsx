import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [size, setSize] = useState("");
  const { add } = useContext(CartContext);

  // Fetch product details from backend when component mounts
  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setP(res.data));
  }, [id]);

  // Show loading state until product is fetched
  if (!p) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        {/* Product image */}
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-96 object-cover rounded-md mb-6"
        />

        {/* Product name, price, description */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{p.name}</h2>
        <p className="text-xl text-blue-600 font-semibold mb-4">${p.price}</p>
        <p className="text-gray-600 mb-6">{p.description}</p>

        {/* Size selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="">Select size</option>
            {p.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Add to Cart button */}
        <button
          disabled={!size}
          // Pass product id to CartContext.add (was passing full product object, which caused duplicates)
          onClick={() => add(p._id, size, 1)}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            size
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}