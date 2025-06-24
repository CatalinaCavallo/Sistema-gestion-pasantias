import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, get } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const snapshot = await get(dbRef(database, "usuarios/" + uid));
        if (snapshot.exists()) setUsuario(snapshot.val());
      }
      setCargando(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (cargando) return <p>Cargando perfil...</p>;
  if (!usuario) return <p>No se encontró el perfil.</p>;

  // Función para construir la URL del CV
  const getCvUrl = () => {
    if (!usuario.cvFilename) return null;
    return usuario.cvFilename.startsWith('/uploads') 
      ? `http://localhost:3000${usuario.cvFilename}`
      : `http://localhost:3000/uploads/${usuario.cvFilename}`;
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Perfil</h2>
  
        <section className="perfil-seccion">
          <h3>Datos Personales</h3>
          <hr />
          <div className="perfil-dato"><strong>Nombre:</strong> {usuario.nombreCompleto}</div>
          <div className="perfil-dato"><strong>DNI:</strong> {usuario.dni}</div>
          <div className="perfil-dato"><strong>Legajo:</strong> {usuario.legajo}</div>
          <div className="perfil-dato"><strong>Teléfono:</strong> {usuario.telefono}</div>
          <div className="perfil-dato"><strong>Email:</strong> {usuario.email}</div>
          <div className="perfil-dato"><strong>Carrera:</strong> {usuario.carrera}</div>
        </section>
  
        <section className="perfil-seccion">
          <h3>Datos Laborales</h3>
          <hr />
          <div className="perfil-dato"><strong>Habilidades:</strong> {usuario.habilidades}</div>
          <div className="perfil-dato"><strong>Experiencia:</strong> {usuario.experiencia}</div>
          <div className="perfil-dato"><strong>Cursos:</strong> {usuario.cursos}</div>
          <div className="perfil-dato">
            <strong>CV:</strong>{" "}
            {getCvUrl() ? (
              <a 
                href={getCvUrl()}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Ver/Descargar
              </a>
            ) : (
              <span>No disponible</span>
            )}
          </div>
        </section>
  
        <div className="perfil-buttons">
          <button className="edit-button">Editar Perfil</button>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}