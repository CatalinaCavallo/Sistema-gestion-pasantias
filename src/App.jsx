import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Perfil from "./Components/Perfil";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useEffect, useState } from "react";
import Landing from "./Components/Landing";
import Inicio from "./Components/Inicio";
import Navbar from "./Components/Navbar";
import Ofertas from "./Components/Ofertas";
import Postulaciones from "./Components/Postulaciones";
import RecuperarContrasena from "./Components/RecuperarContrasena";
import './App.css';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (user === undefined) return <p>Cargando...</p>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const location = useLocation();

  // Mostrar navbar solo en estas rutas:
  const showNavbar = ["/perfil", "/ofertas", "/postulaciones", "/inicio"].includes(location.pathname);


  return (
    <div className="app-container">
      {showNavbar && <Navbar />}

      <div className="main-content">
        <Routes>
          {/* Ruta de Landing: Mostrarla siempre que se ingrese a la app */}
          <Route path="/" element={<Landing />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/inicio" element={
            <ProtectedRoute><Inicio /></ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute><Perfil /></ProtectedRoute>
          } />
          <Route path="/ofertas" element={
            <ProtectedRoute><Ofertas /></ProtectedRoute>
          } />
          <Route path="/postulaciones" element={
            <ProtectedRoute><Postulaciones /></ProtectedRoute>
          } />

          {/* Redirección por defecto a Landing si la ruta no coincide */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/recuperar" element={<RecuperarContrasena />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

