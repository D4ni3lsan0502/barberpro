const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/auth');

router.post('/', auth, serviceController.criar);
router.get('/', serviceController.listar);
router.delete('/:id', auth, serviceController.deletar);

module.exports = router;
