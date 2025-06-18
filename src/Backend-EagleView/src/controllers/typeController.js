const { Type } = require('../models');

exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(types);
  } catch (error) {
    console.error("Error al obtener tipos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};