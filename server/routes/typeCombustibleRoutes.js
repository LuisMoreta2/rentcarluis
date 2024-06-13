const express = require('express');
const router = express.Router();
const typeCombustibleController = require('../controllers/typeCombustibleController');

router.get('/',typeCombustibleController.getCombustibles);
router.get('/:id',typeCombustibleController.getCombustible);
router.post('/', typeCombustibleController.createCombustible);
router.put('/:id', typeCombustibleController.updateCombustible);
router.delete('/:id', typeCombustibleController.deleteCombustible);

module.exports = router;
