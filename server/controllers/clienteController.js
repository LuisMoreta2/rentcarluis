const clienteService = require('../services/clienteService');

const getClientes = async (req,res) => {
    const cliente = await clienteService.getClientes();
    res.send(cliente);
};

const getCliente = async (req,res) => {
    const id = req.params.id;
    const cliente = await clienteService.getCliente(id);
    res.send(cliente);
};

const createCliente = async (req,res) => {
    const {nombre, cedula, tarjeta_number,credito_limit, persona_type} = req.body
    const cliente = await clienteService.createCliente(nombre, cedula, tarjeta_number,credito_limit, persona_type);
    res.status(201).send(cliente);
};

const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, cedula, tarjeta_number,credito_limit, persona_type } = req.body;
    const cliente = await clienteService.updateCliente(id, nombre, cedula, tarjeta_number,credito_limit, persona_type);
    res.status(200).send(cliente);
};

const deleteCliente = async (req, res) => {
    const { id } = req.params;
    await clienteService.deleteCliente(id); 
    res.status(200).send({ message: 'Cliente eliminado exitosamente' });
};

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente
};
