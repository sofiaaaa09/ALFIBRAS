import mongoose from "mongoose";
import bcrypt from "bcrypt";


const adminsSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  telefono: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, 
  },
  role: {
    type: String,
    required: true,
    default: "admin", 
  },
});


adminsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); 
  }
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (error) {
    next(error); 
  }
});


adminsSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};


export default mongoose.model("admins", adminsSchema);
