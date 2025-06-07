import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      
      maxPoolSize: 10,            
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,    
      connectTimeoutMS: 30000     
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectarse a MongoDB:', error.message);
    process.exit(1); 
  }
};


mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión en Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});


process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada por terminación de la aplicación');
  process.exit(0);
});

export default conectarDB;