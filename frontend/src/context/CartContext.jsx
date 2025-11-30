import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart items state (always synced with backend)
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);

  //
  // 🔄 Sync cart from backend whenever user logs in
  //
  useEffect(() => {
    if (user) {
      syncServerCart();
    } else {
      setItems([]); // clear cart if user logs out
    }
  }, [user]);


  // Add item to cart (calls backend)

  const add = async (productId, size, qty = 1) => {
  if (!user) return;

  // Optimistic update: check if item already exists in local state
  setItems(prevItems => {
    const idx = prevItems.findIndex(
      i => i.productId === productId && i.size === size
    );
    if (idx >= 0) {
      const updated = [...prevItems];
      updated[idx].qty += qty;
      return updated;
    }
    return [...prevItems, { productId, size, qty }];
  });

  // Sync with backend
  const { data } = await api.post("/cart/add", { productId, size, qty });
  setItems(
    data.items.map(i => ({
      productId: i.product._id,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price,
      size: i.size,
      qty: i.qty,
    }))
  );
};

  //
  // ✏️ Update item quantity
  //
  const update = async (productId, size, qty) => {
    if (!user) return;
    const { data } = await api.put("/cart/update", { productId, size, qty });
    setItems(
      data.items.map(i => ({
        productId: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        qty: i.qty,
      }))
    );
  };

  //
  // ❌ Remove item from cart
  //
  const remove = async (productId, size) => {
    console.log("Removing item:", productId, size);
    if (!user) return;
    // Axios DELETE expects request body in the `data` property of the config
    const { data } = await api.delete("/cart/remove", { data: { productId, size } });
    console.log("Remove response data:", data);
    setItems(
      data.items.map(i => ({
        productId: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        qty: i.qty,
      }))
    );
  };
  

  //
  // 📦 Fetch cart from backend
  //
  const syncServerCart = async () => {
    if (!user) return;
    const { data } = await api.get("/cart");
    setItems(
      data.items.map(i => ({
        productId: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        qty: i.qty,
      }))
    );
  };

  return (
    <CartContext.Provider
      value={{ items, add, update, remove, syncServerCart }}
    >
      {children}
    </CartContext.Provider>
  );
};