import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetalleOrdenPorId,
  actualizarDetalleOrden,
  borrarDetalleOrden
} from '../../controllers/controladordetalle_orden.js';

import detalleOrdenSchema from '../../models/detalle_ordenes.js';
import productoSchema from '../../models/productos.js';
import ordenSchema from '../../models/ordenes.js';

jest.mock('../../models/detalle_ordenes.js');
jest.mock('../../models/productos.js');
jest.mock('../../models/ordenes.js');

// Mock funciones
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockProductoFind = jest.fn();
const mockOrdenFindOne = jest.fn();

detalleOrdenSchema.mockImplementation(() => ({
  save: mockSave
}));

detalleOrdenSchema.find = mockFind;
detalleOrdenSchema.findById = mockFindById;
detalleOrdenSchema.findByIdAndUpdate = mockFindByIdAndUpdate;
detalleOrdenSchema.findByIdAndDelete = mockFindByIdAndDelete;

productoSchema.find = mockProductoFind;
ordenSchema.findOne = mockOrdenFindOne;

describe('Controlador DetalleOrden', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockSave.mockReset();
    mockFind.mockReset();
    mockFindById.mockReset();
    mockFindByIdAndUpdate.mockReset();
    mockFindByIdAndDelete.mockReset();
    mockProductoFind.mockReset();
    mockOrdenFindOne.mockReset();
  });

  describe('obtenerDetallesOrden', () => {
    it('debe retornar detalles si existen', async () => {
      mockFind.mockResolvedValue([{ numero_orden: '1' }]);

      await obtenerDetallesOrden(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: "DETALLES_ENCONTRADOS"
      }));
    });

    it('debe retornar 404 si no hay detalles', async () => {
      mockFind.mockResolvedValue([]);

      await obtenerDetallesOrden(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        code: "NO_ENCONTRADOS"
      }));
    });
  });

  describe('obtenerDetalleOrdenPorId', () => {
    it('debe retornar un detalle por ID', async () => {
      const mockDetalle = { numero_orden: '1' };
      mockFindById.mockResolvedValue(mockDetalle);
      req.params.id = 'abc123';

      await obtenerDetalleOrdenPorId(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockDetalle
      }));
    });

    it('debe retornar 404 si el detalle no existe', async () => {
      mockFindById.mockResolvedValue(null);
      req.params.id = 'noExiste';

      await obtenerDetalleOrdenPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: "DETALLE_NO_ENCONTRADO"
      }));
    });
  });

  describe('actualizarDetalleOrden', () => {
    it('debe actualizar correctamente un detalle', async () => {
      req.params.id = 'detalle123';
      req.body = {
        productos: [{ numero_producto: "1", cantidad: 1, precio_unitario: 1000 }],
        total: 1000,
        personalizacion: "color azul",
        archivo: null
      };

      const mockUpdated = { _id: "detalle123", ...req.body };
      mockFindByIdAndUpdate.mockResolvedValue(mockUpdated);

      await actualizarDetalleOrden[2](req, res); // Ejecutamos el tercer middleware (controlador real)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockUpdated
      }));
    });

    it('debe retornar 404 si el detalle no existe', async () => {
      req.params.id = 'noExiste';
      req.body = { productos: [{ numero_producto: "1", cantidad: 1, precio_unitario: 1000 }], total: 1000 };
      mockFindByIdAndUpdate.mockResolvedValue(null);

      await actualizarDetalleOrden[2](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: "DETALLE_NO_ENCONTRADO"
      }));
    });
  });

  describe('borrarDetalleOrden', () => {
    it('debe eliminar un detalle correctamente', async () => {
      req.params.id = 'abc123';
      const mockDetalle = { _id: "abc123", numero_orden: "1" };
      mockFindByIdAndDelete.mockResolvedValue(mockDetalle);

      await borrarDetalleOrden[1](req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: "DETALLE_ELIMINADO"
      }));
    });

    it('debe retornar 404 si el detalle no existe', async () => {
      req.params.id = 'noExiste';
      mockFindByIdAndDelete.mockResolvedValue(null);

      await borrarDetalleOrden[1](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: "DETALLE_NO_ENCONTRADO"
      }));
    });
  });
});
