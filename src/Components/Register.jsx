import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    dni: "",
    telefono: "",
    email: "",
    legajo: "",
    password: "",
    carrera: "",
    habilidades: "",
    experiencia: "",
    cursos: "",
    fechaNacimiento: "",
    cvFilename: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setCvFile(e.target.files[0]);

  const validate = () => {
    const newErrors = {};
    if (!/^[0-9]{8}$/.test(formData.dni)) newErrors.dni = "El DNI debe tener 8 números.";
    if (!/^[0-9]{10}$/.test(formData.telefono)) newErrors.telefono = "El teléfono debe tener 10 números (sin 15).";
    if (!/^[0-9]{5}$/.test(formData.legajo)) newErrors.legajo = "El legajo debe tener 5 números.";

    const fechaPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const fechaMatch = formData.fechaNacimiento.match(fechaPattern);
    if (!fechaMatch) {
      newErrors.fechaNacimiento = "La fecha debe tener el formato dd-mm-yyyy.";
    } else {
      const dia = parseInt(fechaMatch[1], 10);
      const mes = parseInt(fechaMatch[2], 10);
      const anio = parseInt(fechaMatch[3], 10);
      const fecha = new Date(`${anio}-${mes}-${dia}`);
      if (
        fecha.getFullYear() !== anio ||
        fecha.getMonth() + 1 !== mes ||
        fecha.getDate() !== dia
      ) {
        newErrors.fechaNacimiento = "La fecha ingresada no es válida.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleRegister = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    let cvFilePath = ""; // Variable para almacenar la ruta del archivo

    if (cvFile) {
      const formDataFile = new FormData();
      formDataFile.append("cv", cvFile);

      const response = await axios.post("http://localhost:3000/uploads", formDataFile, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      cvFilePath = response.data.filePath;
    }

    const { email, password, ...perfil } = formData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
  
    await set(dbRef(database, "usuarios/" + uid), {
      ...perfil,
      email,
      uid,
      cvFilename: cvFilePath // Usamos la variable directamente
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
            <label>Nombre y Apellido<input name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required /></label>
            <label>DNI<input name="dni" value={formData.dni} onChange={handleChange} required />{errors.dni && <span className="error">{errors.dni}</span>}</label>
            <label>Teléfono<input name="telefono" value={formData.telefono} onChange={handleChange} required />{errors.telefono && <span className="error">{errors.telefono}</span>}</label>
            <label>Correo electrónico<input name="email" type="email" value={formData.email} onChange={handleChange} required /></label>
            <label>Contraseña<input name="password" type="password" value={formData.password} onChange={handleChange} required minLength="6" /></label>
            <label>Legajo<input name="legajo" value={formData.legajo} onChange={handleChange} required />{errors.legajo && <span className="error">{errors.legajo}</span>}</label>
            <label>Fecha de nacimiento (dd-mm-yyyy)<input name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />{errors.fechaNacimiento && <span className="error">{errors.fechaNacimiento}</span>}</label>
            <label>Carrera
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
            </label>
          </div>

          <div className="column-right">
            <h3>Datos Laborales</h3>
            <label>Habilidades<textarea name="habilidades" value={formData.habilidades} onChange={handleChange} required /></label>
            <label>Experiencia<textarea name="experiencia" value={formData.experiencia} onChange={handleChange} required /></label>
            <label>Cursos y capacitaciones<textarea name="cursos" value={formData.cursos} onChange={handleChange} required /></label>
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
