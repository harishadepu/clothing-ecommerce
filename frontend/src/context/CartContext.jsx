import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);

  // Normalize backend cart shape into frontend shape
  const normalizeCart = (dataItems) => {
    if (!Array.isArray(dataItems)) return [];
    return dataItems.map((i) => {
      const prod = i.product || {};
      const productId = prod._id
        ? String(prod._id)
        : i.product?._id
        ? String(i.product._id)
        : String(i.product);

      return {
        productId,
        name: prod.name ?? i.name ?? "",
        image: prod.image ?? i.image ?? "",
        price: prod.price ?? i.price ?? 0,
        size: i.size,
        qty: i.qty,
      };
    });
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      syncServerCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const add = async (productId, size, qty = 1) => {
    if (!user) return;

    // Optimistic UI update
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === productId && i.size === size
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return updated;
      }
      return [...prev, { productId, size, qty }];
    });

    try {
      const { data } = await api.post("/cart/add", { productId, size, qty });
      setItems(normalizeCart(data.items));
    } catch (err) {
      console.error("Failed to sync add:", err);
    }
  };

  const update = async (productId, size, qty) => {
    if (!user) return;
    try {
      const { data } = await api.put("/cart/update", { productId, size, qty });
      setItems(normalizeCart(data.items));
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const remove = async (productId, size) => {
    if (!user) return;
    try {
      const { data } = await api.delete("/cart/remove", {
        data: { productId, size },
      });
      setItems(normalizeCart(data.items));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const syncServerCart = async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/cart");
      setItems(normalizeCart(data.items || []));
    } catch (err) {
      console.error("Failed to sync cart:", err);
      setItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        update,
        remove,
        syncServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};