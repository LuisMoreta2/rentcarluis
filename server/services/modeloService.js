const { connectDatabase } = require('../config/database');

async function getModelos(){
    const [rows] = await connectDatabase.query('SELECT * FROM modelos')
    return rows
}

async function getModelo(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM modelos WHERE id = ?`,[id])
    return rows
}

async function createModelo(marca_id,description){
    const [result] = await connectDatabase.query(`INSERT INTO modelos (marca_id, descripcion)
    VALUES (?,?)`
    ,[marca_id,description])
    const id = result.insertId;
    return getModelo(id);
}

async function updateModelo(id,marca_id,description) {
    await connectDatabase.query(`UPDATE modelos SET marca_id = ?, descripcion = ? WHERE id = ?`, [marca_id, description, id]);
    return getModelo(id);
}

async function deleteModelo(id) {
    await connectDatabase.query(`DELETE FROM modelos WHERE id = ?`, [id]);
    return { message: 'Modelo eliminado exitosamente' };
}

module.exports = {
    getModelos,
    getModelo,
    createModelo,
    updateModelo,
    deleteModelo
};