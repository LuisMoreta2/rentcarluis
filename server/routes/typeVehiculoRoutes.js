const express = require('express');
const router = express.Router();
const typeVehiculoController = require('../controllers/typeVehiculoController.js')

router.get('/',typeVehiculoController.getTypevehiculos);
router.get('/:id',typeVehiculoController.getTypevehiculo);
router.post('/', typeVehiculoController.createTypevehiculos);
router.put('/:id', typeVehiculoController.updateTypevehiculo);
router.delete('/:id', typeVehiculoController.deleteTypevehiculo);

module.exports = router;