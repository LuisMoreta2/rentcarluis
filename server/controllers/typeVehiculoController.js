const typeVehiculoService = require('../services/typeVehiculoService.js');


const getTypevehiculos = async (req,res) => {
    const typevehiculos = await typeVehiculoService.getTypevehiculos();
    res.send(typevehiculos);
};

const getTypevehiculo = async (req,res) => {
    const id = req.params.id;
    const typevehiculo = await typeVehiculoService.getTypevehiculo(id);
    res.send(typevehiculo);
};

const createTypevehiculos = async (req,res) => {
    const {descripcion} = req.body
    const createtypevehiculo = await typeVehiculoService.createTypevehiculos(descripcion);
    res.status(201).send(createtypevehiculo);
};

const updateTypevehiculo = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const updatedTypevehiculo = await typeVehiculoService.updateTypevehiculo(id, descripcion);
    res.status(200).send(updatedTypevehiculo);
};

const deleteTypevehiculo = async (req, res) => {
    const { id } = req.params;
    await typeVehiculoService.deleteTypevehiculo(id); 
    res.status(200).send({ message: 'Tipo de vehículo eliminado exitosamente' });
};

module.exports = {
    getTypevehiculos,
    getTypevehiculo,
    createTypevehiculos,
    updateTypevehiculo,
    deleteTypevehiculo
}