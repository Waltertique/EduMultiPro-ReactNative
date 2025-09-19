const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PUERTO = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/edumultipro", require("./routes/usuarios"));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

// Archivos estáticos (ej: imágenes)
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PUERTO}`);
});