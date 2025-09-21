const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "EduMultiPro",
});

conexion.connect((error) => {
    if (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        return;
    }
    console.log("✅ Conexión a la base de datos exitosa");
});

module.exports = conexion;