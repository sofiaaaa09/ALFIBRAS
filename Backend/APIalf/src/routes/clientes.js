import express from "express";
import {
  actualizarCliente,
  borrarCliente,
  crearCliente,
  obtenerClientePorId,
  obtenerClientes,
} from "../controllers/controladorcliente.js";


const routes = express.Router();

/**
 * @swagger
* components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del Cliente
 *         email:
 *           type: string
 *           description: Email del Cliente
 *         telefono:
 *           type: number
 *           description: Teléfono del Cliente
 *         direccion:
 *           type: string
 *           description: Dirección del Cliente
 *       required:
 *         - nombre
 *         - email
 *         - telefono
 *         - direccion
 *       example:
 *         nombre: "Juan Perez"
 *         email: "juan_perez@gmail.com"
 *         telefono: 3267890432
 *         direccion: "Calle Falsa 123"
 */

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente creado exitosamente
 */
routes.post("/clientes", crearCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
routes.get("/clientes", obtenerClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Información del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 */
routes.get("/clientes/:id", obtenerClientePorId);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente por ID
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
routes.put("/clientes/:id", actualizarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente por ID
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
routes.delete("/clientes/:id", borrarCliente);

export default routes;
