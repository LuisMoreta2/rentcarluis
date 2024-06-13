const rentaService = require('../services/rentaService');

const getRentas = async (req,res) => {
    const renta = await rentaService.getRentas();
    res.send(renta);
};

const getRenta = async (req,res) => {
    const id = req.params.id;
    const renta = await rentaService.getRenta(id);
    res.send(renta);
};

const createRenta = async (req,res) => {
    const {empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario} = req.body
    const renta = await rentaService.createRenta(empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario);
    res.status(201).send(renta);
};

const updateRenta = async (req, res) => {
    const { id } = req.params;
    const { empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario } = req.body;
    const renta = await rentaService.updateRenta(id, empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario);
    res.status(200).send(renta);
};

const deleteRenta = async (req, res) => {
    const { id } = req.params;
    await rentaService.deleteRenta(id); 
    res.status(200).send({ message: 'Renta eliminado exitosamente' });
};

module.exports = {
    getRentas,
    getRenta,
    createRenta,
    updateRenta,
    deleteRenta
};
