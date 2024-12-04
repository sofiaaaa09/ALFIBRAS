const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const roles = user.roles.map(role => role.name); // Asegúrate de que esto sea correcto según tu modelo

        const token = jwt.sign({ id: user._id, name: user.name, roles }, process.env.JWT_SECRET, { expiresIn: '12h' });
        console.log(token); // Para verificar el token en jwt.io

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};