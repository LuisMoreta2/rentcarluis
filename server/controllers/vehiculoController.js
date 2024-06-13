const vehiculoService = require('../services/vehiculoService');

const getVehiculos = async (req,res) => {
    const vehiculo = await vehiculoService.getVehiculos();
    res.send(vehiculo);
};

const getVehiculo = async (req,res) => {
    const id = req.params.id;
    const vehiculo = await vehiculoService.getVehiculo(id);
    res.send(vehiculo);
};

const createVehiculo = async (req,res) => {
    const {descripcion, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id} = req.body
    const vehiculo = await vehiculoService.createVehiculo(descripcion, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id);
    res.status(201).send(vehiculo);
};

const updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { descripcion, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id } = req.body;
    const vehiculo = await vehiculoService.updateVehiculo(id, descripcion, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id);
    res.status(200).send(vehiculo);
};

const deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    await vehiculoService.deleteVehiculo(id); 
    res.status(200).send({ message: 'Vehiculo eliminado exitosamente' });
};

module.exports = {
    getVehiculos,
    getVehiculo,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
};
