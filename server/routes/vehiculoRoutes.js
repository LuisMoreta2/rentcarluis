const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

router.get('/',vehiculoController.getVehiculos);
router.get('/:id',vehiculoController.getVehiculo);
router.post('/', vehiculoController.createVehiculo);
router.put('/:id', vehiculoController.updateVehiculo);
router.delete('/:id', vehiculoController.deleteVehiculo);

module.exports = router;