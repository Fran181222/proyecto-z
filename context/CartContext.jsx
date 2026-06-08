"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const CartContext = createContext(null);

/**
 * Expone el estado y las acciones del carrito a la app.
 *
 * @param {{ children: React.ReactNode }} props - Contenido envuelto por el provider.
 * @returns {JSX.Element}
 */
export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("malibu-cart", []);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // ← NUEVO

  // ← NUEVO: Espera a que el cliente esté listo antes de mostrar contenido que depende de localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  /**
   * Agrega un producto al carrito o incrementa su cantidad.
   *
   * @param {Object} product - Producto a agregar.
   */
  const addItem = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsOpen(true);
  };

  /**
   * Elimina un producto del carrito por su id.
   *
   * @param {string|number} id - Identificador del producto.
   */
  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  /**
   * Actualiza la cantidad de un producto del carrito.
   *
   * @param {string|number} id - Identificador del producto.
   * @param {number} delta - Cambio a aplicar en la cantidad.
   */
  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQty, 
        total, 
        itemCount, 
        isOpen, 
        setIsOpen,
        isHydrated  // ← NUEVO: expone la flag para que Navbar sepa si está listo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Accede al contexto del carrito.
 *
 * @returns {ReturnType<typeof useContext>}
 */
export const useCart = () => useContext(CartContext);