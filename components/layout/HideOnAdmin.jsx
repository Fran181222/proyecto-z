"use client";
import { usePathname } from "next/navigation";

/** El panel de administración no lleva la cabecera, el pie ni los popups de la tienda. */
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
