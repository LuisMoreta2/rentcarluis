const { connectDatabase } = require('../config/database');

/* Combustibles*/
async function getCombustibles(){
    const [rows] = await connectDatabase.query('SELECT * FROM typecombustibles')
    return rows
}

async function getCombustible(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM typecombustibles WHERE id = ?`,[id])
    return rows
}

async function createCombustible(description){
    const [result] = await connectDatabase.query(`INSERT INTO typecombustibles (descripcion)
    VALUES (?)`
    ,[description])
    const id = result.insertId;
    return getCombustible(id);
}

async function updateCombustible(id, description) {
    await connectDatabase.query(`UPDATE typecombustibles SET descripcion = ? WHERE id = ?`, [description, id]);
    return getCombustible(id);
}

async function deleteCombustible(id) {
    await connectDatabase.query(`DELETE FROM typecombustibles WHERE id = ?`, [id]);
    return { message: 'Marca eliminado exitosamente' };
}

module.exports = {
    getCombustibles,
    getCombustible,
    createCombustible,
    updateCombustible,
    deleteCombustible
}