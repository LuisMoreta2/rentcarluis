const express = require('express');
const router = express.Router();
const rentaController = require('../controllers/rentaController');

router.get('/',rentaController.getRentas);
router.get('/:id',rentaController.getRenta);
router.post('/', rentaController.createRenta);
router.put('/:id', rentaController.updateRenta);
router.delete('/:id', rentaController.deleteRenta);

module.exports = router;