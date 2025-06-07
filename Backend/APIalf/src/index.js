import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import conectarDB from "./config/conexion.js";
import clientesRoutes from "./routes/clientes.js"; 
import categoriasRoutes from "./routes/categorias.js";
import detalleOrdenRoutes from "./routes/detalle_ordenes.js";
import inventarioRoutes from "./routes/inventarios.js";
import ordenRoutes from "./routes/ordenes.js";
import productoRoutes from "./routes/productos.js";
import loginRoutes from "./routes/auth.routes.js"; 
import swaggerJSDOCs from "./swagger.js";


dotenv.config();

const port = process.env.PORT || 9001;
const app = express();


conectarDB();


app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type, Authorization", 
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/clientes", clientesRoutes); 
app.use("/api/categorias", categoriasRoutes);
app.use("/api/detalle_ordenes", detalleOrdenRoutes);
app.use("/api/inventarios", inventarioRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/auth", loginRoutes); 


app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a la API </h1>");
});


swaggerJSDOCs(app, port);


app.listen(port, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${port}`);
});
