import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const isActive = (path) => location.pathname === path;
  const mostrarLinks = !["/login", "/registro"].includes(location.pathname);

  return (
    <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/inicio">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
    </div>
  
    {mostrarLinks && location.pathname !== "/inicio" && (
      <>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
  
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/perfil"
            className={`nav-link ${isActive("/perfil") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Mi Perfil
          </Link>
          <Link
            to="/ofertas"
            className={`nav-link ${isActive("/ofertas") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Ofertas Laborales
          </Link>
          <Link
            to="/postulaciones"
            className={`nav-link ${isActive("/postulaciones") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Mis Postulaciones
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </>
    )}
  </nav>
  );
}


