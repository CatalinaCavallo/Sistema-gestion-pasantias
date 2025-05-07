import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref as dbRef, get } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

export default function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const snapshot = await get(dbRef(database, "usuarios/" + uid));
          if (snapshot.exists()) {
            setUsuario({
              ...snapshot.val(),
              email: user.email // Aseguramos que el email esté incluido
            });
          }
        } catch (error) {
          console.error("Error cargando datos del usuario:", error);
        }
      }
      setCargando(false);
    });
    return () => unsub();
  }, []);

  if (cargando) return <div className="loading">Cargando...</div>;
  if (!usuario) return <div className="loading">No se encontraron datos del usuario</div>;

  return (
  <div className="inicio-container">
    <div className="inicio-box"> {/* <-- nuevo contenedor grande */}
      <header className="inicio-header">
        <h1>
          {usuario.nombre} {usuario.apellido}
        </h1>
      </header>

      <div className="dashboard-grid">
        <Link to="/ofertas" className="dashboard-card">
          <div className="card-content">
            <h2>Ofertas Laborales</h2>
            <p>Explora las últimas oportunidades laborales disponibles</p>
          </div>
        </Link>

        <Link to="/postulaciones" className="dashboard-card">
          <div className="card-content">
            <h2>Mis Postulaciones</h2>
            <p>Revisa el estado de tus postulaciones laborales</p>
          </div>
        </Link>

        <Link to="/perfil" className="dashboard-card">
          <div className="card-content">
            <h2>Mi perfil</h2>
            <p>Ver y editar tu información personal y profesional</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
);
}