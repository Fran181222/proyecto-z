"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isModalOpen, modalView, closeModal, openModal, login, register } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "",
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isModalOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(loginData.email, loginData.password);
      setLoading(false);
      if (!result.ok) setFeedback(result.message);
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = register(registerData);
      setLoading(false);
      if (!result.ok) setFeedback(result.message);
    }, 1000);
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={closeModal} />
      <div
        className="modal fade auth-modal show"
        style={{ display: "block" }}
        tabIndex="-1"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <p className="mini-label mb-1">Malibu Access</p>
                <h3 className="auth-title mb-0">
                  {modalView === "login" ? "Ingresar a Malibu" : "Crear cuenta Malibu"}
                </h3>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Cerrar"
              />
            </div>

            <div className="modal-body">
              {/* Switch login / registro */}
              <div className="auth-switch">
                <button
                  className={`switch-btn ${modalView === "login" ? "active" : ""}`}
                  type="button"
                  onClick={() => { openModal("login"); setFeedback(""); }}
                >
                  Login
                </button>
                <button
                  className={`switch-btn ${modalView === "register" ? "active" : ""}`}
                  type="button"
                  onClick={() => { openModal("register"); setFeedback(""); }}
                >
                  Registro
                </button>
              </div>

              {feedback && (
                <div className="input-feedback error mb-3">{feedback}</div>
              )}

              {/* Formulario Login */}
              {modalView === "login" && (
                <form onSubmit={handleLogin} className="auth-form active" noValidate>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="malibu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="d-grid gap-3">
                    <button className="btn-mali btn-gold w-100" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                      ) : (
                        "Iniciar sesión"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Formulario Registro */}
              {modalView === "register" && (
                <form onSubmit={handleRegister} className="auth-form active" noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Nombre completo</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Tu nombre"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input
                        className="form-control"
                        type="tel"
                        placeholder="+54 11 5555 2026"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="tuemail@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Contraseña</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Crea tu contraseña"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Repetir contraseña</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Repetí tu contraseña"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-grid gap-3 mt-4">
                    <button className="btn-mali btn-gold w-100" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                      ) : (
                        "Crear cuenta"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}