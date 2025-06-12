import * as controladorOrden from '../../controllers/controladororden.js';
import ordenSchema from '../../models/ordenes.js';
import detalleOrdenSchema from '../../models/detalle_ordenes.js';

jest.mock('../../models/ordenes.js');
jest.mock('../../models/detalle_ordenes.js');

// Mock para .populate()
function mockQuery(result) {
  return {
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result)
  };
}

describe('Controlador de Órdenes', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('crearOrden', () => {
    it('debe crear una orden correctamente', async () => {
      req.body = {
        cliente_correo: 'cliente@example.com',
        estado: 'pendiente',
        fecha: '2025-06-10',
        detalles: [
          {
            producto_id: 'prod1',
            producto_nombre: 'Producto A',
            categoria_nombre: 'General',
            cantidad: 2,
            precio_unitario: 100
          }
        ]
      };

      ordenSchema.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          _id: 'orden123',
          ...req.body,
          total: 200,
          numero_orden: 'ORD-20250610-001'
        })
      }));

      await controladorOrden.crearOrden[1](req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: 'ORDEN_CREADA'
      }));
    });

    it('debe retornar 400 si el cliente no incluye productos', async () => {
      req.body = {
        cliente_correo: 'cliente@example.com',
        detalles: []
      };

      await controladorOrden.crearOrden[1](req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'SIN_PRODUCTOS'
      }));
    });
  });

  describe('obtenerOrdenes', () => {
    it('debe devolver órdenes correctamente', async () => {
      ordenSchema.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue([
          { _id: '1', numero_orden: 'ORD001' }
        ])
      });

      await controladorOrden.obtenerOrdenes(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: 'ORDENES_ENCONTRADAS',
        data: expect.any(Array)
      }));
    });

    it('debe manejar error de base de datos', async () => {
      ordenSchema.find.mockImplementation(() => ({
        populate: () => {
          throw new Error('DB error');
        }
      }));

      await controladorOrden.obtenerOrdenes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'ERROR_OBTENER_ORDENES'
      }));
    });
  });

  describe('obtenerOrdenPorId', () => {
    it('debe devolver una orden por ID', async () => {
      const ordenMock = { _id: '1', numero_orden: 'ORD001' };
      req.params.id = '1';

      ordenSchema.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(ordenMock)
      });

      await controladorOrden.obtenerOrdenPorId[1](req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: ordenMock
      }));
    });

    it('debe retornar 404 si no encuentra la orden', async () => {
      req.params.id = 'noExiste';

      ordenSchema.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null)
      });

      await controladorOrden.obtenerOrdenPorId[1](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'ORDEN_NO_ENCONTRADA'
      }));
    });
  });

  describe('actualizarOrden', () => {
    it('debe actualizar correctamente una orden', async () => {
      req.params.id = 'orden123';
      req.body = {
        cliente_correo: 'cliente@correo.com',
        estado: 'completada',
        detalles: ['detalle1']
      };

      detalleOrdenSchema.find.mockResolvedValue([
        { _id: 'detalle1', cantidad: 1, precio_unitario: 100 }
      ]);

      ordenSchema.findByIdAndUpdate.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          _id: 'orden123',
          estado: 'completada'
        })
      });

      await controladorOrden.actualizarOrden[2](req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: 'ORDEN_ACTUALIZADA'
      }));
    });

    it('debe retornar 404 si la orden no existe', async () => {
      req.params.id = 'noExiste';
      req.body = {
        cliente_correo: 'cliente@correo.com',
        detalles: ['detalleX']
      };

      detalleOrdenSchema.find.mockResolvedValue([
        { _id: 'detalleX', cantidad: 1, precio_unitario: 100 }
      ]);

      ordenSchema.findByIdAndUpdate.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null)
      });

      await controladorOrden.actualizarOrden[2](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'ORDEN_NO_ENCONTRADA'
      }));
    });
  });

  describe('borrarOrden', () => {
    it('debe eliminar correctamente una orden', async () => {
      req.params.id = 'orden123';

      ordenSchema.findByIdAndDelete.mockResolvedValue({
        _id: 'orden123',
        numero_orden: 'ORD001'
      });

      await controladorOrden.borrarOrden[1](req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        code: 'ORDEN_ELIMINADA'
      }));
    });

    it('debe retornar 404 si la orden no existe', async () => {
      req.params.id = 'noExiste';

      ordenSchema.findByIdAndDelete.mockResolvedValue(null);

      await controladorOrden.borrarOrden[1](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'ORDEN_NO_ENCONTRADA'
      }));
    });
  });
});
