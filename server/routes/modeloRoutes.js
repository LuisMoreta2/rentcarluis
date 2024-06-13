const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modeloController');

router.get('/',modeloController.getModelos);
router.get('/:id',modeloController.getModelo);
router.post('/', modeloController.createModelo);
router.put('/:id', modeloController.updateModelo);
router.delete('/:id', modeloController.deleteModelo);

module.exports = router;