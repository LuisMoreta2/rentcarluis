const modeloService = require('../services/modeloService');
// const { getModelos, getModelo, createModelo, updateModelo, deleteModelo } = require('./database');


const getModelos =  async (req,res) => {
    const modelos = await modeloService.getModelos();
    res.send(modelos);
};

const getModelo = async (req,res) => {
    const id = req.params.id;
    const modelo = await modeloService.getModelo(id);
    res.send(modelo);
};

const createModelo = async (req,res) => {
    const { marca_id, descripcion } = req.body;
    const modelo = await modeloService.createModelo(marca_id,descripcion);
    res.status(201).send(modelo);
};

const updateModelo = async (req, res) => {
    const { id } = req.params;
    const {marca_id, descripcion } = req.body;
    const modelo = await modeloService.updateModelo(id,marca_id, descripcion);
    res.status(200).send(modelo);
};

const deleteModelo =  async (req, res) => {
    const { id } = req.params;
    await modeloService.deleteModelo(id); 
    res.status(200).send({ message: 'Modelo eliminado exitosamente' });
};

module.exports = {
    getModelos,
    getModelo,
    createModelo,
    updateModelo,
    deleteModelo
};