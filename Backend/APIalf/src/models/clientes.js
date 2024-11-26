import mongoose from "mongoose";

const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telefono: {
        type: Number,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
});

export default mongoose.model("clientes", clienteSchema);