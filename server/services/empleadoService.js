const { connectDatabase } = require('../config/database');

async function getEmpleados(){
    const [rows] = await connectDatabase.query('SELECT * FROM empleados')
    return rows
}

async function getEmpleado(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM empleados WHERE id = ?`,[id])
    return rows
}

async function createEmpleado(nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso){
    const [result] = await connectDatabase.query(`INSERT INTO empleados (nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso) VALUES (?,?,?,?,?)`
    ,[nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso])
    const id = result.insertId;
    return getEmpleado(id);
}

async function updateEmpleado(id, nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso) {
    await connectDatabase.query(`UPDATE empleados SET nombre = ?, cedula = ?, tanda_shift = ?, commission_percentage = ?, fecha_ingreso = ? WHERE id = ?`, 
        [nombre, cedula, tanda_shift,commission_percentage, fecha_ingreso, id]);
    return getEmpleado(id);
}

async function deleteEmpleado(id) {
    await connectDatabase.query(`DELETE FROM empleados WHERE id = ?`, [id]);
    return { message: 'Empleado eliminado exitosamente' };
}

module.exports = {
    getEmpleados,
    getEmpleado,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
};