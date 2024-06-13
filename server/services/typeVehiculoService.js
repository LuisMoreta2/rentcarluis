const { connectDatabase } = require('../config/database');

async function getTypevehiculos(){
    const [rows] = await connectDatabase.query('SELECT * FROM typevehiculos');
    return rows
}

async function getTypevehiculo(id){
    const [rows] = await connectDatabase.query(`SELECT * FROM typevehiculos WHERE id = ?`,[id])
    return rows
}

async function createTypevehiculos(description){
    const [result] = await connectDatabase.query(`INSERT INTO typevehiculos (descripcion)
    VALUES (?)`
    ,[description])
    const id = result.insertId;
    return getTypevehiculo(id);
}

async function updateTypevehiculo(id, description) {
    await connectDatabase.query(`UPDATE typevehiculos SET descripcion = ? WHERE id = ?`, [description, id]);
    return getTypevehiculo(id);
}

async function deleteTypevehiculo(id) {
    await connectDatabase.query(`DELETE FROM typevehiculos WHERE id = ?`, [id]);
    return { message: 'Marca eliminado exitosamente' };
}

module.exports = {
    getTypevehiculos,
    getTypevehiculo,
    createTypevehiculos,
    updateTypevehiculo,
    deleteTypevehiculo
}

