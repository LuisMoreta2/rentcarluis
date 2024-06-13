const { connectDatabase } = require('../config/database');

async function getClientes(){
    const [rows] = await connectDatabase.query('SELECT * FROM clientes')
    return rows
}

async function getCliente(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM clientes WHERE id = ?`,[id])
    return rows
}

async function createCliente(nombre, cedula, tarjeta_number,credito_limit, persona_type){
    const [result] = await connectDatabase.query(`INSERT INTO clientes (nombre, cedula, tarjeta_number,credito_limit, persona_type) VALUES (?,?,?,?,?)`
    ,[nombre, cedula, tarjeta_number,credito_limit, persona_type])
    const id = result.insertId;
    return getCliente(id);
}

async function updateCliente(id, nombre, cedula, tarjeta_number,credito_limit, persona_type) {
    await connectDatabase.query(`UPDATE clientes SET nombre = ?, cedula = ?, tarjeta_number = ?, credito_limit = ?, persona_type = ? WHERE id = ?`, 
        [nombre, cedula, tarjeta_number,credito_limit, persona_type, id]);
    return getCliente(id);
}

async function deleteCliente(id) {
    await connectDatabase.query(`DELETE FROM clientes WHERE id = ?`, [id]);
    return { message: 'Cliente eliminado exitosamente' };
}

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente
};