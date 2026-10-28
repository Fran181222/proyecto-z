"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Carga diferida: el JS de Bootstrap (dropdown/collapse del navbar) no es necesario para el primer render.
    const load = () => import("bootstrap/dist/js/bootstrap.bundle.min.js");

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(load, 300);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
