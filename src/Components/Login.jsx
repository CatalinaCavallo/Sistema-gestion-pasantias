import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom"; 
import logo from '../assets/logo2.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/inicio"); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  return (
    <div className="page-container">
      <img src={logo} alt="Logo" className="logo-large" />
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Iniciar sesión</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
        <p>¿No tenés cuenta? <Link to="/registro">Registrate aquí</Link></p>
      </form>
    </div>
  );
}
