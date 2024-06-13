const { connectDatabase } = require('../config/database');

async function getVehiculos(){
    const [rows] = await connectDatabase.query('SELECT * FROM vehiculos')
    return rows
}

async function getVehiculo(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM vehiculos WHERE id = ?`,[id])
    return rows
}

async function createVehiculo(description, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id){
    const [result] = await connectDatabase.query(`INSERT INTO vehiculos (descripcion, chasis_number, motor_number, placa_number, vehiculo_type_id,
        marca_id, modelo_id, combustible_type_id) VALUES (?,?,?,?,?,?,?,?)`
    ,[description, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id])
    const id = result.insertId;
    return getVehiculo(id);
}

async function updateVehiculo(id, description, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id) {
    await connectDatabase.query(`UPDATE vehiculos SET descripcion = ?, chasis_number = ?, motor_number = ?, placa_number = ?, vehiculo_type_id = ?
        , marca_id = ?, modelo_id = ?, combustible_type_id = ? WHERE id = ?`, 
        [description, chasis_number, motor_number, placa_number, vehiculo_type_id, marca_id, modelo_id, combustible_type_id, id]);
    return getVehiculo(id);
}

async function deleteVehiculo(id) {
    await connectDatabase.query(`DELETE FROM vehiculos WHERE id = ?`, [id]);
    return { message: 'Vehiculo eliminado exitosamente' };
}

module.exports = {
    getVehiculos,
    getVehiculo,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
};