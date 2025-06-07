import {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  borrarCliente
} from '../../controllers/controladorcliente.js';

// ✅ Mock de bcrypt para poder usar toHaveBeenCalled()
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

const bcrypt = require('bcrypt');

// ✅ Mock del modelo de cliente (ya actualizado como hicimos antes)
jest.mock('../../models/clientes.js', () => {
  const mockInstance = {
    save: jest.fn().mockImplementation(function () {
      if (this._forceError) {
        return Promise.reject(new Error('DB Error'));
      }
      return Promise.resolve({
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        direccion: this.direccion,
        rol: this.rol || 'usuario',
        password: this.password
      });
    }),
    deleteOne: jest.fn()
  };

  function MockCliente(data) {
    Object.assign(this, data);
    this.save = mockInstance.save;
    this.deleteOne = mockInstance.deleteOne;
  }

  const mockStatics = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn()
  };

  Object.assign(MockCliente, mockStatics);

  MockCliente._configure = (config) => {
    if ('findOne' in config) {
      mockStatics.findOne.mockResolvedValueOnce(config.findOne);
    }
    if ('find' in config) {
      mockStatics.find.mockResolvedValueOnce(config.find);
    }
    if ('findById' in config) {
      mockStatics.findById.mockResolvedValueOnce(config.findById);
    }
    if ('save' in config) {
      mockInstance.save.mockResolvedValueOnce(config.save);
    }
    if ('saveError' in config) {
      mockInstance.save.mockRejectedValueOnce(new Error(config.saveError));
    }
    if ('delete' in config) {
      mockInstance.deleteOne.mockResolvedValueOnce(config.delete);
    }
    if ('update' in config) {
      mockStatics.updateOne.mockResolvedValueOnce(config.update);
    }
  };

  return MockCliente;
});


const ClienteModel = require('../../models/clientes.js');


describe('Controlador de Clientes', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = (body = {}, params = {}) => ({ body, params });
    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    jest.clearAllMocks();
  });

  describe('crearCliente', () => {
    it('debería crear un cliente exitosamente sin encriptar contraseña', async () => {
      const req = mockRequest({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        telefono: '1234567890',
        direccion: 'Calle 123'
      });
      const res = mockResponse();

      ClienteModel._configure({
        findOne: null,
        save: {
          _id: '6543d5e4e4a4f4a4f4a4f4a1',
          ...req.body,
          rol: 'usuario'
        }
      });

      await crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Cliente registrado exitosamente',
        cliente: expect.objectContaining({
          email: 'juan@example.com'
        })
      }));
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('debería fallar si el email ya existe', async () => {
      const req = mockRequest({
        nombre: 'Juan Pérez',
        email: 'existente@example.com',
        password: 'password123'
      });
      const res = mockResponse();

      ClienteModel._configure({
        findOne: { email: 'existente@example.com' }
      });

      await crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El correo ya está registrado.'
      });
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      });
      const res = mockResponse();

      ClienteModel._configure({
        findOne: null,
        saveError: 'DB Error'
      });

      await crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al registrar el cliente',
        error: 'DB Error'
      });
    });
  });

  describe('obtenerClientes', () => {
    it('debería retornar todos los clientes', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockClientes = [
        { nombre: 'Cliente 1', email: 'cliente1@example.com' },
        { nombre: 'Cliente 2', email: 'cliente2@example.com' }
      ];

      ClienteModel._configure({
        find: mockClientes
      });

      await obtenerClientes(req, res);

      expect(res.json).toHaveBeenCalledWith(mockClientes);
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest();
      const res = mockResponse();

      ClienteModel.find.mockRejectedValue(new Error('DB Error'));

      await obtenerClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB Error'
      });
    });
  });

  describe('obtenerClientePorId', () => {
    it('debería retornar un cliente específico', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a1' });
      const res = mockResponse();
      const mockCliente = {
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        nombre: 'Juan Pérez',
        email: 'juan@example.com'
      };

      ClienteModel._configure({
        findById: mockCliente
      });

      await obtenerClientePorId(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCliente);
    });

    it('debería retornar 404 si cliente no existe', async () => {
      const req = mockRequest({}, { id: '000000000000000000000000' });
      const res = mockResponse();

      ClienteModel._configure({
        findById: null
      });

      await obtenerClientePorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente no encontrado"
      });
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a1' });
      const res = mockResponse();

      ClienteModel.findById.mockRejectedValue(new Error('DB Error'));

      await obtenerClientePorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB Error'
      });
    });
  });

  describe('actualizarCliente', () => {
    it('debería actualizar un cliente existente', async () => {
      const req = mockRequest(
        { nombre: 'Juan Pérez Actualizado', telefono: '987654321' },
        { id: '6543d5e4e4a4f4a4f4a4f4a1' }
      );
      const res = mockResponse();

      const mockClienteExistente = {
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        save: jest.fn().mockResolvedValue({
          _id: '6543d5e4e4a4f4a4f4a4f4a1',
          nombre: 'Juan Pérez Actualizado',
          email: 'juan@example.com',
          telefono: '987654321'
        })
      };

      ClienteModel._configure({
        findById: mockClienteExistente
      });

      await actualizarCliente[2](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente actualizado correctamente"
      });
    });

    it('debería retornar 404 si cliente no existe', async () => {
      const req = mockRequest(
        { nombre: 'Cliente Inexistente' },
        { id: '000000000000000000000000' }
      );
      const res = mockResponse();

      ClienteModel._configure({
        findById: null
      });

      await actualizarCliente[2](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente no encontrado"
      });
    });

    it('debería manejar errores de base de datos al guardar', async () => {
      const req = mockRequest(
        { nombre: 'Juan Pérez Error' },
        { id: '6543d5e4e4a4f4a4f4a4f4a1' }
      );
      const res = mockResponse();

      const mockClienteExistente = {
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        nombre: 'Juan Pérez',
        save: jest.fn().mockRejectedValue(new Error('DB Error'))
      };

      ClienteModel._configure({
        findById: mockClienteExistente
      });

      await actualizarCliente[2](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB Error'
      });
    });
  });

  describe('borrarCliente', () => {
    it('debería eliminar un cliente existente', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a1' });
      const res = mockResponse();

      const mockClienteExistente = {
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
      };

      ClienteModel._configure({
        findById: mockClienteExistente
      });

      await borrarCliente[1](req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente eliminado correctamente"
      });
    });

    it('debería retornar 404 si cliente no existe', async () => {
      const req = mockRequest({}, { id: '000000000000000000000000' });
      const res = mockResponse();

      ClienteModel._configure({
        findById: null
      });

      await borrarCliente[1](req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente no encontrado"
      });
    });

    it('debería manejar errores de base de datos', async () => {
      const req = mockRequest({}, { id: '6543d5e4e4a4f4a4f4a4f4a1' });
      const res = mockResponse();

      const mockClienteExistente = {
        _id: '6543d5e4e4a4f4a4f4a4f4a1',
        deleteOne: jest.fn().mockRejectedValue(new Error('DB Error'))
      };

      ClienteModel._configure({
        findById: mockClienteExistente
      });

      await borrarCliente[1](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB Error'
      });
    });
  });
});