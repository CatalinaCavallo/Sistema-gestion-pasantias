import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";
import logo from '../assets/logo2.png';

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err) {
      setError("Error al enviar el correo: " + err.message);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src={logo} alt="Logo" className="logo-large" />
        <h2>Restablecer contraseña</h2>
        <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Enviar enlace</button>
        {mensaje && <p className="success">{mensaje}</p>}
        {error && <p className="error">{error}</p>}
        <p><Link to="/login">Volver</Link></p>
      </form>
    </div>
  );
}
