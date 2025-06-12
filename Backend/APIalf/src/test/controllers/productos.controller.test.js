import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  borrarProducto
} from '../../controllers/controladorproducto.js';

// Mock completo del modelo de productos
jest.mock('../../models/productos.js', () => {
  // Mock de las instancias
  const mockInstance = {
    save: jest.fn().mockImplementation(function() {
      if (this._forceError) {
        return Promise.reject(new Error('DB Error'));
      }
      return Promise.resolve({
        _id: '6543d5e4e4a4f4a4f4a4f4a5',
        numero_producto: this.numero_producto || 101,
        ...this
      });
    })
  };

  // Función constructora mock
  function MockProducto(data) {
    Object.assign(this, data);
    this.save = mockInstance.save;
  }

  // Métodos estáticos
  const mockStatics = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    sort: jest.fn(),
    populate: jest.fn().mockImplementation(function() {
      return Promise.resolve(this._mockResult || null);
    })
  };

  // Asignar métodos estáticos
  Object.assign(MockProducto, mockStatics);

  // Helper para configurar resultados
  MockProducto._configure = (config) => {
    if (config.findOne) {
      mockStatics.findOne.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(config.findOne)
      });
    }
    if (config.find) {
      mockStatics.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(config.find)
      });
    }
    if (config.findById) {
      mockStatics.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(config.findById)
      });
    }
    if (config.save) {
      mockInstance.save.mockResolvedValueOnce(config.save);
    }
    if (config.saveError) {
      mockInstance.save.mockRejectedValueOnce(new Error(config.saveError));
    }
    if (config.delete) {
      mockStatics.deleteOne.mockResolvedValueOnce(config.delete);
    }
    if (config.update) {
      mockStatics.updateOne.mockResolvedValueOnce(config.update);
    }
  };

  return MockProducto;
});

const ProductoModel = require('../../models/productos.js');

describe('Controlador de Productos', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    // Configuración básica para req/res
    mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });
    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    // Resetear todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('crearProducto', () => {
    it('debería crear producto con número autoincremental correctamente', async () => {
      const req = mockRequest({
        nombre: 'Puerta trafic',
        descripcion: 'Puerta para trafic 30x30',
        precio: 250000,
        categoria: '6543d5e4e4a4f4a4f4a4f4a4',
        cantidad_inicial: 15,
        stock_min: 5,
        stock_max: 30
      });
      const res = mockResponse();

      // Configurar mocks
      ProductoModel._configure({
        findOne: { numero_producto: 100 },
        save: {
          _id: '6543d5e4e4a4f4a4f4a4f4a5',
          numero_producto: 101,
          ...req.body
        }
      });

      await crearProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        numero_producto: 101
      }));
    });

    it('debería manejar error cuando se envía numero_producto', async () => {
      const req = mockRequest({
        numero_producto: 999,
        nombre: 'Producto inválido'
      });
      const res = mockResponse();

      await crearProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No se debe enviar el campo numero_producto. Se asignará automáticamente."
      });
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest({
        nombre: 'Producto con error',
        precio: 10000
      });
      const res = mockResponse();

      // Configurar mock para error
      ProductoModel._configure({
        findOne: { numero_producto: 100 },
        saveError: 'DB Error'
      });

      await crearProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB Error'
      });
    });
  });

  describe('obtenerProductos', () => {
    it('debería retornar todos los productos con populate', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockProductos = [
        { _id: '1', nombre: 'Martillo', categoria: { nombre_categoria: 'Herramientas' } },
        { _id: '2', nombre: 'Destornillador', categoria: { nombre_categoria: 'Herramientas' } }
      ];

      // Configurar mock
      ProductoModel._configure({
        find: mockProductos
      });

      await obtenerProductos(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProductos);
    });
  });

  describe('obtenerProductoPorId', () => {
    it('debería retornar un producto específico con populate', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a4' });
      const res = mockResponse();
      const mockProducto = {
        _id: '6543d5e4e4a4f4a4f4a4f4a4',
        nombre: 'Puerta trafic',
        categoria: { nombre_categoria: 'Puertas' }
      };

      // Configurar mock
      ProductoModel._configure({
        findById: mockProducto
      });

      await obtenerProductoPorId(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProducto);
    });

    it('debería retornar 404 si producto no existe', async () => {
      const req = mockRequest({}, { id: '000000000000000000000000' });
      const res = mockResponse();

      // Configurar mock
      ProductoModel._configure({
        findById: null
      });

      await obtenerProductoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Producto no encontrado"
      });
    });
  });

  describe('actualizarProducto', () => {
    it('debería actualizar un producto existente', async () => {
      const req = mockRequest(
        { nombre: 'Martillo actualizado', precio: 20000 },
        { id: '6543d5e4e4a4f4a4f4a4f4a4' }
      );
      const res = mockResponse();

      // Configurar mock
      ProductoModel._configure({
        update: { matchedCount: 1 }
      });

      await actualizarProducto[2](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(ProductoModel.updateOne).toHaveBeenCalledWith(
        { _id: '6543d5e4e4a4f4a4f4a4f4a4' },
        { $set: { nombre: 'Martillo actualizado', precio: 20000 } }
      );
    });

    it('debería retornar 404 si producto no existe', async () => {
      const req = mockRequest(
        { nombre: 'Producto inexistente' },
        { id: '000000000000000000000000' }
      );
      const res = mockResponse();

      // Configurar mock
      ProductoModel._configure({
        update: { matchedCount: 0 }
      });

      await actualizarProducto[2](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('borrarProducto', () => {
    it('debería eliminar un producto existente', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a4' });
      const res = mockResponse();

      // Configurar mock
      ProductoModel._configure({
        delete: { deletedCount: 1 }
      });

      await borrarProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Producto eliminado correctamente"
      });
    });

    it('debería retornar 404 si producto no existe', async () => {
      const req = mockRequest({}, { id: '000000000000000000000000' });
      const res = mockResponse();

      // Configurar mock
      ProductoModel._configure({
        delete: { deletedCount: 0 }
      });

      await borrarProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a4' });
      const res = mockResponse();

      // Configurar mock para error
      ProductoModel.deleteOne.mockRejectedValue(new Error('DB Error'));

      await borrarProducto[1](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});