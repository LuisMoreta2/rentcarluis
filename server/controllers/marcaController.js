const marcaService = require('../services/marcaService');

const getMarcas = async (req,res) => {
    const marca = await marcaService.getMarcas();
    res.send(marca);
};

const getMarca = async (req,res) => {
    const id = req.params.id;
    const marca = await marcaService.getMarca(id);
    res.send(marca);
};

const createMarca = async (req,res) => {
    const {descripcion} = req.body
    const marca = await marcaService.createMarca(descripcion);
    res.status(201).send(marca);
};

const updateMarca = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const marca = await marcaService.updateMarca(id, descripcion);
    res.status(200).send(marca);
};

const deleteMarca = async (req, res) => {
    const { id } = req.params;
    await marcaService.deleteMarca(id); 
    res.status(200).send({ message: 'Marca eliminado exitosamente' });
};

module.exports = {
    getMarcas,
    getMarca,
    createMarca,
    updateMarca,
    deleteMarca
};
