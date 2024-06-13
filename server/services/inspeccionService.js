const { connectDatabase } = require('../config/database');

async function getVehiculo_inspecciones(){
    const [rows] = await connectDatabase.query('SELECT * FROM vehiculo_inspecciones')
    return rows
}

async function getVehiculo_inspeccione(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM vehiculo_inspecciones WHERE id = ?`,[id])
    return rows
}

async function createVehiculo_inspecciones(vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id){
    const [result] = await connectDatabase.query(`INSERT INTO vehiculo_inspecciones (vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ,[vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id])
    const id = result.insertId;
    return getVehiculo_inspeccione(id);
}

async function updateVehiculo_inspeccione(id, vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id) {
    await connectDatabase.query(`UPDATE vehiculo_inspecciones SET vehiculo_id = ?, cliente_id = ?, tiene_ralladuras = ?, cantidad_combustible = ?, 
        tiene_goma_repuesto = ?, tiene_gato = ?, tiene_vidrios_rotos = ?,condicion_goma_delantera_izquierda = ?,condicion_goma_delantera_derecha = ?,
        condicion_goma_trasera_izquierda = ?, condicion_goma_trasera_derecha = ?, inspeccion_date = ?, inspeccion_employee_id = ? WHERE id = ?`, 
        [vehiculo_id, cliente_id, tiene_ralladuras,cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_vidrios_rotos,
    condicion_goma_delantera_izquierda, condicion_goma_delantera_derecha, condicion_goma_trasera_izquierda, condicion_goma_trasera_derecha,
    inspeccion_date, inspeccion_employee_id, id]);
    return getVehiculo_inspeccione(id);
}

async function deleteVehiculo_inspeccione(id) {
    await connectDatabase.query(`DELETE FROM vehiculo_inspecciones WHERE id = ?`, [id]);
    return { message: 'Vehiculo inspeccionado eliminado exitosamente' };
}

module.exports = {
    getVehiculo_inspecciones,
    getVehiculo_inspeccione,
    createVehiculo_inspecciones,
    updateVehiculo_inspeccione,
    deleteVehiculo_inspeccione
};