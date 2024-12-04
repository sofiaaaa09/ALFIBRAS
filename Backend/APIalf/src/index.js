import express from "express";
import clientesRoutes from "./routes/clientes.js"; 
import adminsRoutes from "./routes/admins.js"; 
import categoriasRoutes from "./routes/categorias.js";
import carritoRoutes from "./routes/carritos.js";
import detalleOrdenRoutes from "./routes/detalle_ordenes.js";
import envioRoutes from "./routes/envios.js";
import facturaRoutes from "./routes/facturas.js";
import inventarioRoutes from "./routes/inventarios.js";
import ordenRoutes from "./routes/ordenes.js";
import productoRoutes from "./routes/productos.js";
import loginRoutes from "./routes/logins.js"; // Rutas de autenticación
import swaggerJSDOCs from "./swagger.js";
import bodyParser from "body-parser";
import cors from "cors";
import conectarDB from "./config/conexion.js";

const port = process.env.PORT || 9001;

const app = express();

// Middleware de CORS
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type, Authorization", 
}));

// Middleware de body parser
app.use(bodyParser.json());
app.use(express.json());

// Rutas de la API
app.use("/api/clientes", clientesRoutes);  
app.use("/api/admins", adminsRoutes);    
app.use("/api/categorias", categoriasRoutes);
app.use("/api/carritos", carritoRoutes);
app.use("/api/detalle_ordenes", detalleOrdenRoutes);
app.use("/api/envios", envioRoutes);
app.use("/api/facturas", facturaRoutes);
app.use("/api/inventarios", inventarioRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/auth", loginRoutes); 

// Middleware para URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
conectarDB();

// Configuración de Swagger
const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

// Ruta principal
app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a la API </h1>");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  // Configurar Swagger Docs en la ruta /api-docs
  swaggerJSDOCs(app, port);
});
