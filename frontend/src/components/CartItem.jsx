export default function CartItem({ item, remove }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md p-4 mb-3 shadow-sm">
      <div>
        <span className="font-medium text-gray-800">
          {item.productId} ({item.size})
        </span>
        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
      </div>
      <button
        onClick={() => remove(item.productId, item.size)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
      >
        Remove
      </button>
    </div>
  );
}