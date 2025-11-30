import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
      <p className="text-blue-600 font-medium mb-4">${product.price}</p>
      <Link
        to={`/product/${product._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View
      </Link>
    </div>
  );
}