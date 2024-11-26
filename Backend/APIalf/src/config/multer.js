import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Los archivos se guardarán en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Asignación de un nombre único a los archivos
  }
});

const upload = multer({ storage });

export default upload;  // Exporta el objeto 'upload', no 'uploads'
