import bcrypt from 'bcrypt';
import Admin from '../../models/admins.js';

jest.mock('bcrypt');

describe('Modelo Admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Esquema', () => {
    it('debería requerir nombre, email, teléfono y password', () => {
      const admin = new Admin({
        nombre: 'Admin Test',
        email: 'admin@test.com',
        telefono: '1234567890',
        password: 'password123'
      });

      expect(admin.nombre).toBe('Admin Test');
      expect(admin.email).toBe('admin@test.com');
      expect(admin.telefono).toBe('1234567890');
      expect(admin.password).toBe('password123');
      expect(admin.role).toBe('admin'); // Valor por defecto
    });

    it('debería fallar si falta un campo requerido', () => {
      const admin = new Admin({});
      const error = admin.validateSync();

      expect(error.errors['nombre']).toBeDefined();
      expect(error.errors['email']).toBeDefined();
      expect(error.errors['telefono']).toBeDefined();
      expect(error.errors['password']).toBeDefined();
    });
  });

  describe('Hooks', () => {
    it('debería encriptar la contraseña antes de guardar', async () => {
      const admin = new Admin({
        nombre: 'Admin Test',
        email: 'admin@test.com',
        telefono: '1234567890',
        password: 'password123'
      });

      bcrypt.genSalt.mockResolvedValue('salt123');
      bcrypt.hash.mockResolvedValue('hashedPassword123');

      await admin.validate(); // Simula validación
      await admin.save();     // Ejecuta el hook de pre('save')

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt123');
      expect(admin.password).toBe('hashedPassword123');
    });

    it('no debería encriptar la contraseña si no fue modificada', async () => {
      const admin = new Admin({
        nombre: 'Admin Test',
        email: 'admin@test.com',
        telefono: '1234567890',
        password: 'hashedPassword123'
      });

      // Simulamos que la contraseña no ha sido modificada
      admin.isModified = jest.fn().mockReturnValue(false);

      await admin.validate(); // Asegura que pasa validación
      await admin.save();     // Ejecuta el hook, pero no debería llamar a hash

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('Métodos', () => {
    it('debería comparar contraseñas correctamente', async () => {
      const admin = new Admin({
        nombre: 'Admin Test',
        email: 'admin@test.com',
        telefono: '1234567890',
        password: 'hashedPassword123'
      });

      bcrypt.compare.mockResolvedValue(true);
      const result = await admin.comparePassword('password123');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(result).toBe(true);
    });
  });
});
