"use client";

import { useEffect, useState } from "react";

/**
 * Lee un valor desde localStorage y lo mantiene sincronizado.
 *
 * @param {string} key - Clave de almacenamiento.
 * @param {any} defaultValue - Valor por defecto si no hay dato guardado o es inválido.
 * @returns {[any, Function]} Valor actual y función para actualizarlo.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Si falla el guardado, no bloqueamos la interfaz.
    }
  }, [key, value]);

  return [value, setValue];
}
