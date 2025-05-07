import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Para poder usar __dirname en módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del servidor
const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors());

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Ruta para subir archivo
app.post("/upload", upload.single("cv"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se envió ningún archivo" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ message: "Archivo subido correctamente", filePath });
});

// Hacer accesibles los archivos subidos
app.use("/uploads", express.static(uploadDir));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
