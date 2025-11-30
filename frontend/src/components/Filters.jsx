export default function Filters({ query, setQuery }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={query.search}
        onChange={(e) =>
          setQuery({ ...query, search: e.target.value, page: 1 })
        }
        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
      />

      {/* Category Filter */}
      <select
        value={query.category}
        onChange={(e) =>
          setQuery({ ...query, category: e.target.value, page: 1 })
        }
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
      >
        <option value="">All Categories</option>
        <option>Men</option>
        <option>Women</option>
        <option>Kids</option>
      </select>

      {/* Size Filter */}
      <select
        value={query.size}
        onChange={(e) => setQuery({ ...query, size: e.target.value, page: 1 })}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
      >
        <option value="">Any Size</option>
        <option>S</option>
        <option>M</option>
        <option>L</option>
        <option>XL</option>
      </select>
    </div>
  );
}