import express from 'express';
import verifyRole from '../middleware/verifyRole.js';
import { 
  obtenerClientes, 
  obtenerClientePorId, 
  actualizarCliente, 
  borrarCliente 
} from '../controllers/controladorcliente.js';

const router = express.Router();


router.get('/', verifyRole(['Administrador']), obtenerClientes);


router.get('/:id', verifyRole(['Administrador', 'Usuario']), obtenerClientePorId);


router.put('/:id', verifyRole(['Administrador']), actualizarCliente);


router.delete('/:id', verifyRole(['Administrador']), borrarCliente);

export default router;