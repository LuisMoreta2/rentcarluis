const { connectDatabase } = require('../config/database');

async function getMarcas(){
    const [rows] = await connectDatabase.query('SELECT * FROM marcas')
    return rows
}

async function getMarca(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM marcas WHERE id = ?`,[id])
    return rows
}

async function createMarca(description){
    const [result] = await connectDatabase.query(`INSERT INTO marcas (descripcion)
    VALUES (?)`
    ,[description])
    const id = result.insertId;
    return getMarca(id);
}

async function updateMarca(id, description) {
    await connectDatabase.query(`UPDATE marcas SET descripcion = ? WHERE id = ?`, [description, id]);
    return getMarca(id);
}

async function deleteMarca(id) {
    await connectDatabase.query(`DELETE FROM marcas WHERE id = ?`, [id]);
    return { message: 'Marca eliminado exitosamente' };
}

module.exports = {
    getMarcas,
    getMarca,
    createMarca,
    updateMarca,
    deleteMarca
};