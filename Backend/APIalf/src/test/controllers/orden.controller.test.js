import { crearOrden, obtenerOrdenes, obtenerOrdenPorId, actualizarOrden, eliminarOrden } from '../../controllers/controladororden.js';
import mongoose from 'mongoose';

// ✅ PRIMERO: define los mocks
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSave = jest.fn();

// ✅ LUEGO: haz el mock del modelo
jest.mock('../../models/ordenes', () => ({
  __esModule: true,
  default: jest.fn(() => ({ save: mockSave })),
  find: mockFind,
  findById: mockFindById,
  findByIdAndUpdate: mockFindByIdAndUpdate,
  findByIdAndDelete: mockFindByIdAndDelete
}));


import ordenSchema from '../../models/ordenes.js';

// Mock del modelo detalleOrdenSchema
jest.mock('../../models/detalle_ordenes.js', () => {
  const mockDetalleDocs = [
    { producto: { nombre: 'Producto 1' }, cantidad: 2 },
    { producto: { nombre: 'Producto 2' }, cantidad: 3 }
  ];
  return {
    find: jest.fn().mockResolvedValue(mockDetalleDocs)
  };
});

describe('Controlador de órdenes', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearOrden', () => {
    it('debería crear una orden correctamente', async () => {
      const req = {
        body: {
          cliente: new mongoose.Types.ObjectId(),
          fecha: new Date(),
          estado: 'pendiente',
          detalles: [new mongoose.Types.ObjectId()]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockSave.mockResolvedValue({ _id: 'orden123' });

      await crearOrden(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'orden123' });
    });

    it('debería manejar errores al crear una orden', async () => {
      const req = {
        body: {
          cliente: new mongoose.Types.ObjectId(),
          fecha: new Date(),
          estado: 'pendiente',
          detalles: [new mongoose.Types.ObjectId()]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const error = new Error('Error al guardar');
      mockSave.mockRejectedValue(error);

      await crearOrden(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear la orden', error: error.message });
    });
  });

  describe('obtenerOrdenes', () => {
    it('debería retornar todas las órdenes', async () => {
      const ordenesMock = [{ _id: 'orden1' }, { _id: 'orden2' }];
      mockFind.mockResolvedValue(ordenesMock);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerOrdenes({}, res);

      expect(mockFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(ordenesMock);
    });

    it('debería manejar errores al obtener órdenes', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockFind.mockRejectedValue(new Error('Error DB'));

      await obtenerOrdenes({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al obtener las órdenes' });
    });
  });

  describe('obtenerOrdenPorId', () => {
    it('debería retornar una orden por ID', async () => {
      const ordenMock = { _id: 'orden123' };
      mockFindById.mockResolvedValue(ordenMock);

      const req = { params: { id: 'orden123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerOrdenPorId(req, res);

      expect(mockFindById).toHaveBeenCalledWith('orden123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(ordenMock);
    });

    it('debería retornar 404 si la orden no existe', async () => {
      mockFindById.mockResolvedValue(null);

      const req = { params: { id: 'ordenInexistente' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerOrdenPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Orden no encontrada' });
    });

    it('debería manejar errores al buscar orden por ID', async () => {
      mockFindById.mockRejectedValue(new Error('Error DB'));

      const req = { params: { id: 'orden123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await obtenerOrdenPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al obtener la orden' });
    });
  });

  describe('actualizarOrden', () => {
    it('debería actualizar una orden por ID', async () => {
      const ordenActualizada = { _id: 'orden123', estado: 'enviado' };
      mockFindByIdAndUpdate.mockResolvedValue(ordenActualizada);

      const req = {
        params: { id: 'orden123' },
        body: { estado: 'enviado' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarOrden(req, res);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('orden123', { estado: 'enviado' }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(ordenActualizada);
    });

    it('debería manejar errores al actualizar', async () => {
      mockFindByIdAndUpdate.mockRejectedValue(new Error('Error al actualizar'));

      const req = {
        params: { id: 'orden123' },
        body: { estado: 'enviado' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await actualizarOrden(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al actualizar la orden' });
    });
  });

  describe('eliminarOrden', () => {
    it('debería eliminar una orden por ID', async () => {
      mockFindByIdAndDelete.mockResolvedValue({ _id: 'orden123' });

      const req = { params: { id: 'orden123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarOrden(req, res);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith('orden123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Orden eliminada correctamente' });
    });

    it('debería retornar 404 si la orden no existe', async () => {
      mockFindByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'ordenInexistente' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarOrden(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Orden no encontrada' });
    });

    it('debería manejar errores al eliminar', async () => {
      mockFindByIdAndDelete.mockRejectedValue(new Error('Error al eliminar'));

      const req = { params: { id: 'orden123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await eliminarOrden(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al eliminar la orden' });
    });
  });
});
