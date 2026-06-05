"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login"); // "login" | "register"

  const openModal = (view = "login") => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const login = (email, password) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
    if (emailValid && passValid) {
      setUser({ email });
      closeModal();
      return { ok: true, message: "Sesión iniciada correctamente." };
    }
    return { ok: false, message: "Email o contraseña incorrectos." };
  };

  const register = (data) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const passValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password);
    const nameValid = /^[A-Za-z\u00C0-\u017F\s]{2,}$/.test(data.name);
    const phoneValid = /^[0-9+\s-]{8,}$/.test(data.phone);
    const passMatch = data.password === data.confirmPassword;

    if (emailValid && passValid && nameValid && phoneValid && passMatch) {
      setUser({ email: data.email, name: data.name });
      closeModal();
      return { ok: true, message: "Cuenta creada con éxito." };
    }
    return { ok: false, message: "Por favor revisá los campos e intentá de nuevo." };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isModalOpen, modalView, openModal, closeModal }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
