const { connectDatabase } = require('../config/database');

async function getRentas(){
    const [rows] = await connectDatabase.query('SELECT * FROM renta')
    return rows
}

async function getRenta(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM renta WHERE id = ?`,[id])
    return rows
}

async function createRenta(empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario){
    const [result] = await connectDatabase.query(`INSERT INTO renta (empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, 
        cantidad_dias, comentario) VALUES (?,?,?,?,?,?,?,?)`
    ,[empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario])
    const id = result.insertId;
    return getRenta(id);
}

async function updateRenta(id, empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario) {
    await connectDatabase.query(`UPDATE renta SET empleado_id = ?, vehiculo_id = ?, cliente_id = ?, renta_date = ?, devolucion_date = ?
        , monto_diario = ?, cantidad_dias = ?, comentario = ? WHERE id = ?`, 
        [empleado_id, vehiculo_id, cliente_id, renta_date, devolucion_date, monto_diario, cantidad_dias, comentario, id]);
    return getRenta(id);
}

async function deleteRenta(id) {
    await connectDatabase.query(`DELETE FROM renta WHERE id = ?`, [id]);
    return { message: 'Renta eliminado exitosamente' };
}

module.exports = {
    getRentas,
    getRenta,
    createRenta,
    updateRenta,
    deleteRenta
};