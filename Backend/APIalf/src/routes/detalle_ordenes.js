import express from "express";
import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetalleOrdenPorId,
  actualizarDetalleOrden,
  borrarDetalleOrden,
} from "../controllers/controladordetalle_orden.js";
import multer from 'multer';

const routes = express.Router(); // Asegúrate de usar 'routes' aquí

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Ruta donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleOrden:
 *       type: object
 *       properties:
 *         orden_id:
 *           type: string
 *           description: ID de la orden relacionada
 *         producto_id:
 *           type: string
 *           description: ID del producto incluido en la orden
 *         categoria_id:
 *           type: string
 *           description: ID de la categoría del producto
 *         cantidad:
 *           type: number
 *           description: Cantidad del producto
 *         precio_unitario:
 *           type: number
 *           description: Precio unitario del producto
 *         personalizacion:
 *           type: string
 *           description: Personalización del producto (opcional)
 *         archivo:
 *            type: string
 *            format: binary
 *       required:
 *         - orden_id
 *         - producto_id
 *         - categoria_id
 *         - cantidad
 *         - precio_unitario
 *         - archivo
 *       example:
 *         orden_id: "12345"
 *         producto_id: "6789"
 *         categoria_id: "1113"
 *         cantidad: 2
 *         precio_unitario: 150.000
 *         personalizacion: "Matera cuadrada azul 30x30"
 *         archivo: "uploads/1677829338472.jpg"
 */

/**
 * @swagger
 * /api/detalle_ordenes:
 *   post:
 *     summary: Crea un nuevo detalle de orden
 *     tags: [detalle_ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleOrden'
 *     responses:
 *       200:
 *         description: Detalle de orden creado exitosamente
 */
routes.post('/detalle_ordenes', upload.single('archivo'), crearDetalleOrden); // Cambié 'router' por 'routes'

/**
 * @swagger
 * /api/detalle_ordenes:
 *   get:
 *     summary: Obtiene todos los detalles de las órdenes
 *     tags: [detalle_ordenes]
 *     responses:
 *       200:
 *         description: Lista de detalles de las órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleOrden'
 */
routes.get("/detalle_ordenes", obtenerDetallesOrden);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   get:
 *     summary: Obtiene un detalle de orden por ID
 *     tags: [detalle_ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle de orden
 *     responses:
 *       200:
 *         description: Información del detalle de orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleOrden'
 */
routes.get("/detalle_ordenes/:id", obtenerDetalleOrdenPorId);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   put:
 *     summary: Actualiza un detalle de orden por ID
 *     tags: [detalle_ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle de orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleOrden'
 *     responses:
 *       200:
 *         description: Detalle de orden actualizado
 */
routes.put("/detalle_ordenes/:id", actualizarDetalleOrden);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   delete:
 *     summary: Elimina un detalle de orden por ID
 *     tags: [detalle_ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle de orden
 *     responses:
 *       200:
 *         description: Detalle de orden eliminado
 *       404:
 *         description: Detalle de orden no encontrado
 */
routes.delete("/detalle_ordenes/:id", borrarDetalleOrden);

export default routes;
