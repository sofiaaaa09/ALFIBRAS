import { crearCategoria, obtenerCategorias } from '../../controllers/controladorcategoria.js';
import Categoria from '../../models/categorias.js';

jest.mock('../../models/categorias.js');

describe('Controlador de Categorías', () => {
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

  describe('crearCategoria', () => {
    it('debería crear una categoría exitosamente', async () => {
      const req = mockRequest({
        nombre_categoria: 'Nueva Categoría',
        descripcion: 'Descripción de prueba',
        estado: 'activa'
      });
      const res = mockResponse();

      // Mock de Mongoose
      Categoria.prototype.save.mockResolvedValue({
        _id: '1',
        ...req.body
      });

      await crearCategoria[1](req, res); // [1] es la función del middleware

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nombre_categoria: 'Nueva Categoría'
      }));
    });
  });

  describe('obtenerCategorias', () => {
    it('debería retornar todas las categorías', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockCategorias = [
        { _id: '1', nombre_categoria: 'Cat 1' },
        { _id: '2', nombre_categoria: 'Cat 2' }
      ];

      Categoria.find.mockResolvedValue(mockCategorias);

      await obtenerCategorias(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCategorias);
    });
  });
});