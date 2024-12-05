import express from "express";
import clientesRoutes from "./routes/clientes.js"; 
import adminsRoutes from "./routes/admins.js"; 
import categoriasRoutes from "./routes/categorias.js";
import carritoRoutes from "./routes/carritos.js";
import detalleOrdenes from "./routes/detalle_ordenes.js";
import envioRoutes from "./routes/envios.js";
import facturaRoutes from "./routes/facturas.js";
import inventarioRoutes from "./routes/inventarios.js";
import ordenRoutes from "./routes/ordenes.js";
import productoRoutes from "./routes/productos.js";
import swaggerJSDOCs from "./swagger.js";
import bodyParser from "body-parser";
import cors from "cors";
import conectarDB from "./config/conexion.js";

// Definir el puerto
const port = process.env.PORT || 9001;

const app = express();


app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type, Authorization", 
}));

// Habilitar body-parser para analizar JSON
app.use(bodyParser.json());
app.use(express.json());

// Usar las rutas
app.use("/api", clientesRoutes);  
app.use("/api", adminsRoutes);    
app.use("/api", categoriasRoutes);
app.use("/api", carritoRoutes);
app.use("/api", detalleOrdenes);
app.use("/api", envioRoutes);
app.use("/api", facturaRoutes);
app.use("/api", inventarioRoutes);
app.use("/api", ordenRoutes);
app.use("/api", productoRoutes);

// Usar body-parser para formularios URL encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
conectarDB();

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a la API </h1>");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  // Configurar Swagger Docs en la ruta /api-docs
  swaggerJSDOCs(app, 9001);
});
