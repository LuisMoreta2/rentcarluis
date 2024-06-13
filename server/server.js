
const express = require("express");
const app = express();
const cors = require("cors");
const typeVehiculoRoutes = require('./routes/typeVehiculoRoutes.js')
const marcaRoutes = require('./routes/marcaRoutes.js')
const typeCombustiblesRoutes = require('./routes/typeCombustibleRoutes.js')
const vehiculoRoutes = require('./routes/vehiculoRoutes.js')
const modeloRoutes = require('./routes/modeloRoutes.js')
const clienteRoutes = require('./routes/clienteRoutes.js')
const empleadoRoutes = require('./routes/empleadoRoutes.js')
const inspeccionRoutes = require('./routes/inspeccionRoutes.js')
const rentaService = require('./routes/rentaRoutes.js')

app.use(cors());
app.use(express.json());
app.use('/typevehiculos', typeVehiculoRoutes);
app.use('/marcas', marcaRoutes);
app.use('/combustibles', typeCombustiblesRoutes);
app.use('/modelos', modeloRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/inspeccion', inspeccionRoutes);
app.use('/renta', rentaService);


app.listen(3001, () => {
    console.log(`Servidor corriendo en el puerto 3001`);
});
