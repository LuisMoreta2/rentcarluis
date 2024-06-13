const express = require('express');
const router = express.Router();
const inspeccionController = require('../controllers/inspeccionController');

router.get('/',inspeccionController.getVehiculo_inspecciones);
router.get('/:id',inspeccionController.getVehiculo_inspeccione);
router.post('/', inspeccionController.createVehiculo_inspecciones);
router.put('/:id', inspeccionController.updateVehiculo_inspeccione);
router.delete('/:id', inspeccionController.deleteVehiculo_inspeccione);

module.exports = router;