import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import api from "../services/api";

export default function Products() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    category: "",
    size: "",
    page: 1,
    limit: 12,
  });
  const [meta, setMeta] = useState({ total: 0, pages: 0 });

  useEffect(() => {
    const load = async () => {
      const params = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v)
      );
      const { data } = await api.get("/products", { params });
      setItems(data.items);
      setMeta({ total: data.total, pages: data.pages });
    };
    load();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Products
      </h2>

      {/* Filters */}
      <div className="mb-6">
        <Filters query={query} setQuery={setQuery} />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: meta.pages }, (_, i) => (
          <button
            key={i}
            onClick={() => setQuery({ ...query, page: i + 1 })}
            disabled={query.page === i + 1}
            className={`px-4 py-2 rounded-md border ${
              query.page === i + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}