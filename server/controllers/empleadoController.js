const empleadoService = require('../services/empleadoService');

const getEmpleados = async (req,res) => {
    const empleado = await empleadoService.getEmpleados();
    res.send(empleado);
};

const getEmpleado = async (req,res) => {
    const id = req.params.id;
    const empleado = await empleadoService.getEmpleado(id);
    res.send(empleado);
};

const createEmpleado = async (req,res) => {
    const {nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso} = req.body
    const empleado = await empleadoService.createEmpleado(nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso);
    res.status(201).send(empleado);
};

const updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso } = req.body;
    const empleado = await empleadoService.updateEmpleado(id, nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso);
    res.status(200).send(empleado);
};

const deleteEmpleado = async (req, res) => {
    const { id } = req.params;
    await empleadoService.deleteEmpleado(id); 
    res.status(200).send({ message: 'Empleado eliminado exitosamente' });
};

module.exports = {
    getEmpleados,
    getEmpleado,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
};
