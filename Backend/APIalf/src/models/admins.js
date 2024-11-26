
import mongoose from "mongoose";
const adminsSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telefono: {
        type: Number,
        required: true,
    }
});

export default mongoose.model("admins", adminsSchema);