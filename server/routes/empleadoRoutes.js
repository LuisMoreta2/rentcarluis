const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.get('/',empleadoController.getEmpleados);
router.get('/:id',empleadoController.getEmpleado);
router.post('/', empleadoController.createEmpleado);
router.put('/:id', empleadoController.updateEmpleado);
router.delete('/:id', empleadoController.deleteEmpleado);

module.exports = router;