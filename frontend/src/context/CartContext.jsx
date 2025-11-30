import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);

  //
  // Normalize backend cart shape into frontend shape
  //
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

  //
  // Fetch cart when user logs in
  //
  useEffect(() => {
    if (user) {
      syncServerCart();
    } else {
      setItems([]);
    }
  }, [user]);

  //
  // Add item to cart
  //
  const add = async (productId, size, qty = 1) => {
    console.log("Adding to cart:", { productId, size, qty });
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

    // Sync with backend
    const { data } = await api.post("/cart/add", { productId, size, qty });
    setItems(normalizeCart(data.items));
  };

  //
  // Update quantity
  //
  const update = async (productId, size, qty) => {
    if (!user) return;

    const { data } = await api.put("/cart/update", {
      productId,
      size,
      qty,
    });

    setItems(normalizeCart(data.items));
  };

  //
  // Remove item
  //
  const remove = async (productId, size) => {
    if (!user) return;

    const { data } = await api.delete("/cart/remove", {
      data: { productId, size },
    });

    setItems(normalizeCart(data.items));
  };

  //
  // Fetch latest cart from server
  //
  const syncServerCart = async () => {
    if (!user) return;

    const { data } = await api.get("/cart");

    setItems(
      normalizeCart(data.items || [])
    );
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
