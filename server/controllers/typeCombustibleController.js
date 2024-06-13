const typeCombustibleService = require('../services/typeCombustibleService');

const getCombustibles = async (req,res) => {
    const combustible = await typeCombustibleService.getCombustibles();
    res.send(combustible);
};

const getCombustible = async (req,res) => {
    const id = req.params.id;
    const combustible = await typeCombustibleService.getCombustible(id);
    res.send(combustible);
};

const createCombustible = async (req,res) => {
    const {descripcion} = req.body
    const combustible = await typeCombustibleService.createCombustible(descripcion);
    res.status(201).send(combustible);
};

const updateCombustible = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const combustible = await typeCombustibleService.updateCombustible(id, descripcion);
    res.status(200).send(combustible);
};

const deleteCombustible = async (req, res) => {
    const { id } = req.params;
    await typeCombustibleService.deleteCombustible(id); 
    res.status(200).send({ message: 'Marca eliminado exitosamente' });
};

module.exports = {
    getCombustibles,
    getCombustible,
    createCombustible,
    updateCombustible,
    deleteCombustible
}