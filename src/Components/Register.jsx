import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    legajo: "",
    password: "",
    carrera: "", 
    habilidades: "",
    experiencia: "",
    cursos: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setCvFile(e.target.files[0]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, ...perfil } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      if (cvFile) {
        const formData = new FormData();
        formData.append("cv", cvFile);

        await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }

      console.log("Perfil que se va a guardar en Firebase: ", perfil);
      console.log("Subiendo archivo CV: ", cvFile ? cvFile.name : "No hay archivo");

      await set(dbRef(database, "usuarios/" + uid), {
        ...perfil,
        email,
        uid,
      });

      alert("Registro exitoso. Serás redirigido al inicio.");
      navigate("/inicio");
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Registro</h2>
        <div className="form-grid">
          <div className="column-left">
            <h3>Datos Personales</h3>
            <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
            <input name="dni" placeholder="DNI" onChange={handleChange} required />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Correo" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required minLength="6" />
            <input name="legajo" placeholder="Legajo" onChange={handleChange} required />
            <select name="carrera" value={formData.carrera} onChange={handleChange} required>
              <option value="" disabled>Selecciona tu carrera</option>
              <option value="Ingenieria en Sistemas de Informacion">Ingeniería en Sistemas de Información</option>
              <option value="Ingenieria Industrial">Ingeniería Industrial</option>
              <option value="Ingenieria Quimica">Ingeniería Química</option>
              <option value="Ingenieria Electronica">Ingeniería Electrónica</option>
              <option value="Ingenieria Electromecanica">Ingeniería Electromecánica</option>
              <option value="Licenciatura en Administracion Rural">Licenciatura en Administración Rural</option>
              <option value="Tecnicatura en Programacion">Tecnicatura en Programación</option>
            </select>
          </div>

          <div className="column-right">
            <h3>Datos Laborales</h3>
            <textarea name="habilidades" placeholder="Habilidades" onChange={handleChange} required />
            <textarea name="experiencia" placeholder="Experiencia" onChange={handleChange} required />
            <textarea name="cursos" placeholder="Cursos y capacitaciones" onChange={handleChange} required />
            <label htmlFor="cvFile" className="file-label">Subir CV (PDF, DOC, DOCX)</label>
            <input
              id="cvFile"
              name="cvFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión aquí</Link></p>
      </form>
    </div>
  );
}
