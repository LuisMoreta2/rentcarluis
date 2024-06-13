const inspeccion_Service = require('../services/inspeccionService');

const getVehiculo_inspecciones = async (req,res) => {
    const inspeccion = await inspeccion_Service.getVehiculo_inspecciones();
    res.send(inspeccion);
};

const getVehiculo_inspeccione = async (req,res) => {
    const id = req.params.id;
    const inspeccion = await inspeccion_Service.getVehiculo_inspeccione(id);
    res.send(inspeccion);
};

const createVehiculo_inspecciones = async (req,res) => {
    const {vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id} = req.body
    const inspeccion = await inspeccion_Service.createVehiculo_inspecciones(vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id);
    res.status(201).send(inspeccion);
};

const updateVehiculo_inspeccione = async (req, res) => {
    const { id } = req.params;
    const { vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id } = req.body;
    const inspeccion = await inspeccion_Service.updateVehiculo_inspeccione(id, vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id);
    res.status(200).send(inspeccion);
};

const deleteVehiculo_inspeccione = async (req, res) => {
    const { id } = req.params;
    await inspeccion_Service.deleteVehiculo_inspeccione(id); 
    res.status(200).send({ message: 'inspeccion eliminado exitosamente' });
};

module.exports = {
    getVehiculo_inspecciones,
    getVehiculo_inspeccione,
    createVehiculo_inspecciones,
    updateVehiculo_inspeccione,
    deleteVehiculo_inspeccione
};
